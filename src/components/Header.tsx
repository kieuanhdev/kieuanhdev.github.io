import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { flushSync } from "react-dom";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { cx, t } from "../lib/text.ts";
import { IconClose, IconMenu, IconMoon, IconSun } from "./Icons.tsx";
import { Container } from "./Section.tsx";

export function Header() {
  const { locale, theme, setLocale, toggleTheme } = usePreferences();
  const reduced = useReducedMotion() === true;
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

  function onTheme() {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (!reduced && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => {
        flushSync(() => toggleTheme());
      });
      return;
    }
    toggleTheme();
  }

  return (
    <header className="site-header sticky top-0 z-40">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-[-0.03em]">
          <span className="mark" aria-hidden="true">
            <span>KA</span>
          </span>
          {site.nameLines[site.nameLines.length - 1]}
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label={locale === "vi" ? "Mục lục" : "Sections"}>
          {copy.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="nav-link">
              {t(locale, item.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div
            role="group"
            aria-label={t(locale, copy.language)}
            className="mr-1 flex items-center rounded-full border border-line bg-paper-2/70 p-1 text-sm"
          >
            {(["vi", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
                className={cx(
                  "relative min-h-9 min-w-10 rounded-full px-2.5",
                  locale === code ? "text-on-accent" : "text-muted",
                )}
              >
                {locale === code ? (
                  <motion.span
                    layoutId={reduced ? undefined : "locale-pill"}
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onTheme}
            aria-pressed={theme === "dark"}
            aria-label={themeLabel}
            className="grid h-11 w-11 place-items-center rounded-full border border-line"
          >
            <motion.span
              key={theme}
              initial={reduced ? false : { rotate: -70, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="grid place-items-center"
            >
              {theme === "dark" ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
            </motion.span>
          </button>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            <span className="sr-only">{t(locale, open ? copy.closeMenu : copy.openMenu)}</span>
          </button>
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            aria-label={locale === "vi" ? "Mục lục" : "Sections"}
            className="overflow-hidden border-t border-line bg-paper/95 backdrop-blur-xl md:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
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
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
