// Rewrites src/data/fallback.ts from the public GitHub API.
// Usage: npm run fallback

const userUrl = "https://api.github.com/users/kieuanhdev";
const reposUrl =
  "https://api.github.com/users/kieuanhdev/repos?per_page=100&sort=updated&type=owner";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "kieuanh-portfolio",
  "X-GitHub-Api-Version": "2022-11-28",
};

function homepage(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return null;
}

const userResponse = await fetch(userUrl, { headers });
if (!userResponse.ok) {
  throw new Error(`Profile request failed: ${userResponse.status}`);
}
const user = await userResponse.json();

const reposResponse = await fetch(reposUrl, { headers });
if (!reposResponse.ok) {
  throw new Error(`Repos request failed: ${reposResponse.status}`);
}
const rawRepos = await reposResponse.json();

const profile = {
  login: user.login,
  name: user.name ?? null,
  avatarUrl: user.avatar_url,
  htmlUrl: user.html_url,
  publicRepos: user.public_repos,
  followers: user.followers,
  following: user.following,
  createdAt: user.created_at,
};

const repos = rawRepos
  .map((repo) => ({
    id: repo.id,
    name: repo.name,
    htmlUrl: repo.html_url,
    description: repo.description ?? null,
    language: repo.language ?? null,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? 0,
    fork: Boolean(repo.fork),
    pushedAt: repo.pushed_at ?? repo.updated_at,
    homepage: homepage(repo.homepage),
    topics: Array.isArray(repo.topics) ? repo.topics : [],
  }))
  .sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1));

const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

const file = `// Snapshot of the public GitHub API, used when api.github.com is rate-limited or unreachable.
// Refresh with: npm run fallback
// Generated ${generatedAt}. Do not edit by hand unless you mean to override the snapshot.

import type { Profile, Repo } from "../lib/types.ts";

export const fallbackGeneratedAt = ${JSON.stringify(generatedAt)};

export const fallbackProfile: Profile = ${JSON.stringify(profile, null, 2)};

export const fallbackRepos: Repo[] = ${JSON.stringify(repos, null, 2)};
`;

const { writeFile } = await import("node:fs/promises");
await writeFile(new URL("../src/data/fallback.ts", import.meta.url), file, "utf8");
console.log(`Wrote ${repos.length} repos to src/data/fallback.ts`);
