"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ThemeConfig } from "@/types/database";
import { themeToCSS } from "@/lib/theme";

const ThemeContext = createContext<ThemeConfig | null>(null);

export function useTheme() {
  return useContext(ThemeContext);
}

interface Props {
  config: ThemeConfig;
  children: ReactNode;
}

export function ThemeProvider({ config, children }: Props) {
  // Strip < and > so a malicious theme value can't break out of the <style> tag.
  const css = themeToCSS(config).replace(/[<>]/g, "");

  return (
    <ThemeContext.Provider value={config}>
      <style dangerouslySetInnerHTML={{ __html: `:root { ${css} }` }} />
      {children}
    </ThemeContext.Provider>
  );
}
