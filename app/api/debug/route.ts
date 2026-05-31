import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// TEMPORARY diagnostic — remove after use.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)";
  const host = url.replace(/^https?:\/\//, "").split(".")[0];
  const anonKeySuffix = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "(unset)").slice(-6);
  const out: Record<string, unknown> = { supabaseHost: host, anonKeySuffix };
  try {
    const supabase = createClient();
    for (const t of ["nav_items", "cv_entries", "projects", "image_placements", "publications"]) {
      const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
      out[t] = error ? `ERR ${error.message}` : count;
    }
  } catch (e) {
    out.fatal = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(out);
}
