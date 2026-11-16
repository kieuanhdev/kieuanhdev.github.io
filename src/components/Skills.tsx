import type { SVGProps } from "react";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { Marquee } from "./fx.tsx";
import { Section } from "./Section.tsx";

const icons = [IconMobile, IconWeb, IconServer, IconSpark];

export function Skills() {
  const { locale } = usePreferences();
  const names = site.skills.flatMap((group) => group.items);

  return (
    <Section id="skills" index={t(locale, copy.skillsIndex)} title={t(locale, copy.nav[1].label)} lede={t(locale, site.skillNote)}>
      <Marquee items={names} />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {site.skills.map((group, index) => {
          const Icon = icons[index] ?? IconSpark;
          return (
            <li key={group.group.vi} className="glow-card rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <span
                  className="float-icon grid h-11 w-11 place-items-center rounded-2xl bg-chip text-jade"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold tracking-[-0.03em]">{t(locale, group.group)}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function IconMobile(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path strokeLinecap="round" d="M11 18h2" />
    </svg>
  );
}

function IconWeb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" d="M3 9h18M8 5v4" />
    </svg>
  );
}

function IconServer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path strokeLinecap="round" d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}
