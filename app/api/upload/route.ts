import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateFile, slugify } from "@/lib/utils";
import { writeAuditLog } from "@/lib/auth/auditLog";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const altText = (formData.get("alt_text") as string) ?? "";
    const caption = (formData.get("caption") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";
    const tagsRaw = (formData.get("tags") as string) ?? "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const ext = file.name.split(".").pop() ?? "";
    const baseName = slugify(file.name.replace(`.${ext}`, ""));
    const uniqueName = `${baseName}-${uuidv4().slice(0, 8)}.${ext}`;
    const filePath = `uploads/${uniqueName}`;

    const adminClient = createAdminClient();

    // Upload to Supabase Storage
    const { error: uploadError } = await adminClient.storage
      .from("media")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = adminClient.storage.from("media").getPublicUrl(filePath);

    // Save metadata to DB
    const { data: mediaRow, error: dbError } = await adminClient
      .from("media")
      .insert({
        name: file.name,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        alt_text: altText || null,
        caption: caption || null,
        description: description || null,
        tags,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    await writeAuditLog({
      userId: user.id,
      action: "upload",
      tableName: "media",
      recordId: mediaRow.id,
      newData: { name: file.name, mime_type: file.type },
    });

    return NextResponse.json({ media: mediaRow });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
