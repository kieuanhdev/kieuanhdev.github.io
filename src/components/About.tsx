import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { Section } from "./Section.tsx";

export function About() {
  const { locale } = usePreferences();

  return (
    <Section id="about" title={t(locale, copy.nav[0].label)}>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:gap-20">
        <div className="max-w-xl space-y-5 text-base leading-7 md:text-[1.05rem]">
          {site.about.map((paragraph) => (
            <p key={paragraph.vi}>{t(locale, paragraph)}</p>
          ))}
        </div>
        <div>
          <ul className="space-y-4 border-t border-line pt-5 text-sm leading-relaxed">
            {site.facts.map((fact) => (
              <li key={fact.vi} className="text-muted">
                {t(locale, fact)}
              </li>
            ))}
          </ul>
          <ol className="mt-10">
            {site.timeline.map((item) => (
              <li key={item.year} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 border-t border-line py-4">
                <p className="font-mono text-xs text-muted">{item.year}</p>
                <p className="text-sm leading-relaxed">{t(locale, item.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
