import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-less, anonymous Supabase client for PUBLIC page reads (published/public
 * content only, enforced by RLS). Unlike lib/supabase/server.ts, it does NOT
 * read cookies() or force `cache: "no-store"`, so any page that reads ONLY
 * through this client can be statically rendered / ISR-revalidated (and
 * edge-cached) instead of re-rendered dynamically on every request. Content
 * stays fresh via each page's `export const revalidate`.
 *
 * Use the server (cookie) client only for auth/session/admin work.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      // Next.js will NOT cache fetches that carry an Authorization header (which
      // supabase-js always sends) unless we opt in explicitly. This lets public
      // pages be statically rendered / ISR-revalidated (every 60s) instead of
      // dynamically re-rendered on every request.
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, next: { revalidate: 60 } } as RequestInit),
      },
    }
  );
}
