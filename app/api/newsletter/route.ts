import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(254).trim().toLowerCase(),
  first_name: z.string().max(100).trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 signups per hour per IP
    const ip = getIp(req);
    const { allowed, resetInSeconds } = checkRateLimit("newsletter", ip, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const supabase = createAdminClient();

    // Upsert so re-subscribing someone who unsubscribed re-activates them
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: parsed.data.email,
        first_name: parsed.data.first_name ?? null,
        status: "active",
        ip_address: ip === "unknown" ? null : ip,
      },
      { onConflict: "email" }
    );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
