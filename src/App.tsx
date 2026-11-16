import { useEffect } from "react";
import { About } from "./components/About.tsx";
import { Contact } from "./components/Contact.tsx";
import { Footer } from "./components/Footer.tsx";
import { GithubPanel } from "./components/GithubPanel.tsx";
import { Header } from "./components/Header.tsx";
import { Hero } from "./components/Hero.tsx";
import { Projects } from "./components/Projects.tsx";
import { Skills } from "./components/Skills.tsx";
import { GithubProvider } from "./context/github-data.tsx";
import { PreferencesProvider } from "./context/preferences.tsx";
import { usePreferences } from "./context/preferences-context.ts";
import { site } from "./data/site.ts";
import { copy } from "./lib/copy.ts";
import { t } from "./lib/text.ts";

function Shell() {
  const { locale } = usePreferences();

  useEffect(() => {
    document.title = `${site.name} · ${t(locale, site.role)}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t(locale, site.intro));
  }, [locale]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t(locale, copy.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GithubPanel />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <GithubProvider>
        <Shell />
      </GithubProvider>
    </PreferencesProvider>
  );
}
