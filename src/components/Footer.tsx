import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { t } from "../lib/text.ts";
import { Container } from "./Section.tsx";

const year = new Date().getFullYear();

export function Footer() {
  const { locale } = usePreferences();

  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <p>{t(locale, copy.footer)}</p>
      </Container>
    </footer>
  );
}
