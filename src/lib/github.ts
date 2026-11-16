import { fallbackGeneratedAt, fallbackProfile, fallbackRepos } from "../data/fallback.ts";
import type { Activity, GithubData, Profile, Repo } from "./types.ts";

const API = "https://api.github.com";
const CACHE_KEY = "kieuanh-github-v1";
const CACHE_TTL_MS = 30 * 60 * 1000;

type RawRepo = {
  id?: number;
  name?: string;
  html_url?: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  fork?: boolean;
  pushed_at?: string | null;
  updated_at?: string | null;
  homepage?: string | null;
  topics?: string[];
};

type RawEvent = {
  id?: string;
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    action?: string;
    ref?: string;
    ref_type?: string;
    size?: number;
    commits?: Array<{ message?: string }>;
    pull_request?: { title?: string };
    issue?: { title?: string };
    release?: { name?: string | null; tag_name?: string };
  };
};

export class GithubRequestError extends Error {
  kind: "rate" | "error";

  constructor(kind: "rate" | "error", message: string) {
    super(message);
    this.name = "GithubRequestError";
    this.kind = kind;
  }
}

type LivePayload = Pick<GithubData, "profile" | "repos" | "activity" | "activitySource" | "fetchedAt">;

type CacheRecord = {
  savedAt: number;
  data: LivePayload;
};

let inflight: Promise<LivePayload> | null = null;

function httpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

export function normalizeRepo(raw: RawRepo): Repo | null {
  if (!raw.name || !raw.html_url || typeof raw.id !== "number") return null;
  const htmlUrl = httpUrl(raw.html_url);
  if (!htmlUrl) return null;
  return {
    id: raw.id,
    name: raw.name,
    htmlUrl,
    description: raw.description?.trim() ? raw.description.trim() : null,
    language: raw.language ?? null,
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    fork: Boolean(raw.fork),
    pushedAt: raw.pushed_at ?? raw.updated_at ?? "",
    homepage: httpUrl(raw.homepage),
    topics: Array.isArray(raw.topics) ? raw.topics.filter((topic) => typeof topic === "string") : [],
  };
}

function normalizeProfile(raw: {
  login?: string;
  name?: string | null;
  avatar_url?: string;
  html_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  created_at?: string;
}): Profile | null {
  const htmlUrl = httpUrl(raw.html_url);
  const avatarUrl = httpUrl(raw.avatar_url);
  if (!raw.login || !htmlUrl || !avatarUrl || !raw.created_at) return null;
  return {
    login: raw.login,
    name: raw.name ?? null,
    avatarUrl,
    htmlUrl,
    publicRepos: raw.public_repos ?? 0,
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
    createdAt: raw.created_at,
  };
}

function snippet(value: string | undefined, max = 140): string {
  if (!value) return "";
  const line = value.split("\n")[0]?.trim() ?? "";
  return line.length > max ? `${line.slice(0, max - 1)}…` : line;
}

function repoHtml(name: string | undefined): { repoName: string; repoUrl: string } | null {
  if (!name || !name.includes("/")) return null;
  return { repoName: name, repoUrl: `https://github.com/${name}` };
}

export function activityFromEvents(events: RawEvent[]): Activity[] {
  const items: Activity[] = [];
  for (const event of events) {
    const repo = repoHtml(event.repo?.name);
    if (!repo || !event.id || !event.created_at) continue;
    const payload = event.payload ?? {};
    const base = { id: event.id, at: event.created_at, ...repo, count: 1, text: "" };

    switch (event.type) {
      case "PushEvent": {
        const message = payload.commits?.[0]?.message;
        items.push({
          ...base,
          kind: "push",
          count: payload.size ?? payload.commits?.length ?? 1,
          text: snippet(message),
        });
        break;
      }
      case "CreateEvent":
        items.push({
          ...base,
          kind: "create",
          text: [payload.ref_type, payload.ref].filter(Boolean).join(" "),
        });
        break;
      case "PullRequestEvent":
        items.push({
          ...base,
          kind: "pr",
          text: snippet(payload.pull_request?.title ?? payload.action),
        });
        break;
      case "IssuesEvent":
        items.push({
          ...base,
          kind: "issue",
          text: snippet(payload.issue?.title ?? payload.action),
        });
        break;
      case "WatchEvent":
        items.push({ ...base, kind: "star" });
        break;
      case "ForkEvent":
        items.push({ ...base, kind: "fork" });
        break;
      case "ReleaseEvent":
        items.push({
          ...base,
          kind: "release",
          text: snippet(payload.release?.name ?? payload.release?.tag_name ?? undefined),
        });
        break;
      default:
        break;
    }
  }
  return items.slice(0, 6);
}

