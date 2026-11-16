import { useGithub } from "../context/github-context.ts";
import { usePreferences } from "../context/preferences-context.ts";
import { copy, fill } from "../lib/copy.ts";
import { formatDate, formatDateTime } from "../lib/format.ts";
import { t } from "../lib/text.ts";

export function DataNote() {
  const { locale } = usePreferences();
  const github = useGithub();
  const time = github.fetchedAt ? formatDateTime(github.fetchedAt, locale) : "";
  const date = github.fetchedAt ? formatDate(github.fetchedAt, locale) : "";

  let message = t(locale, copy.loadingRepos);
  let warn = false;

  if (github.status === "live") message = fill(t(locale, copy.liveAt), { time });
  else if (github.status === "cached" && github.notice === "stale") {
    message = t(locale, copy.noticeStale);
    warn = true;
  } else if (github.status === "cached") message = fill(t(locale, copy.cachedAt), { time });
  else if (github.notice === "rate") {
    message = fill(t(locale, copy.noticeRate), { date });
    warn = true;
  } else if (github.notice === "forced") {
    message = fill(t(locale, copy.noticeForced), { date });
    warn = true;
  } else if (github.status === "fallback") {
    message = fill(t(locale, copy.noticeError), { date });
    warn = true;
  }

  return (
    <p
      role="status"
      className={warn ? "border-l-2 border-ink pl-3 text-sm leading-relaxed" : "text-sm text-muted"}
    >
      {message}
    </p>
  );
}
