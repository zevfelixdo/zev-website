"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [footer, setFooter] = useState({
    tagline: "",
    email: "",
    social: { twitter: "", linkedin: "", instagram: "" },
    copyright: "",
  });
  const [seo, setSeo] = useState({
    defaultTitle: "",
    defaultDescription: "",
    ogImage: "",
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [comingSoon, setComingSoon] = useState({ enabled: false, heading: "", message: "" });
  const [previewToken, setPreviewToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      supabase.from("site_settings").select("value").eq("key", "footer").single(),
      supabase.from("site_settings").select("value").eq("key", "seo").single(),
      supabase.from("site_settings").select("value").eq("key", "profile_photo_url").single(),
      supabase.from("site_settings").select("value").eq("key", "coming_soon").maybeSingle(),
      supabase.from("site_settings").select("value").eq("key", "preview_token").maybeSingle(),
    ]).then(([footerRes, seoRes, photoRes, csRes, tokenRes]) => {
      if (footerRes.data) setFooter(footerRes.data.value as typeof footer);
      if (seoRes.data) {
        const v = seoRes.data.value as typeof seo & { titleTemplate?: string };
        setSeo({ defaultTitle: v.defaultTitle, defaultDescription: v.defaultDescription, ogImage: v.ogImage });
      }
      if (photoRes.data) setProfilePhotoUrl(photoRes.data.value as string ?? "");
      if (csRes.data?.value) {
        const v = csRes.data.value as { enabled?: boolean; heading?: string; message?: string };
        setComingSoon({ enabled: !!v.enabled, heading: v.heading ?? "", message: v.message ?? "" });
      }
      if (typeof tokenRes.data?.value === "string") setPreviewToken(tokenRes.data.value);
      setLoaded(true);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from("site_settings").upsert({ key: "footer", value: footer }),
        supabase.from("site_settings").upsert({
          key: "seo",
          value: { ...seo, titleTemplate: "%s | " + seo.defaultTitle },
        }),
        supabase.from("site_settings").upsert({ key: "profile_photo_url", value: profilePhotoUrl }),
        supabase.from("site_settings").upsert({ key: "coming_soon", value: comingSoon }),
      ]);
      toast.success("Settings saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (!loaded) return <div className="text-text-muted text-sm p-4">Loading…</div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-text-base">Site Settings</h1>
        <p className="text-text-muted mt-1">Footer content, SEO defaults, and contact info.</p>
      </div>

      {/* Footer */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-text-base">Footer</h2>
        <Input label="Tagline" value={footer.tagline} onChange={(e) => setFooter((f) => ({ ...f, tagline: e.target.value }))} />
        <Input label="Contact email" type="email" value={footer.email} onChange={(e) => setFooter((f) => ({ ...f, email: e.target.value }))} />
        <Input label="Copyright name" value={footer.copyright} onChange={(e) => setFooter((f) => ({ ...f, copyright: e.target.value }))} />
        <Input label="LinkedIn URL" type="url" value={footer.social.linkedin} onChange={(e) => setFooter((f) => ({ ...f, social: { ...f.social, linkedin: e.target.value } }))} />
        <Input label="Instagram URL" type="url" value={footer.social.instagram} onChange={(e) => setFooter((f) => ({ ...f, social: { ...f.social, instagram: e.target.value } }))} />
      </section>

      {/* SEO */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-text-base">SEO defaults</h2>
        <Input label="Default site title" value={seo.defaultTitle} onChange={(e) => setSeo((s) => ({ ...s, defaultTitle: e.target.value }))} />
        <Textarea label="Default description" rows={2} value={seo.defaultDescription} onChange={(e) => setSeo((s) => ({ ...s, defaultDescription: e.target.value }))} />
        <Input label="Default OG image URL" type="url" value={seo.ogImage} onChange={(e) => setSeo((s) => ({ ...s, ogImage: e.target.value }))} helper="Recommended: 1200×630 px" />
      </section>

      {/* Profile photo */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-text-base">About page photo</h2>
        <p className="text-sm text-text-muted">Shown on the About page sidebar. Upload to Media Library first, then select here.</p>
        <ImagePicker
          value={profilePhotoUrl}
          onChange={setProfilePhotoUrl}
          placeholder="Pick from library or paste URL"
        />
      </section>

      {/* Site visibility / coming soon */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-text-base">Site visibility</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={comingSoon.enabled}
            onChange={(e) => setComingSoon((c) => ({ ...c, enabled: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span>
            <span className="font-medium text-text-base">Coming soon mode</span>
            <span className="block text-sm text-text-muted">
              When on, the public sees a holding page. You (logged in here) and anyone with the
              preview link still see the full site. Takes effect within ~30 seconds of saving.
            </span>
          </span>
        </label>
        <Input
          label="Holding-page heading"
          value={comingSoon.heading}
          onChange={(e) => setComingSoon((c) => ({ ...c, heading: e.target.value }))}
          placeholder="Something new is on the way"
        />
        <Textarea
          label="Holding-page message"
          rows={2}
          value={comingSoon.message}
          onChange={(e) => setComingSoon((c) => ({ ...c, message: e.target.value }))}
          placeholder="This site is getting a refresh. Please check back soon."
        />
        {previewToken && (
          <div className="rounded-lg border border-border bg-surface-alt/40 p-3 text-sm">
            <p className="font-medium text-text-base">Shareable preview link</p>
            <p className="text-text-muted mb-2">
              Open this path on your site to unlock the full preview without logging in:
            </p>
            <code className="block break-all text-xs text-primary">/api/preview?token={previewToken}</code>
          </div>
        )}
      </section>

      <Button onClick={save} loading={saving}>Save settings</Button>
    </div>
  );
}
