import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

  if (!email) {
    return NextResponse.redirect(`${BASE}/?unsubscribe=missing`);
  }

  try {
    const supabase = createAdminClient();
    await supabase
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed" })
      .eq("email", email.toLowerCase());

    return NextResponse.redirect(`${BASE}/?unsubscribed=1`);
  } catch {
    return NextResponse.redirect(`${BASE}/?unsubscribe=error`);
  }
}
