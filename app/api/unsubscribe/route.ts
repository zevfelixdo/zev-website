import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";

  if (!email) {
    return NextResponse.redirect(`${BASE}/?unsubscribe=missing`);
  }

  // Require a valid signed token — a bare ?email= must not unsubscribe anyone.
  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${BASE}/?unsubscribe=invalid`);
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
