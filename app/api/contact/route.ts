import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactNotification } from "@/lib/email";
import { checkRateLimit, getIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(254).trim(),
  subject: z.string().max(200).trim().optional(),
  message: z.string().min(10).max(5000).trim(),
  _honey: z.string().max(0).optional(), // honeypot — must be empty
});

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 submissions per 10 minutes per IP
    const ip = getIp(req);
    const { allowed, resetInSeconds } = checkRateLimit("contact", ip, 3, 10 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many submissions. Please wait ${resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { _honey, ...data } = parsed.data;

    // Reject if honeypot was filled
    if (_honey) {
      return NextResponse.json({ ok: true }); // silently succeed to confuse bots
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
      ip_address: ip === "unknown" ? null : ip,
      status: "new",
    });

    if (error) throw error;

    // Send email notification (non-blocking — don't fail the request if this errors)
    sendContactNotification({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    }).catch((err) => console.error("Contact notification email failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
