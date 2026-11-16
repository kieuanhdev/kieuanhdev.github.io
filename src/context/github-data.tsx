import { useEffect, useState, type ReactNode } from "react";
import { fallbackProfile } from "../data/fallback.ts";
import { site } from "../data/site.ts";
import {
  cacheIsFresh,
  fallbackData,
  GithubRequestError,
  loadGithub,
  readCache,
  writeCache,
} from "../lib/github.ts";
import type { GithubData } from "../lib/types.ts";
import { GithubContext } from "./github-context.ts";

const loadingData: GithubData = {
  status: "loading",
  profile: fallbackProfile,
  repos: [],
  activity: [],
  activitySource: "none",
  notice: null,
  fetchedAt: null,
};

function initialGithubData(): GithubData {
  if (typeof window === "undefined") return loadingData;
  const params = new URLSearchParams(window.location.search);
  if (params.get("github") === "fallback") return fallbackData("forced");
  const cached = readCache();
  if (cached) return { ...cached.data, status: "cached", notice: null };
  return loadingData;
}

export function GithubProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GithubData>(initialGithubData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("github") === "fallback") return;

    const cached = readCache();
    if (cached && cacheIsFresh(cached)) return;

    let cancelled = false;
    loadGithub(site.githubUser)
      .then((live) => {
        if (cancelled) return;
        writeCache(live);
        setData({ ...live, status: "live", notice: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (cached) {
          setData({ ...cached.data, status: "cached", notice: "stale" });
          return;
        }
        const kind = error instanceof GithubRequestError ? error.kind : "error";
        setData(fallbackData(kind));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <GithubContext.Provider value={data}>{children}</GithubContext.Provider>;
}
