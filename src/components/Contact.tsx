import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { isSafeHref } from "../lib/format.ts";
import { t } from "../lib/text.ts";
import { Section } from "./Section.tsx";

function visibleHref(href: string): string {
  return href.replace(/^mailto:/i, "").replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function Contact() {
  const { locale } = usePreferences();

  return (
    <Section id="contact" title={t(locale, copy.nav[4].label)} lede={t(locale, site.contactLead)}>
      <ul className="grid border-t border-line sm:grid-cols-2">
        {site.contacts.map((contact) => {
          const safe = isSafeHref(contact.href);
          const body = (
            <>
              <span className="text-sm text-muted">
                {contact.label}
                {contact.placeholder ? ` · ${t(locale, copy.placeholder).toLowerCase()}` : ""}
              </span>
              <span className="mt-2 block text-lg font-medium tracking-[-0.02em] break-all">{visibleHref(contact.href)}</span>
            </>
          );
          return (
            <li key={contact.id} className="border-b border-line sm:odd:border-r sm:odd:pr-10 sm:even:pl-10">
              {safe ? (
                <a
                  href={contact.href}
                  className="block py-6"
                  {...(contact.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer noopener" })}
                >
                  {body}
                  {contact.href.startsWith("mailto:") ? null : <span className="sr-only"> {t(locale, copy.newTab)}</span>}
                </a>
              ) : (
                <div className="py-6">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted">{t(locale, site.contactNote)}</p>
    </Section>
  );
}
