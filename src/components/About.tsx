import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { Section } from "./Section.tsx";

export function About() {
  const { locale } = usePreferences();

  return (
    <Section id="about" index={t(locale, copy.aboutIndex)} title={t(locale, copy.nav[0].label)}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:gap-16">
        <div className="max-w-xl space-y-5 text-base leading-7 md:text-[1.05rem]">
          {site.about.map((paragraph) => (
            <p key={paragraph.vi}>{t(locale, paragraph)}</p>
          ))}
        </div>
        <div>
          <ul className="grid gap-3">
            {site.facts.map((fact) => (
              <li key={fact.vi} className="glass rounded-2xl px-4 py-3 text-sm leading-relaxed text-muted">
                {t(locale, fact)}
              </li>
            ))}
          </ul>
          <ol className="relative mt-8 border-l border-line pl-6">
            {site.timeline.map((item) => (
              <li key={item.year} className="relative py-3">
                <span className="timeline-dot" aria-hidden="true" />
                <p className="font-mono text-xs text-jade">{item.year}</p>
                <p className="mt-1 text-sm leading-relaxed">{t(locale, item.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
