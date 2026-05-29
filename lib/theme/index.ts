import type { ThemeConfig } from "@/types/database";

// Converts ThemeConfig into CSS custom properties string
export function themeToCSS(config: ThemeConfig): string {
  const { colors, typography, radii, spacing, shadows } = config;
  return `
    --color-primary: ${colors.primary};
    --color-secondary: ${colors.secondary};
    --color-accent: ${colors.accent};
    --color-surface: ${colors.surface};
    --color-surface-alt: ${colors.surfaceAlt};
    --color-muted: ${colors.muted};
    --color-text-base: ${colors.textBase};
    --color-text-muted: ${colors.textMuted};
    --color-border: ${colors.border};
    --font-sans: '${typography.fontSans}', system-ui, sans-serif;
    --font-serif: '${typography.fontSerif}', Georgia, serif;
    --font-mono: '${typography.fontMono}', monospace;
    --font-size-base: ${typography.baseSize};
    --line-height-base: ${typography.lineHeight};
    --radius-sm: ${radii.sm};
    --radius: ${radii.default};
    --radius-md: ${radii.md};
    --radius-lg: ${radii.lg};
    --radius-xl: ${radii.xl};
    --section-padding-y: ${spacing.sectionY};
    --shadow-card: ${shadows.card};
    --shadow-dropdown: ${shadows.dropdown};
    --shadow-modal: ${shadows.modal};
  `.trim();
}

// Default theme config used as fallback when DB is unavailable
export const defaultThemeConfig: ThemeConfig = {
  colors: {
    primary: "30 64 48",
    secondary: "100 80 55",
    accent: "200 120 40",
    surface: "255 253 248",
    surfaceAlt: "245 241 234",
    muted: "160 145 125",
    textBase: "35 30 25",
    textMuted: "110 100 85",
    border: "210 200 185",
  },
  typography: {
    fontSans: "Inter",
    fontSerif: "Lora",
    fontMono: "JetBrains Mono",
    baseSize: "16px",
    lineHeight: "1.7",
  },
  radii: {
    sm: "0.25rem",
    default: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  spacing: {
    sectionY: "5rem",
  },
  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
    dropdown: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
  buttons: { style: "rounded" },
  header: { style: "minimal" },
};

// Theme preset gallery available in admin
export const themePresets: { name: string; config: ThemeConfig }[] = [
  {
    name: "Warm Earth",
    config: defaultThemeConfig,
  },
  {
    name: "Ocean Slate",
    config: {
      ...defaultThemeConfig,
      colors: {
        primary: "30 80 120",
        secondary: "60 100 140",
        accent: "10 140 160",
        surface: "248 250 252",
        surfaceAlt: "240 244 248",
        muted: "120 140 160",
        textBase: "20 30 45",
        textMuted: "90 110 130",
        border: "200 215 230",
      },
    },
  },
  {
    name: "Forest Green",
    config: {
      ...defaultThemeConfig,
      colors: {
        primary: "25 80 50",
        secondary: "50 100 70",
        accent: "80 160 80",
        surface: "248 252 248",
        surfaceAlt: "238 245 240",
        muted: "110 140 115",
        textBase: "20 35 25",
        textMuted: "80 110 85",
        border: "195 215 200",
      },
    },
  },
  {
    name: "Monochrome",
    config: {
      ...defaultThemeConfig,
      colors: {
        primary: "30 30 30",
        secondary: "80 80 80",
        accent: "60 60 60",
        surface: "255 255 255",
        surfaceAlt: "245 245 245",
        muted: "150 150 150",
        textBase: "20 20 20",
        textMuted: "100 100 100",
        border: "215 215 215",
      },
    },
  },
];
