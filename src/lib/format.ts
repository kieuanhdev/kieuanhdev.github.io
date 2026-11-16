import type { Activity, Locale } from "./types.ts";

export function intlLocale(locale: Locale): string {
  return locale === "vi" ? "vi-VN" : "en-GB";
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMonthYear(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function activityCopy(item: Activity, locale: Locale): { title: string; detail: string } {
  const repo = item.repoName.split("/").pop() ?? item.repoName;
  const detail = item.text.trim();

  if (locale === "vi") {
    switch (item.kind) {
      case "push":
        return {
          title:
            item.count > 1
              ? `Đẩy ${item.count} commit vào ${repo}`
              : `Đẩy commit vào ${repo}`,
          detail,
        };
      case "create":
        return { title: `Tạo ${detail || "nhánh"} trên ${repo}`, detail: "" };
      case "pr":
        return { title: `Pull request trên ${repo}`, detail };
      case "issue":
        return { title: `Issue trên ${repo}`, detail };
      case "star":
        return { title: `Gắn sao ${repo}`, detail: "" };
      case "fork":
        return { title: `Fork ${repo}`, detail: "" };
      case "release":
        return { title: `Phát hành trên ${repo}`, detail };
      case "update":
        return { title: `Cập nhật ${repo}`, detail: "" };
      default:
        return { title: repo, detail };
    }
  }

  switch (item.kind) {
    case "push":
      return {
        title:
          item.count > 1 ? `Pushed ${item.count} commits to ${repo}` : `Pushed to ${repo}`,
        detail,
      };
    case "create":
      return { title: `Created ${detail || "a ref"} on ${repo}`, detail: "" };
    case "pr":
      return { title: `Pull request on ${repo}`, detail };
    case "issue":
      return { title: `Issue on ${repo}`, detail };
    case "star":
      return { title: `Starred ${repo}`, detail: "" };
    case "fork":
      return { title: `Forked ${repo}`, detail: "" };
    case "release":
      return { title: `Released on ${repo}`, detail };
    case "update":
      return { title: `Updated ${repo}`, detail: "" };
    default:
      return { title: repo, detail };
  }
}

export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

export function isSafeHref(value: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(value.trim());
}
