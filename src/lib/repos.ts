import type { Repo } from "./types.ts";

export type RepoSort = "recent" | "stars";

export type RepoQuery = {
  query: string;
  language: string | null;
  includeForks: boolean;
  sort: RepoSort;
};

export function filterRepos(repos: Repo[], options: RepoQuery): Repo[] {
  const needle = options.query.trim().toLowerCase();
  const filtered = repos.filter((repo) => {
    if (!options.includeForks && repo.fork) return false;
    if (options.language && repo.language !== options.language) return false;
    if (!needle) return true;
    const haystack = `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""}`.toLowerCase();
    return haystack.includes(needle);
  });

  return filtered.sort((a, b) => {
    if (options.sort === "stars" && a.stars !== b.stars) return b.stars - a.stars;
    if (a.pushedAt === b.pushedAt) return a.name.localeCompare(b.name);
    return a.pushedAt < b.pushedAt ? 1 : -1;
  });
}

export type LanguageSlice = {
  name: string | null;
  count: number;
  percent: number;
};

export function languageBreakdown(repos: Repo[], limit = 6): LanguageSlice[] {
  const counts = new Map<string | null, number>();
  for (const repo of repos) {
    if (repo.fork) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.filter(([name]) => name).slice(0, limit);
  const topNames = new Set(top.map(([name]) => name));
  let other = 0;
  for (const [name, count] of ranked) {
    if (!name || !topNames.has(name)) other += count;
  }

  const slices: Array<{ name: string | null; count: number }> = top.map(([name, count]) => ({
    name,
    count,
  }));
  if (other > 0) slices.push({ name: null, count: other });

  const total = slices.reduce((sum, slice) => sum + slice.count, 0) || 1;
  return slices.map((slice) => ({
    ...slice,
    percent: (slice.count / total) * 100,
  }));
}

export function countLanguages(repos: Repo[]): number {
  const names = new Set<string>();
  for (const repo of repos) {
    if (!repo.fork && repo.language) names.add(repo.language);
  }
  return names.size;
}

export function totalStars(repos: Repo[]): number {
  return repos.reduce((sum, repo) => (repo.fork ? sum : sum + repo.stars), 0);
}

export type MonthBucket = {
  key: string;
  label: string;
  year: number;
  month: number;
  count: number;
};

export function latestPushMonths(repos: Repo[], months = 12): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];
  for (let index = months - 1; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - index, 1));
    buckets.push({
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      label: String(date.getUTCMonth() + 1),
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      count: 0,
    });
  }

  const indexByKey = new Map(buckets.map((bucket, index) => [bucket.key, index]));
  for (const repo of repos) {
    if (repo.fork || !repo.pushedAt) continue;
    const date = new Date(repo.pushedAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const index = indexByKey.get(key);
    if (index !== undefined) buckets[index].count += 1;
  }
  return buckets;
}

export function languageOptions(repos: Repo[], includeForks: boolean): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!includeForks && repo.fork) continue;
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
