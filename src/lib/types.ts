export type Locale = "vi" | "en";

export type Localized = {
  readonly vi: string;
  readonly en: string;
};

export type Theme = "light" | "dark";

export type Profile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};

export type Repo = {
  id: number;
  name: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  fork: boolean;
  pushedAt: string;
  homepage: string | null;
  topics: string[];
};

export type ActivityKind =
  | "push"
  | "create"
  | "pr"
  | "issue"
  | "star"
  | "fork"
  | "release"
  | "update"
  | "other";

export type Activity = {
  id: string;
  at: string;
  repoName: string;
  repoUrl: string;
  kind: ActivityKind;
  text: string;
  count: number;
};

export type GithubStatus = "loading" | "live" | "cached" | "fallback";

export type GithubNotice = "rate" | "error" | "stale" | "forced" | null;

export type ActivitySource = "events" | "repos" | "none";

export type GithubData = {
  status: GithubStatus;
  profile: Profile;
  repos: Repo[];
  activity: Activity[];
  activitySource: ActivitySource;
  notice: GithubNotice;
  fetchedAt: string | null;
};
