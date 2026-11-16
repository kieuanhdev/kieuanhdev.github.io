import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { isSafeHref } from "../lib/format.ts";
import { t } from "../lib/text.ts";
import { IconArrow } from "./Icons.tsx";
import { Section } from "./Section.tsx";

function visibleHref(href: string): string {
  return href.replace(/^mailto:/i, "").replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function Contact() {
  const { locale } = usePreferences();

  return (
    <Section id="contact" index={t(locale, copy.contactIndex)} title={t(locale, copy.nav[4].label)} lede={t(locale, site.contactLead)}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {site.contacts.map((contact) => {
          const safe = isSafeHref(contact.href);
          const body = (
            <>
              <span className="flex items-center justify-between gap-3 text-sm text-muted">
                <span>
                  {contact.label}
                  {contact.placeholder ? ` · ${t(locale, copy.placeholder).toLowerCase()}` : ""}
                </span>
                {safe ? <IconArrow className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> : null}
              </span>
              <span className="mt-3 block text-lg font-medium tracking-[-0.03em] break-all">{visibleHref(contact.href)}</span>
            </>
          );
          return (
            <li key={contact.id}>
              {safe ? (
                <a
                  href={contact.href}
                  className="glow-card group block h-full rounded-3xl p-6"
                  {...(contact.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer noopener" })}
                >
                  {body}
                  {contact.href.startsWith("mailto:") ? null : <span className="sr-only"> {t(locale, copy.newTab)}</span>}
                </a>
              ) : (
                <div className="glow-card rounded-3xl p-6">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted">{t(locale, site.contactNote)}</p>
    </Section>
  );
}
