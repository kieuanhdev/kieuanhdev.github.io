import type { Locale, Localized } from "./types.ts";

export function t(locale: Locale, text: Localized): string {
  return text[locale];
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
