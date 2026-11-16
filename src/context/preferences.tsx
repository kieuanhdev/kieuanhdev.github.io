import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale, Theme } from "../lib/types.ts";
import { PreferencesContext, type Preferences } from "./preferences-context.ts";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private mode can throw. Fall through to the system preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem("locale");
    if (stored === "en" || stored === "vi") return stored;
  } catch {
    // Ignore storage failures and keep Vietnamese.
  }
  return "vi";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [locale, setLocaleState] = useState<Locale>(readLocale);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = locale;
    document.documentElement.style.colorScheme = theme;
  }, [locale, theme]);

  const value = useMemo<Preferences>(
    () => ({
      locale,
      theme,
      setLocale: (next) => {
        setLocaleState(next);
        try {
          localStorage.setItem("locale", next);
        } catch {
          // The choice still applies for this visit.
        }
      },
      toggleTheme: () => {
        setTheme((current) => {
          const next = current === "dark" ? "light" : "dark";
          try {
            localStorage.setItem("theme", next);
          } catch {
            // The choice still applies for this visit.
          }
          return next;
        });
      },
    }),
    [locale, theme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
