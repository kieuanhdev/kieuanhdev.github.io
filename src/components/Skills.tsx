import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { Section } from "./Section.tsx";

export function Skills() {
  const { locale } = usePreferences();

  return (
    <Section id="skills" title={t(locale, copy.nav[1].label)} lede={t(locale, site.skillNote)}>
      <ul className="border-t border-line">
        {site.skills.map((group) => (
          <li key={group.group.vi} className="grid gap-2 border-b border-line py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:items-baseline md:gap-8">
            <h3 className="text-sm font-medium">{t(locale, group.group)}</h3>
            <p className="text-sm leading-7 text-muted md:text-base">{group.items.join("  ·  ")}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
