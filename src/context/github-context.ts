import { createContext, useContext } from "react";
import type { GithubData } from "../lib/types.ts";

export const GithubContext = createContext<GithubData | null>(null);

export function useGithub(): GithubData {
  const value = useContext(GithubContext);
  if (!value) throw new Error("useGithub must be used within GithubProvider");
  return value;
}
