import { useEffect, useState } from "react";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { IconClose, IconMenu, IconMoon, IconSun } from "./Icons.tsx";
import { Container } from "./Section.tsx";

export function Header() {
  const { locale, theme, setLocale, toggleTheme } = usePreferences();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const themeLabel = t(locale, theme === "dark" ? copy.themeToLight : copy.themeToDark);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line">
      <Container className="flex h-14 items-center justify-between gap-4">
        <a href="#top" className="text-sm font-semibold tracking-[-0.02em]">
          {site.nameLines[site.nameLines.length - 1]}
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label={locale === "vi" ? "Mục lục" : "Sections"}>
          {copy.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="text-sm text-muted hover:text-ink">
              {t(locale, item.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div role="group" aria-label={t(locale, copy.language)} className="mr-1 flex items-center text-sm">
            {(["vi", "en"] as const).map((code, index) => (
              <span key={code} className="flex items-center">
                {index === 1 ? <span className="px-1.5 text-line" aria-hidden="true">/</span> : null}
                <button
                  type="button"
                  aria-pressed={locale === code}
                  onClick={() => setLocale(code)}
                  className={`min-h-10 px-0.5 ${locale === code ? "font-semibold text-ink" : "text-muted"}`}
                >
                  {code.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={themeLabel}
            className="grid h-10 w-10 place-items-center"
          >
            {theme === "dark" ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            <span className="sr-only">{t(locale, open ? copy.closeMenu : copy.openMenu)}</span>
          </button>
        </div>
      </Container>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line bg-paper md:hidden" aria-label={locale === "vi" ? "Mục lục" : "Sections"}>
          <Container className="flex flex-col py-2">
            {copy.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="border-b border-line py-4 text-2xl font-medium tracking-[-0.03em] last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {t(locale, item.label)}
              </a>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
