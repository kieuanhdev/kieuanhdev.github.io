import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGithub } from "../context/github-context.ts";
import { usePreferences } from "../context/preferences-context.ts";
import { copy, fill } from "../lib/copy.ts";
import { activityCopy, formatDate, formatNumber, safeHttpUrl } from "../lib/format.ts";
import { languageColor } from "../lib/languages.ts";
import { countLanguages, languageBreakdown, latestPushMonths, totalStars } from "../lib/repos.ts";
import { t } from "../lib/text.ts";
import { ExternalLink } from "./ExternalLink.tsx";
import { CountUp } from "./fx.tsx";
import { Section } from "./Section.tsx";

const ease = [0.22, 1, 0.36, 1] as const;

export function GithubPanel() {
  const { locale } = usePreferences();
  const github = useGithub();
  const reduced = useReducedMotion() === true;
  const ready = github.status !== "loading";
  const slices = useMemo(() => languageBreakdown(github.repos), [github.repos]);
  const months = useMemo(() => latestPushMonths(github.repos), [github.repos]);
  const maxMonth = Math.max(...months.map((bucket) => bucket.count), 0);

  const activityTitle = github.activitySource === "events" ? copy.activityEvents : copy.activityRepos;
  const activityNote = github.activitySource === "events" ? copy.activityEventsNote : copy.activityReposNote;

  return (
    <Section id="github" index={t(locale, copy.githubIndex)} title={t(locale, copy.nav[3].label)} lede={t(locale, copy.statsNote)}>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label={t(locale, copy.repos)} value={ready ? github.profile.publicRepos : null} />
        <Metric label={t(locale, copy.stars)} value={ready ? totalStars(github.repos) : null} />
        <Metric label={t(locale, copy.languages)} value={ready ? countLanguages(github.repos) : null} />
        <Metric
          label={t(locale, copy.followers)}
          value={ready ? github.profile.followers : null}
          hint={ready ? `${t(locale, copy.following)} ${formatNumber(github.profile.following, locale)}` : undefined}
        />
      </dl>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5 md:p-6">
          <h3 className="text-lg font-semibold">{t(locale, copy.chartTitle)}</h3>
          {!ready ? (
            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-chip" />
          ) : (
            <>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-chip" aria-hidden="true">
                {slices.map((slice) => (
                  <motion.span
                    key={slice.name ?? "other"}
                    className="h-full"
                    initial={reduced ? false : { width: 0 }}
                    whileInView={{ width: `${slice.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease }}
                    style={{ background: languageColor(slice.name) }}
                  />
                ))}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {slices.map((slice) => (
                  <li key={slice.name ?? "other"} className="flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: languageColor(slice.name) }} aria-hidden="true" />
                      <span className="truncate">{slice.name ?? t(locale, copy.other)}</span>
                    </span>
                    <span className="font-mono text-muted">{formatNumber(slice.count, locale)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="glass rounded-3xl p-5 md:p-6">
          <h3 className="text-lg font-semibold">{t(locale, copy.monthTitle)}</h3>
          <p className="mt-2 text-sm text-muted">{t(locale, copy.monthNote)}</p>
          {!ready ? (
            <div className="mt-4 h-28 animate-pulse rounded-2xl bg-chip" />
          ) : (
            <ul className="mt-6 grid grid-cols-12 items-end gap-1" aria-label={t(locale, copy.monthTitle)}>
              {months.map((bucket, index) => {
                const height = maxMonth === 0 ? 0 : (bucket.count / maxMonth) * 100;
                const bar = Math.max(height, bucket.count > 0 ? 10 : 0);
                return (
                  <li key={bucket.key} className="flex flex-col items-center gap-1">
                    <span className="font-mono text-[10px] text-muted">{bucket.count > 0 ? bucket.count : ""}</span>
                    <div className="flex h-24 w-full items-end" aria-hidden="true">
                      <motion.div
                        className="w-full rounded-t-md bg-gradient-to-t from-jade to-accent"
                        initial={reduced ? false : { height: 0 }}
                        whileInView={{ height: `${bar}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.03, ease }}
                        style={reduced ? { height: `${bar}%`, opacity: bucket.count > 0 ? 1 : 0.2 } : { opacity: bucket.count > 0 ? 1 : 0.2 }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted">{bucket.label}</span>
                    <span className="sr-only">
                      {fill(t(locale, copy.monthLabel), {
                        month: String(bucket.month),
                        year: String(bucket.year),
                      })}
                      : {bucket.count}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold">{t(locale, activityTitle)}</h3>
        <p className="mt-2 text-sm text-muted">{ready ? t(locale, activityNote) : t(locale, copy.loadingRepos)}</p>
        {ready && github.activity.length > 0 ? (
          <ol className="mt-4 space-y-3">
            {github.activity.map((item) => {
              const text = activityCopy(item, locale);
              const href = safeHttpUrl(item.repoUrl);
              return (
                <li key={item.id} className="glass grid gap-1 rounded-2xl px-4 py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
                  <time dateTime={item.at} className="text-sm text-muted">
                    {formatDate(item.at, locale)}
                  </time>
                  <div className="min-w-0">
                    {href ? (
                      <ExternalLink href={href} className="text-link font-medium">
                        {text.title}
                      </ExternalLink>
                    ) : (
                      <p className="font-medium">{text.title}</p>
                    )}
                    {text.detail ? <p className="mt-1 text-sm text-muted">{text.detail}</p> : null}
                  </div>
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </Section>
  );
}

function Metric({ label, value, hint }: { label: string; value: number | null; hint?: string }) {
  return (
    <div className="glass rounded-3xl p-4 sm:p-5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
        {value === null ? <span className="inline-block h-9 w-16 animate-pulse rounded-lg bg-chip" /> : <CountUp value={value} />}
      </dd>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
