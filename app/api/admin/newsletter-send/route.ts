import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendBulkNewsletter } from "@/lib/email";
import type { NewsletterSubscriber } from "@/types/database";

const schema = z.object({
  subject: z.string().min(1).max(200),
  preview_text: z.string().max(300).optional(),
  body: z.string().min(1),
  post_id: z.string().uuid().optional(),
});

async function getAuthUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();
  if (!role) return null;
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { subject, preview_text, body: emailBody, post_id } = parsed.data;
  const supabase = createAdminClient();

  // Get all active subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, first_name")
    .eq("status", "active");

  const recipients = (subscribers ?? []) as Pick<NewsletterSubscriber, "email" | "first_name">[];

  if (recipients.length === 0) {
    return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
  }

  // Send emails
  const { sent } = await sendBulkNewsletter({
    subject,
    previewText: preview_text ?? "",
    html: emailBody,
    recipients: recipients.map((r) => ({ email: r.email, firstName: r.first_name })),
  });

  // Log the send
  await supabase.from("newsletter_sends").insert({
    subject,
    preview_text: preview_text ?? null,
    body: emailBody,
    sent_by: user.id,
    recipient_count: sent,
    post_id: post_id ?? null,
  });

  return NextResponse.json({ ok: true, sent });
}
