import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { CAPY_LAUNCHER_NAME, SITE_NAME } from "@/lib/config";

export function HomePage() {
  return (
    <>
      <Header active="home" />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <Logo
            size={112}
            className="mx-auto drop-shadow-[0_8px_24px_rgba(232,93,4,0.25)]"
          />
          <h1 className="font-display mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Mod platform and launcher ecosystem for indie and sandbox games.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
            Browse community mods or install them with one click using our desktop
            launcher.
          </p>
        </section>

        <section className="border-y border-border/60 bg-card/20 py-14">
          <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2">
            <ScrollReveal>
              <Link
                to="/launcher"
                className="glass-card group block rounded-xl p-8 no-underline transition hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(232,93,4,0.1)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Desktop app
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-text group-hover:text-accent">
                  {CAPY_LAUNCHER_NAME}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  One-click installs, mod profiles, conflict detection, and download
                  queues for your favorite games.
                </p>
                <span className="mt-4 inline-block text-sm text-accent">
                  Explore launcher →
                </span>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <Link
                to="/mods"
                className="glass-card group block rounded-xl p-8 no-underline transition hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(232,93,4,0.1)]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Community
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-text group-hover:text-accent">
                  Mods
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Discover, download, and share mods for Vintage Story, Project
                  Zomboid, Kenshi, and more.
                </p>
                <span className="mt-4 inline-block text-sm text-accent">
                  Browse mods →
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