export function activityFromRepos(repos: Repo[]): Activity[] {
  return [...repos]
    .filter((repo) => !repo.fork && repo.pushedAt)
    .sort((a, b) => (a.pushedAt < b.pushedAt ? 1 : -1))
    .slice(0, 6)
    .map((repo) => ({
      id: `push-${repo.id}`,
      at: repo.pushedAt,
      repoName: `kieuanhdev/${repo.name}`,
      repoUrl: repo.htmlUrl,
      kind: "update" as const,
      text: "",
      count: 1,
    }));
}

async function fetchJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  } catch {
    throw new GithubRequestError("error", "Network error");
  }

  if (response.status === 403 || response.status === 429) {
    throw new GithubRequestError("rate", `GitHub responded ${response.status}`);
  }
  if (!response.ok) {
    throw new GithubRequestError("error", `GitHub responded ${response.status}`);
  }
  return response.json();
}

async function fetchRepos(user: string): Promise<Repo[]> {
  const repos: Repo[] = [];
  let url: string | null = `${API}/users/${user}/repos?per_page=100&sort=updated&type=owner`;
  let page = 0;

  while (url && page < 3) {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
    } catch {
      throw new GithubRequestError("error", "Network error");
    }

    if (response.status === 403 || response.status === 429) {
      throw new GithubRequestError("rate", `GitHub responded ${response.status}`);
    }
    if (!response.ok) throw new GithubRequestError("error", `GitHub responded ${response.status}`);

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) throw new GithubRequestError("error", "Unexpected repo payload");
    for (const item of payload) {
      const repo = normalizeRepo(item as RawRepo);
      if (repo) repos.push(repo);
    }

    const link = response.headers.get("link");
    const next = link?.split(",").find((part) => part.includes('rel="next"'));
    const match = next?.match(/<([^>]+)>/);
    url = match?.[1] ?? null;
    page += 1;
  }

  return repos;
}

async function loadLive(user: string): Promise<LivePayload> {
  const profilePromise = fetchJson(`${API}/users/${user}`);
  const reposPromise = fetchRepos(user);
  const eventsPromise = fetchJson(`${API}/users/${user}/events/public?per_page=30`);

  const [profileResult, reposResult, eventsResult] = await Promise.allSettled([
    profilePromise,
    reposPromise,
    eventsPromise,
  ]);

  if (reposResult.status === "rejected") throw reposResult.reason;

  const profile =
    profileResult.status === "fulfilled"
      ? normalizeProfile(profileResult.value as Parameters<typeof normalizeProfile>[0])
      : null;

  let activitySource: LivePayload["activitySource"] = "repos";
  let activity = activityFromRepos(reposResult.value);
  if (eventsResult.status === "fulfilled" && Array.isArray(eventsResult.value)) {
    const fromEvents = activityFromEvents(eventsResult.value as RawEvent[]);
    if (fromEvents.length > 0) {
      activity = fromEvents;
      activitySource = "events";
    }
  }

  return {
    profile: profile ?? fallbackProfile,
    repos: reposResult.value,
    activity,
    activitySource,
    fetchedAt: new Date().toISOString(),
  };
}

export function loadGithub(user: string): Promise<LivePayload> {
  if (!inflight) {
    inflight = loadLive(user).catch((error: unknown) => {
      inflight = null;
      throw error;
    });
  }
  return inflight;
}

function isLivePayload(value: unknown): value is LivePayload {
  if (!value || typeof value !== "object") return false;
  const record = value as LivePayload;
  return Array.isArray(record.repos) && Boolean(record.profile) && Array.isArray(record.activity);
}

export function readCache(): CacheRecord | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheRecord;
    if (!parsed || typeof parsed.savedAt !== "number" || !isLivePayload(parsed.data)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCache(data: LivePayload): void {
  try {
    const record: CacheRecord = { savedAt: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(record));
  } catch {
    // Ignore quota and private-mode failures. The page still has the live data in memory.
  }
}

export function cacheIsFresh(record: CacheRecord): boolean {
  return Date.now() - record.savedAt < CACHE_TTL_MS;
}

export function fallbackData(notice: Exclude<GithubData["notice"], null>): GithubData {
  return {
    status: "fallback",
    profile: fallbackProfile,
    repos: fallbackRepos,
    activity: activityFromRepos(fallbackRepos),
    activitySource: "repos",
    notice,
    fetchedAt: fallbackGeneratedAt,
  };
}
