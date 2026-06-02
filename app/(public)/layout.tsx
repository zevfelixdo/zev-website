import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import type { NavItem, SiteSettings } from "@/types/database";

async function getNavItems(): Promise<NavItem[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("nav_items")
      .select("*")
      .is("parent_id", null)
      .order("position");
    return (data ?? []) as NavItem[];
  } catch {
    return [];
  }
}

async function getFooterSettings(): Promise<SiteSettings["footer"] | undefined> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "footer")
      .single();
    return data?.value as SiteSettings["footer"];
  } catch {
    return undefined;
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [navItems, footerSettings] = await Promise.all([getNavItems(), getFooterSettings()]);

  return (
    <>
      <Nav items={navItems} />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer settings={footerSettings} />
    </>
  );
}
