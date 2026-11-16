import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGithub } from "../context/github-context.ts";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { formatDate, formatNumber, safeHttpUrl } from "../lib/format.ts";
import { languageColor } from "../lib/languages.ts";
import { filterRepos, languageOptions, type RepoSort } from "../lib/repos.ts";
import { cx, t } from "../lib/text.ts";
import type { Repo } from "../lib/types.ts";
import { DataNote } from "./DataNote.tsx";
import { ExternalLink } from "./ExternalLink.tsx";
import { Tilt } from "./fx.tsx";
import { IconStar } from "./Icons.tsx";
import { Section } from "./Section.tsx";

const PAGE = 12;
const ease = [0.22, 1, 0.36, 1] as const;

export function Projects() {
  const { locale } = usePreferences();
  const github = useGithub();
  const ready = github.status !== "loading";
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [includeForks, setIncludeForks] = useState(false);
  const [sort, setSort] = useState<RepoSort>("recent");
  const [visible, setVisible] = useState(PAGE);

  const options = useMemo(
    () => languageOptions(github.repos, includeForks),
    [github.repos, includeForks],
  );
  const activeLanguage = language && options.some((item) => item.name === language) ? language : null;

  const filtered = useMemo(
    () => filterRepos(github.repos, { query, language: activeLanguage, includeForks, sort }),
    [github.repos, query, activeLanguage, includeForks, sort],
  );

  const repoByName = useMemo(() => {
    const map = new Map<string, Repo>();
    for (const repo of github.repos) map.set(repo.name.toLowerCase(), repo);
    return map;
  }, [github.repos]);

  return (
    <Section id="projects" index={t(locale, copy.projectsIndex)} title={t(locale, copy.nav[2].label)}>
      <DataNote />

      <div className="mt-12">
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{t(locale, copy.featured)}</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted md:text-base">{t(locale, copy.featuredNote)}</p>
        {ready && site.featured.every((item) => !repoByName.has(item.repo.toLowerCase())) ? (
          <p className="glass mt-8 rounded-2xl px-4 py-8 text-sm text-muted">{t(locale, copy.featuredEmpty)}</p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {site.featured.map((item, index) => (
              <FeaturedCard
                key={item.repo}
                index={index}
                repo={repoByName.get(item.repo.toLowerCase())}
                summary={t(locale, item.summary)}
                name={item.repo}
                ready={ready}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h3 className="text-2xl font-semibold tracking-[-0.03em]">{t(locale, copy.allRepos)}</h3>
          {ready ? (
            <p className="text-sm text-muted">
              {formatNumber(filtered.length, locale)} {t(locale, copy.showing)}
            </p>
          ) : null}
        </div>

        <div className="glass mt-5 flex flex-col gap-4 rounded-3xl p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="block w-full lg:max-w-sm">
              <span className="sr-only">{t(locale, copy.searchLabel)}</span>
              <input
                id="repo-search"
                type="search"
                value={query}
                autoComplete="off"
                placeholder={t(locale, copy.searchPlaceholder)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(PAGE);
                }}
                className="field"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div role="radiogroup" aria-label={t(locale, copy.sortLabel)} className="flex items-center gap-2">
                {(
                  [
                    ["recent", copy.sortRecent],
                    ["stars", copy.sortStars],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={sort === value}
                    onClick={() => {
                      setSort(value);
                      setVisible(PAGE);
                    }}
                    className={cx(
                      "min-h-10 rounded-full px-3 text-sm",
                      sort === value ? "bg-ink font-medium text-paper" : "text-muted",
                    )}
                  >
                    {t(locale, label)}
                  </button>
                ))}
              </div>
              <label className="flex min-h-10 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={includeForks}
                  onChange={(event) => {
                    setIncludeForks(event.target.checked);
                    setVisible(PAGE);
                  }}
                />
                {t(locale, copy.includeForks)}
              </label>
            </div>
          </div>

          <label className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted">{t(locale, copy.languages)}</span>
            <select
              value={activeLanguage ?? ""}
              onChange={(event) => {
                setLanguage(event.target.value || null);
                setVisible(PAGE);
              }}
              className="field w-auto min-w-40"
            >
              <option value="">{t(locale, copy.allLanguages)}</option>
              {options.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name} ({option.count})
                </option>
              ))}
            </select>
          </label>
        </div>

        {!ready ? (
          <ul className="mt-6 grid gap-3 md:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="h-28 animate-pulse rounded-2xl bg-chip/70" />
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="glass mt-6 rounded-3xl px-5 py-10">
            <p>{t(locale, copy.noMatch)}</p>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => {
                setQuery("");
                setLanguage(null);
                setIncludeForks(false);
                setVisible(PAGE);
              }}
            >
              {t(locale, copy.clear)}
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {filtered.slice(0, visible).map((repo) => (
                <li key={repo.id}>
                  <RepoCard repo={repo} />
                </li>
              ))}
            </ul>
            {filtered.length > PAGE ? (
              <div className="mt-6 flex justify-center">
                {visible < filtered.length ? (
                  <button type="button" className="btn btn-ghost" onClick={() => setVisible((count) => count + PAGE)}>
                    {t(locale, copy.more)} ({formatNumber(filtered.length - visible, locale)})
                  </button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={() => setVisible(PAGE)}>
                    {t(locale, copy.less)}
                  </button>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </Section>
  );
}

function FeaturedCard({
  repo,
  name,
  summary,
  ready,
  index,
}: {
  repo: Repo | undefined;
  name: string;
  summary: string;
  ready: boolean;
  index: number;
}) {
  const { locale } = usePreferences();
  const reduced = useReducedMotion() === true;
  if (!ready) {
    return (
      <li className="h-40 animate-pulse rounded-3xl bg-chip" aria-hidden="true" />
    );
  }
  if (!repo) return null;

  const href = safeHttpUrl(repo.htmlUrl);
  const language = repo.language;

  return (
    <motion.li
      className="h-full"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 6) * 0.05, ease }}
    >
      <Tilt className="glow-card h-full rounded-3xl p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: languageColor(language ?? null), boxShadow: `0 0 10px ${languageColor(language ?? null)}` }}
              aria-hidden="true"
            />
            {language ?? "—"}
          </p>
          <p className="inline-flex items-center gap-1 font-mono text-xs">
            <IconStar className="h-3.5 w-3.5" />
            {formatNumber(repo.stars, locale)}
          </p>
        </div>
        <h4 className="mt-4 text-2xl font-semibold tracking-[-0.04em] break-words">
          {href ? (
            <ExternalLink href={href} className="text-link">
              {repo.name ?? name}
            </ExternalLink>
          ) : (
            repo.name ?? name
          )}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{summary}</p>
        <p className="mt-4 font-mono text-xs text-muted">{repo.pushedAt ? formatDate(repo.pushedAt, locale) : ""}</p>
      </Tilt>
    </motion.li>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const { locale } = usePreferences();
  const href = safeHttpUrl(repo.htmlUrl);
  const homepage = safeHttpUrl(repo.homepage);

  return (
    <article className="glow-card group h-full rounded-2xl p-4 transition duration-300 hover:-translate-y-1">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="min-w-0 text-base font-semibold break-words">
          {href ? (
            <ExternalLink href={href} className="text-link">
              {repo.name}
            </ExternalLink>
          ) : (
            repo.name
          )}
          {repo.fork ? <span className="ml-2 text-xs font-normal text-muted">{t(locale, copy.fork)}</span> : null}
        </h4>
        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted">
          <IconStar className="h-3.5 w-3.5" />
          {formatNumber(repo.stars, locale)}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: languageColor(repo.language), boxShadow: `0 0 8px ${languageColor(repo.language)}` }}
            aria-hidden="true"
          />
          {repo.language ?? t(locale, copy.other)}
        </span>
        <span>{repo.pushedAt ? formatDate(repo.pushedAt, locale) : "—"}</span>
        {homepage ? (
          <ExternalLink href={homepage} className="text-link">
            {t(locale, copy.website)}
          </ExternalLink>
        ) : null}
      </div>
      {repo.description ? <p className="mt-2 text-sm leading-relaxed text-muted">{repo.description}</p> : null}
    </article>
  );
}
