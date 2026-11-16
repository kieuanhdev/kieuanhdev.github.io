import { useMemo, useState } from "react";
import { useGithub } from "../context/github-context.ts";
import { usePreferences } from "../context/preferences-context.ts";
import { site } from "../data/site.ts";
import { copy } from "../lib/copy.ts";
import { formatMonthYear, safeHttpUrl } from "../lib/format.ts";
import { totalStars } from "../lib/repos.ts";
import { t } from "../lib/text.ts";
import { ExternalLink } from "./ExternalLink.tsx";
import { Aurora, CountUp, FadeIn, Particles, Typewriter } from "./fx.tsx";
import { IconArrow, IconGitHub } from "./Icons.tsx";
import { Container } from "./Section.tsx";

export function Hero() {
  const { locale } = usePreferences();
  const github = useGithub();
  const ready = github.status !== "loading";
  const [photoOk, setPhotoOk] = useState(true);
  const profileUrl = safeHttpUrl(github.profile.htmlUrl) ?? site.githubUrl;
  const avatar = ready ? github.profile.avatarUrl : site.avatarUrl;
  const phrases = useMemo(
    () => [t(locale, site.role), "Flutter · Next.js · Spring Boot"],
    [locale],
  );

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Aurora />
      <Particles />
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16 md:py-24">
        <FadeIn>
          <div className="flex items-center gap-4">
            {photoOk ? (
              <span className="avatar-ring h-16 w-16 shrink-0 md:h-[4.5rem] md:w-[4.5rem]">
                <img
                  src={avatar}
                  alt={t(locale, copy.avatarAlt)}
                  width={72}
                  height={72}
                  className="h-full w-full rounded-full object-cover"
                  onError={() => setPhotoOk(false)}
                />
              </span>
            ) : (
              <span className="avatar-ring h-16 w-16 shrink-0">
                <span className="grid h-full w-full place-items-center rounded-full bg-paper text-sm font-semibold">KA</span>
              </span>
            )}
            <div className="leading-tight">
              <p className="flex items-center gap-2 text-sm font-medium text-muted">
                {github.status === "live" ? <span className="live-dot" aria-hidden="true" /> : null}
                <ExternalLink href={profileUrl} className="inline-flex items-center gap-1.5 text-link">
                  <IconGitHub className="h-4 w-4" />
                  @{site.githubUser}
                </ExternalLink>
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mt-8 max-w-5xl text-[clamp(2.8rem,7.6vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            <span className="block">{site.nameLines[0]}</span>
            <span className="gradient-text block">{site.nameLines[1]}</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mt-5 max-w-3xl text-[clamp(1.35rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-ink">
            <Typewriter phrases={phrases} />
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{t(locale, site.intro)}</p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="btn" href="#projects">
              {t(locale, copy.seeProjects)}
              <IconArrow className="h-4 w-4" />
            </a>
            <ExternalLink className="btn btn-ghost" href={site.githubUrl}>
              {t(locale, copy.githubCta)}
            </ExternalLink>
            <a className="btn btn-ghost" href="#contact">
              {t(locale, copy.contactCta)}
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.32} className="mt-12">
          {ready ? (
            <dl className="grid grid-cols-3 gap-2 sm:gap-4">
              <Stat label={t(locale, copy.repos)} value={github.profile.publicRepos} />
              <Stat label={t(locale, copy.stars)} value={totalStars(github.repos)} />
              <div className="glass rounded-2xl px-3 py-4 sm:rounded-3xl sm:px-5">
                <dt className="text-[0.7rem] text-muted sm:text-sm">{t(locale, copy.since)}</dt>
                <dd className="mt-1 text-lg font-semibold tracking-[-0.04em] sm:text-3xl">
                  {formatMonthYear(github.profile.createdAt, locale)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="glass rounded-2xl px-4 py-3 text-sm text-muted">{t(locale, copy.loadingRepos)}</p>
          )}
        </FadeIn>
      </Container>
      <div className="hero-fade" aria-hidden="true" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl px-3 py-4 sm:rounded-3xl sm:px-5">
      <dt className="text-[0.7rem] text-muted sm:text-sm">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-[-0.05em] sm:text-4xl">
        <CountUp value={value} />
      </dd>
    </div>
  );
}
