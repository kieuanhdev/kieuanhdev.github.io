import { useState } from "react";
import { useGithub } from "../context/github-context.ts";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { formatMonthYear, formatNumber, safeHttpUrl } from "../lib/format.ts";
import { totalStars } from "../lib/repos.ts";
import { t } from "../lib/text.ts";
import { ExternalLink } from "./ExternalLink.tsx";
import { Container } from "./Section.tsx";

export function Hero() {
  const { locale } = usePreferences();
  const github = useGithub();
  const ready = github.status !== "loading";
  const [photoOk, setPhotoOk] = useState(true);
  const profileUrl = safeHttpUrl(github.profile.htmlUrl) ?? site.githubUrl;
  const avatar = ready ? github.profile.avatarUrl : site.avatarUrl;

  return (
    <div id="top">
      <Container className="pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="flex items-center gap-3">
          {photoOk ? (
            <img
              src={avatar}
              alt={t(locale, copy.avatarAlt)}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">KA</span>
          )}
          <div className="leading-tight">
            <p className="text-sm font-medium">{t(locale, site.role)}</p>
            <ExternalLink href={profileUrl} className="text-link text-sm text-muted">
              @{site.githubUser}
            </ExternalLink>
          </div>
        </div>

        <h1 className="mt-8 max-w-4xl text-[clamp(2.7rem,6.4vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
          {site.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{t(locale, site.intro)}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
          <a className="text-link" href="#projects">
            {t(locale, copy.seeProjects)}
          </a>
          <ExternalLink className="text-link" href={site.githubUrl}>
            {t(locale, copy.githubCta)}
          </ExternalLink>
          <a className="text-link" href="#contact">
            {t(locale, copy.contactCta)}
          </a>
        </div>

        <p className="mt-12 border-t border-line pt-5 text-sm text-muted">
          {ready ? (
            <>
              <span className="tabular-nums text-ink">{formatNumber(github.profile.publicRepos, locale)}</span>{" "}
              {t(locale, copy.repos).toLowerCase()}
              <span className="px-2 text-line" aria-hidden="true">
                /
              </span>
              <span className="tabular-nums text-ink">{formatNumber(totalStars(github.repos), locale)}</span>{" "}
              {t(locale, copy.stars).toLowerCase()}
              <span className="px-2 text-line" aria-hidden="true">
                /
              </span>
              {t(locale, copy.since).toLowerCase()} {formatMonthYear(github.profile.createdAt, locale)}
            </>
          ) : (
            t(locale, copy.loadingRepos)
          )}
        </p>
      </Container>
    </div>
  );
}
