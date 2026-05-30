import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAuditLog } from "@/lib/auth/auditLog";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// Crops/resizes an existing media image into a NEW media item (non-destructive).
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { mediaId, crop } = (await req.json()) as {
      mediaId: string;
      crop: { x: number; y: number; width: number; height: number };
    };
    if (!mediaId || !crop || crop.width < 1 || crop.height < 1) {
      return NextResponse.json({ error: "Invalid crop request" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: source, error: srcErr } = await admin.from("media").select("*").eq("id", mediaId).single();
    if (srcErr || !source) return NextResponse.json({ error: "Source image not found" }, { status: 404 });

    // Download the original from storage
    const { data: blob, error: dlErr } = await admin.storage.from("media").download(source.file_path);
    if (dlErr || !blob) return NextResponse.json({ error: "Could not read original" }, { status: 500 });
    const inputBuf = Buffer.from(await blob.arrayBuffer());

    // Clamp the crop rectangle to the image bounds
    const meta = await sharp(inputBuf).metadata();
    const iw = meta.width ?? 0;
    const ih = meta.height ?? 0;
    const left = Math.max(0, Math.min(Math.round(crop.x), iw - 1));
    const top = Math.max(0, Math.min(Math.round(crop.y), ih - 1));
    const width = Math.max(1, Math.min(Math.round(crop.width), iw - left));
    const height = Math.max(1, Math.min(Math.round(crop.height), ih - top));

    // Crop, cap very large outputs, and re-encode
    let pipeline = sharp(inputBuf).extract({ left, top, width, height });
    if (width > 2400) pipeline = pipeline.resize({ width: 2400 });
    const outBuf = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const outMeta = await sharp(outBuf).metadata();

    const baseName = (source.name || "image").replace(/\.[^.]+$/, "");
    const filePath = `uploads/${uuidv4().slice(0, 8)}-crop.jpg`;
    const { error: upErr } = await admin.storage.from("media").upload(filePath, outBuf, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data: { publicUrl } } = admin.storage.from("media").getPublicUrl(filePath);

    const { data: mediaRow, error: dbErr } = await admin
      .from("media")
      .insert({
        name: `${baseName} (crop).jpg`,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: "image/jpeg",
        size_bytes: outBuf.length,
        width: outMeta.width ?? width,
        height: outMeta.height ?? height,
        alt_text: source.alt_text ?? null,
        tags: Array.from(new Set([...(source.tags ?? []), "crop"])),
        uploaded_by: user.id,
      })
      .select()
      .single();
    if (dbErr) throw dbErr;

    await writeAuditLog({
      userId: user.id,
      action: "crop",
      tableName: "media",
      recordId: mediaRow.id,
      newData: { from: mediaId, crop: { left, top, width, height } },
    });

    return NextResponse.json({ media: mediaRow });
  } catch (err) {
    console.error("Crop error:", err);
    return NextResponse.json({ error: "Crop failed" }, { status: 500 });
  }
}
