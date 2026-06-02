import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed one-click unsubscribe tokens.
 *
 * Newsletter emails link to /api/unsubscribe?email=<addr>&token=<hmac>, so only
 * links we generated can unsubscribe an address — a bare ?email= can't. The
 * secret is a dedicated UNSUBSCRIBE_SECRET if set, otherwise the server-only
 * service-role key (always present, never leaves the server; the token is a
 * one-way HMAC, so it never reveals the key).
 *
 * Server-only (uses node:crypto) — import only from server code.
 */
function secret(): string {
  return process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function makeUnsubscribeToken(email: string): string {
  return createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string | null | undefined): boolean {
  if (!email || !token || !secret()) return false;
  const expected = makeUnsubscribeToken(email);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
