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

const projectSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  slug: z.string().min(1).max(200).trim(),
  description: z.string().max(1000).optional(),
  body: z.string().optional(),
  image_id: z.string().uuid().optional().nullable(),
  external_url: z.string().url().optional().nullable(),
  status: z.enum(["active", "completed", "idea", "archived"]).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  position: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, image:image_id(*)")
    .order("position");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ projects: data });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    userId: auth.user.id,
    action: "create",
    tableName: "projects",
    recordId: data.id,
    newData: data,
  });

  if (data.is_published) {
    await upsertSearchEntry({
      contentType: "project",
      contentId: data.id,
      title: data.title,
      excerpt: data.description ?? undefined,
      body: data.body ? stripHtml(data.body) : undefined,
      tags: data.tags,
      url: `/work#${data.slug}`,
    });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("projects").select("*").eq("id", id).single();
  const { data, error } = await supabase
    .from("projects")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAuditLog({
    userId: auth.user.id,
    action: "update",
    tableName: "projects",
    recordId: id,
    oldData: current ?? undefined,
    newData: data,
  });

  if (data.is_published) {
    await upsertSearchEntry({
      contentType: "project",
      contentId: data.id,
      title: data.title,
      excerpt: data.description ?? undefined,
      body: data.body ? stripHtml(data.body) : undefined,
      tags: data.tags,
      url: `/work#${data.slug}`,
    });
  } else {
    await removeSearchEntry("project", id);
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data: current } = await supabase.from("projects").select("*").eq("id", id).single();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await removeSearchEntry("project", id);
  await writeAuditLog({
    userId: auth.user.id,
    action: "delete",
    tableName: "projects",
    recordId: id,
    oldData: current ?? undefined,
  });

  return NextResponse.json({ ok: true });
}
