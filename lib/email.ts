import { Resend } from "resend";
import { makeUnsubscribeToken } from "@/lib/unsubscribe-token";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM = "Zev Felix <hello@zevfelix.com>";
const NOTIFY_TO = process.env.NOTIFICATION_EMAIL ?? "zev@zevfelix.com";

/** Escape user-provided text before interpolating it into notification email HTML. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Contact form notification ────────────────────────────────────────────────
export async function sendContactNotification(opts: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const resend = getResend();
  // Escape submitter-controlled fields so a submission can't inject HTML into the inbox.
  const name = escapeHtml(opts.name);
  const email = escapeHtml(opts.email);
  const subject = opts.subject ? escapeHtml(opts.subject) : "";
  const message = escapeHtml(opts.message);
  await resend.emails.send({
    from: FROM,
    to: NOTIFY_TO,
    replyTo: opts.email,
    subject: `New message from ${opts.name}${opts.subject ? `: ${opts.subject}` : ""}`,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      <hr />
      <p style="white-space:pre-wrap;">${message}</p>
      <hr />
      <p style="color:#999;font-size:12px;">Sent via zevfelix.com contact form</p>
    `,
  });
}

// ── Newsletter confirmation (double opt-in) ──────────────────────────────────
export async function sendNewsletterConfirmation(opts: {
  email: string;
  firstName?: string;
  confirmUrl: string;
}) {
  const resend = getResend();
  const name = opts.firstName ? `, ${opts.firstName}` : "";
  await resend.emails.send({
    from: FROM,
    to: opts.email,
    subject: "Please confirm your subscription",
    html: `
      <p>Hi${name},</p>
      <p>Thanks for signing up! Click below to confirm your subscription to occasional essays on medicine, technology, and the outdoors.</p>
      <p><a href="${opts.confirmUrl}" style="background:rgb(30,64,48);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Confirm subscription</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>— Zev</p>
    `,
  });
}

// ── Bulk newsletter send ─────────────────────────────────────────────────────
export async function sendBulkNewsletter(opts: {
  subject: string;
  previewText: string;
  html: string;
  recipients: Array<{ email: string; firstName?: string | null }>;
}) {
  const resend = getResend();

  // Resend batch API: max 100 per call
  const BATCH_SIZE = 100;
  let sent = 0;

  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    const batch = opts.recipients.slice(i, i + BATCH_SIZE);
    const emails = batch.map((r) => ({
      from: FROM,
      to: r.email,
      subject: opts.subject,
      html: wrapNewsletterHtml(opts.html, opts.previewText, r.firstName, r.email),
    }));

    await resend.batch.send(emails);
    sent += batch.length;
  }

  return { sent };
}

function wrapNewsletterHtml(body: string, previewText: string, firstName?: string | null, email?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zevfelix.com";
  const unsubUrl = email
    ? `${BASE}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${makeUnsubscribeToken(email)}`
    : `${BASE}/contact`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <span style="display:none;max-height:0;overflow:hidden;">${previewText}&nbsp;‌&zwnj;&nbsp;‌&zwnj;</span>
</head>
<body style="font-family:Georgia,serif;background:#FFF8F0;margin:0;padding:40px 16px;">
  <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:8px;padding:48px;border:1px solid #D2C8B9;">
    <p style="font-size:14px;color:#6E6455;margin-bottom:32px;">Zev Felix · zevfelix.com</p>
    <p style="margin-bottom:24px;color:#231E19;">${greeting}</p>
    <div style="color:#231E19;line-height:1.7;">
      ${body}
    </div>
    <hr style="border:none;border-top:1px solid #D2C8B9;margin:40px 0;" />
    <p style="font-size:12px;color:#A0917D;text-align:center;">
      You're receiving this because you subscribed at zevfelix.com.<br/>
      <a href="${unsubUrl}" style="color:#A0917D;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}
