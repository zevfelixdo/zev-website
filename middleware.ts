import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Coming-soon gate config, cached per edge instance so we don't read the DB on
// every public request. Toggling in the admin propagates within GATE_TTL.
let gateCache: { comingSoon: boolean; previewToken: string; at: number } | null = null;
const GATE_TTL = 30_000;

// Routes that are never gated (besides /admin and /api, handled below).
const GATE_BYPASS_EXACT = new Set([
  "/coming-soon",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
  "/feed.xml",
  "/manifest.webmanifest",
]);

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always call getUser() — required to refresh session cookies
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({
    data: { user: null },
  }));

  const { pathname } = request.nextUrl;

  // Let the login page through unconditionally — never redirect it
  if (pathname.startsWith("/admin/login")) {
    return supabaseResponse;
  }

  // Protect all other /admin/* routes (admin is never gated)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Check admin role
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!roleRow) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // ── Coming-soon gate (public site only) ──
  // Bypass: any logged-in user, local dev, /api, the holding page + feeds/og,
  // or a valid preview cookie. Fails open on any error (never hides the site).
  const gateable = !pathname.startsWith("/api") && !GATE_BYPASS_EXACT.has(pathname);
  if (process.env.NODE_ENV === "production" && gateable && !user) {
    const now = Date.now();
    if (!gateCache || now - gateCache.at >= GATE_TTL) {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key,value")
          .in("key", ["coming_soon", "preview_token"]);
        const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
        const cs = map["coming_soon"] as { enabled?: boolean } | boolean | string | undefined;
        const comingSoon =
          cs === true ||
          cs === "true" ||
          (typeof cs === "object" && cs !== null && cs.enabled === true);
        const previewToken =
          typeof map["preview_token"] === "string" ? (map["preview_token"] as string) : "";
        gateCache = { comingSoon, previewToken, at: now };
      } catch {
        gateCache = { comingSoon: false, previewToken: "", at: now };
      }
    }
    if (gateCache.comingSoon) {
      const previewCookie = request.cookies.get("site_preview")?.value;
      const hasPreview = gateCache.previewToken !== "" && previewCookie === gateCache.previewToken;
      if (!hasPreview) {
        const url = request.nextUrl.clone();
        url.pathname = "/coming-soon";
        return NextResponse.rewrite(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
