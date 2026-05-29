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
  const css = themeToCSS(config);

  return (
    <ThemeContext.Provider value={config}>
      <style>{`:root { ${css} }`}</style>
      {children}
    </ThemeContext.Provider>
  );
}
