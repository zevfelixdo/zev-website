/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Works correctly in development and on long-lived Node servers.
 * On Vercel serverless, each function instance has its own memory, so
 * limits reset when a new instance spins up — acceptable for a personal
 * site where the goal is stopping accidental double-submits and basic
 * abuse, not enterprise-grade throttling.
 *
 * If you later need persistent rate limiting across all Vercel instances,
 * swap this out for @upstash/ratelimit + Upstash Redis (free tier).
 */

interface Hit {
  count: number;
  windowStart: number;
}

// One store per limit key (e.g. "contact", "newsletter")
const stores = new Map<string, Map<string, Hit>>();

function getStore(name: string): Map<string, Hit> {
  if (!stores.has(name)) stores.set(name, new Map());
  return stores.get(name)!;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * @param name    - Named bucket, e.g. "contact"
 * @param key     - Per-request key, typically an IP address
 * @param limit   - Max requests allowed in the window
 * @param windowMs - Window length in milliseconds
 */
export function checkRateLimit(
  name: string,
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const store = getStore(name);
  const now = Date.now();
  const existing = store.get(key);

  // If no previous hit, or the window has expired, start fresh
  if (!existing || now - existing.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    const resetInSeconds = Math.ceil((windowMs - (now - existing.windowStart)) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetInSeconds: Math.ceil((windowMs - (now - existing.windowStart)) / 1000),
  };
}

/** Pull the best available IP from the request headers */
export function getIp(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
