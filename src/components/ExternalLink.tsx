import type { ReactNode } from "react";
import { usePreferences } from "../context/preferences-context.ts";
import { copy } from "../lib/copy.ts";
import { cx, t } from "../lib/text.ts";

export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { locale } = usePreferences();
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer noopener">
      {children}
      <span className={cx("sr-only")}> {t(locale, copy.newTab)}</span>
    </a>
  );
}
