import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureGrid } from "@/components/FeatureGrid";
import { SupportedGames } from "@/components/SupportedGames";
import { LandingHero } from "@/components/landing/LandingHero";
import { TrustBar } from "@/components/landing/TrustBar";
import { WhyLambdaForge } from "@/components/landing/WhyLambdaForge";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SocialProof } from "@/components/landing/SocialProof";
import { ScreenshotGallery } from "@/components/landing/ScreenshotGallery";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { DownloadCTA } from "@/components/landing/DownloadCTA";
import {
  CAPY_LAUNCHER_NAME,
  LAUNCHER_FEATURES,
  SITE_NAME,
  SUPPORTED_GAMES,
} from "@/lib/config";
import { fetchGames } from "@/lib/api";
import { getDownloadsManifest } from "@/lib/downloads";
import type { Game, SupportedGame } from "@lambda-forge/types";

export function CapyLauncherPage() {
  const manifest = getDownloadsManifest();
  const [games, setGames] = useState<(Game | SupportedGame)[]>([]);
  const gameCount = games.length || SUPPORTED_GAMES.length;

  useEffect(() => {
    fetchGames().then(setGames);
  }, []);

  useEffect(() => {
    document.title = `${CAPY_LAUNCHER_NAME} · ${SITE_NAME}`;
  }, []);

  return (
    <>
      <Header active="home" marketing />
      <main>
        <LandingHero />

        <section className="pb-14 pt-4">
          <TrustBar gameCount={gameCount} version={manifest.version} />
        </section>

        <section className="section-elevated border-y border-border/50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Core features
                </p>
                <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
                  What {CAPY_LAUNCHER_NAME} does
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Everything your mod library needs — detection, installs, profiles,
                  queues, and conflict checks in one desktop app.
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-12">
              <FeatureGrid features={[...LAUNCHER_FEATURES]} />
            </div>
          </div>
        </section>

        <HowItWorks />
        <WhyLambdaForge />
        <SocialProof gameCount={gameCount} version={manifest.version} />
        <ScreenshotGallery />

        <section id="games" className="scroll-mt-28 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Library
                </p>
                <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
                  Supported games
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Vintage Story, Project Zomboid, Team Fortress 2, Garry&apos;s Mod, and
                  more — with new titles on the way.
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-12">
              <SupportedGames games={games.length ? games : SUPPORTED_GAMES} />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-border/50 py-20 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-accent/[0.08] via-accent/[0.03] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[480px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
            aria-hidden
          />
          <ScrollReveal>
            <div className="relative mx-auto max-w-2xl px-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Get started
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
                Install mods without the chaos.
              </h2>
              <p className="mt-4 text-base text-muted">
                Free. Open source. No ads. Get {CAPY_LAUNCHER_NAME} running in under 2
                minutes.
              </p>
              <div className="mt-10">
                <DownloadCTA size="footer" align="center" />
              </div>
              <p className="mt-6 text-xs text-muted">
                Windows &amp; Linux · Community-driven · Built for modders
              </p>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
