"use client";

import { useState } from "react";
import type { Theme, ThemeConfig } from "@/types/database";
import { themePresets, themeToCSS } from "@/lib/theme";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Check, Palette, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Convert "r g b" to #hex
function rgbStringToHex(rgb: string): string {
  const [r, g, b] = rgb.split(" ").map(Number);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// Convert #hex to "r g b"
function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

const COLOR_LABELS: Record<keyof ThemeConfig["colors"], string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  surface: "Surface (bg)",
  surfaceAlt: "Surface Alt",
  muted: "Muted",
  textBase: "Text",
  textMuted: "Text Muted",
  border: "Border",
};

interface ThemeEditorClientProps {
  themes: Theme[];
}

export function ThemeEditorClient({ themes: initialThemes }: ThemeEditorClientProps) {
  const [themes, setThemes] = useState(initialThemes);
  const [activeId, setActiveId] = useState(() => themes.find((t) => t.is_active)?.id ?? themes[0]?.id);
  const [editConfig, setEditConfig] = useState<ThemeConfig | null>(
    () => themes.find((t) => t.id === activeId)?.config ?? null
  );
  const [previewCSS, setPreviewCSS] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");

  const supabase = createClient();

  const selectTheme = (id: string) => {
    const theme = themes.find((t) => t.id === id);
    if (!theme) return;
    setActiveId(id);
    setEditConfig(theme.config);
    setPreviewCSS(null);
  };

  const updateColor = (key: keyof ThemeConfig["colors"], hex: string) => {
    if (!editConfig) return;
    const updated: ThemeConfig = {
      ...editConfig,
      colors: { ...editConfig.colors, [key]: hexToRgbString(hex) },
    };
    setEditConfig(updated);
    setPreviewCSS(themeToCSS(updated));
  };

  const applyPreset = (preset: (typeof themePresets)[number]) => {
    setEditConfig(preset.config);
    setPreviewCSS(themeToCSS(preset.config));
  };

  const saveTheme = async () => {
    if (!editConfig || !activeId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("themes")
        .update({ config: editConfig })
        .eq("id", activeId);
      if (error) throw error;
      setThemes((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, config: editConfig } : t))
      );
      toast.success("Theme saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const activateTheme = async (id: string) => {
    setSaving(true);
    try {
      // Deactivate all, then activate chosen
      await supabase.from("themes").update({ is_active: false }).neq("id", "");
      await supabase.from("themes").update({ is_active: true }).eq("id", id);
      setThemes((prev) =>
        prev.map((t) => ({ ...t, is_active: t.id === id }))
      );
      toast.success("Theme activated — refresh the public site to see changes");
    } catch { toast.error("Failed to activate"); }
    finally { setSaving(false); }
  };

  const createTheme = async () => {
    if (!newName.trim() || !editConfig) return;
    const { data, error } = await supabase
      .from("themes")
      .insert({ name: newName.trim(), is_active: false, config: editConfig })
      .select()
      .single();
    if (error) { toast.error("Failed to create"); return; }
    setThemes((prev) => [...prev, data as Theme]);
    setNewName("");
    toast.success("Theme created");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Theme list */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text-base">Themes</h2>
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => selectTheme(theme.id)}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
              activeId === theme.id
                ? "border-primary bg-primary/5"
                : "border-border bg-surface hover:border-primary/40"
            )}
          >
            <div>
              <p className="font-medium text-sm text-text-base">{theme.name}</p>
              {theme.is_active && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                  <Check size={11} /> Active
                </p>
              )}
            </div>
            {!theme.is_active && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); activateTheme(theme.id); }}
              >
                Activate
              </Button>
            )}
          </div>
        ))}

        {/* Create new */}
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="New theme name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={createTheme} disabled={!newName.trim()}>
            <Plus size={14} />
          </Button>
        </div>

        {/* Presets */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Presets</p>
          <div className="space-y-1">
            {themePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="w-full text-left px-3 py-2 text-sm rounded border border-border hover:border-primary/40 hover:bg-surface-alt transition-colors flex items-center gap-2"
              >
                <Palette size={14} className="text-text-muted" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Color editor */}
      <div className="lg:col-span-2 space-y-5">
        {previewCSS && (
          <style>{`:root { ${previewCSS} }`}</style>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-base">Colors</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPreviewCSS(null)}>
              Reset preview
            </Button>
            <Button size="sm" onClick={saveTheme} loading={saving}>
              Save theme
            </Button>
          </div>
        </div>

        {editConfig && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(Object.keys(editConfig.colors) as Array<keyof ThemeConfig["colors"]>).map((key) => (
                <div key={key}>
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">
                    {COLOR_LABELS[key]}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={rgbStringToHex(editConfig.colors[key])}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-10 h-10 rounded border border-border cursor-pointer"
                    />
                    <span className="text-xs font-mono text-text-muted">{rgbStringToHex(editConfig.colors[key])}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-sm font-semibold text-text-base mb-3">Typography</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Sans-serif font"
                  value={editConfig.typography.fontSans}
                  onChange={(e) =>
                    setEditConfig((c) => c && { ...c, typography: { ...c.typography, fontSans: e.target.value } })
                  }
                  helper="Google Fonts name"
                />
                <Input
                  label="Serif font"
                  value={editConfig.typography.fontSerif}
                  onChange={(e) =>
                    setEditConfig((c) => c && { ...c, typography: { ...c.typography, fontSerif: e.target.value } })
                  }
                />
              </div>
            </div>

            {/* Live preview bar */}
            <div className="p-5 rounded-lg border border-border bg-surface space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Live preview</p>
              <h3 className="font-serif text-2xl font-semibold text-text-base">Heading preview</h3>
              <p className="text-text-muted">Body text preview — this is how your content will appear using the current theme settings.</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded bg-primary text-white text-sm font-medium">Primary button</button>
                <button className="px-4 py-2 rounded border border-border bg-surface text-text-base text-sm font-medium">Secondary button</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
