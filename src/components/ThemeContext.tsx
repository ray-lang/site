"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export type Theme = "github-dark" | "github-light";

const ThemeContext = createContext<Theme>("github-light");

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const initTheme = mql.matches ? "github-dark" : "github-light";
  const [theme, setTheme] = useState<Theme>(initTheme);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const t = e.matches ? "github-dark" : "github-light";
      setTheme(t);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
