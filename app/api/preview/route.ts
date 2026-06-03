import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// GET /api/preview?token=XXXX  → sets a cookie that bypasses the coming-soon gate.
// GET /api/preview?clear       → removes it.
// The token lives in site_settings.preview_token (not in the repo). This is a
// soft gate to keep the public/search engines out while editing, not a security
// boundary — the real content is what will be public soon anyway.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const home = new URL("/", request.url);

  if (params.has("clear")) {
    const res = NextResponse.redirect(home);
    res.cookies.set("site_preview", "", { maxAge: 0, path: "/" });
    return res;
  }

  const token = params.get("token") ?? "";
  let real = "";
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "preview_token")
      .maybeSingle();
    real = typeof data?.value === "string" ? data.value : "";
  } catch {
    return new NextResponse("Preview is unavailable right now.", { status: 500 });
  }

  if (!real || token !== real) {
    return new NextResponse("Invalid or missing preview token.", { status: 401 });
  }

  const res = NextResponse.redirect(home);
  res.cookies.set("site_preview", real, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return res;
}
