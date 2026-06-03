import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Cartoon } from "@/components/public/Cartoon";
import { Blob } from "@/components/public/Blob";
import { Doodle } from "@/components/public/Doodle";

export const metadata: Metadata = {
  title: "Coming soon — Zev Felix, DO",
  description: "Something new is on the way.",
  robots: { index: false, follow: false },
};

export const revalidate = 30;

// The holding page shown to the public while "coming soon" mode is on. Its copy
// is editable in Admin → Settings → Site visibility (site_settings.coming_soon).
export default async function ComingSoonPage() {
  let heading = "Something new is on the way";
  let message = "This site is getting a refresh. Please check back soon.";
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "coming_soon")
      .maybeSingle();
    const v = (data?.value ?? null) as { heading?: string; message?: string } | null;
    if (v?.heading?.trim()) heading = v.heading.trim();
    if (v?.message?.trim()) message = v.message.trim();
  } catch {
    // fall back to the defaults above
  }

  return (
    <main className="min-h-[100svh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-8 h-60 w-60">
        <Blob variant={2} float className="absolute -inset-[14%] h-[128%] w-[128%] text-fun-sky/25" />
        <Blob variant={1} float className="absolute -right-[6%] bottom-0 h-[55%] w-[55%] text-fun-sun/25 blur-[1px]" />
        <Doodle name="sparkle" size={34} float className="absolute right-2 top-0 z-20 text-fun-coral" />
        <Doodle name="star" size={20} className="absolute bottom-6 left-0 z-20 text-fun-tangerine" />
        <div className="absolute inset-0 z-10 flex items-end justify-center">
          <Cartoon name="bike-w-maisy" width={230} priority decorative float className="h-auto w-[210px] sticker" />
        </div>
      </div>
      <p className="eyebrow mb-4">Zev Felix, DO</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-text-base mb-4">{heading}</h1>
      <p className="text-text-muted max-w-md leading-relaxed">{message}</p>
    </main>
  );
}
