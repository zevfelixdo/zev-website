import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/auth/auditLog";
import { upsertSearchEntry, removeSearchEntry } from "@/lib/search";
import { stripHtml, truncate } from "@/lib/utils";
import { z } from "zod";

async function getAuthUser(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: role } = await supabase
    .from("user_roles").select("role").eq("user_id", user.id).single();
  if (!role) return null;
  return { user, role: role.role as string };
}

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  og_image: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
});

// GET /api/admin/pages — list all pages
export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data });
}

// PATCH /api/admin/pages?id=<uuid> — update a page
export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const parsed = updatePageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createAdminClient();

  // Fetch current for audit diff
  const { data: current } = await supabase.from("pages").select("*").eq("id", id).single();

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "published" && current?.status !== "published") {
    updates.published_at = new Date().toISOString();
  }

  const { data: updated, error } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    userId: auth.user.id,
    action: "update",
    tableName: "pages",
    recordId: id,
    oldData: current ?? undefined,
    newData: updated,
  });

  // Update search index if published
  if (updated.status === "published") {
    await upsertSearchEntry({
      contentType: "page",
      contentId: id,
      title: updated.title,
      excerpt: updated.description ?? undefined,
      url: `/${updated.slug === "home" ? "" : updated.slug}`,
      isPublic: true,
    });
  } else {
    await removeSearchEntry("page", id);
  }

  return NextResponse.json({ page: updated });
}
