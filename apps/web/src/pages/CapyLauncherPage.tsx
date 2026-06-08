import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureGrid } from "@/components/FeatureGrid";
import { SupportedGames } from "@/components/SupportedGames";
import { LandingHero } from "@/components/landing/LandingHero";
import { TrustBar } from "@/components/landing/TrustBar";
import { WhyLambdaForge } from "@/components/landing/WhyLambdaForge";
import { ScreenshotGallery } from "@/components/landing/ScreenshotGallery";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { DownloadCTA } from "@/components/landing/DownloadCTA";
import { CAPY_LAUNCHER_NAME, LAUNCHER_FEATURES, SITE_NAME, SUPPORTED_GAMES } from "@/lib/config";
import { fetchGames } from "@/lib/api";
import { getDownloadsManifest } from "@/lib/downloads";
import type { Game, SupportedGame } from "@lambda-forge/types";

export function CapyLauncherPage() {
  const manifest = getDownloadsManifest();
  const [games, setGames] = useState<(Game | SupportedGame)[]>([]);

  useEffect(() => {
    fetchGames().then(setGames);
  }, []);

  useEffect(() => {
    document.title = `${CAPY_LAUNCHER_NAME} · ${SITE_NAME}`;
  }, []);

  return (
    <>
      <Header active="launcher" />
      <main>
        <LandingHero />

        <section className="pb-12 pt-2">
          <TrustBar gameCount={games.length || 16} version={manifest.version} />
        </section>

        <section className="border-y border-border/60 bg-card/20 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">What it does</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Everything {CAPY_LAUNCHER_NAME} handles for your mod library —
                  in one polished desktop app.
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-10">
              <FeatureGrid features={[...LAUNCHER_FEATURES]} />
            </div>
          </div>
        </section>

        <WhyLambdaForge />
        <ScreenshotGallery />

        <section id="games" className="scroll-mt-24 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Supported games</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Vintage Story, Project Zomboid, Team Fortress 2, Garry&apos;s Mod, and more —
                  with new titles on the way.
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-10">
              <SupportedGames games={games.length ? games : SUPPORTED_GAMES} />
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-gradient-to-b from-accent/5 to-transparent py-16">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Ready to ditch manual mod installs?
              </h2>
              <p className="mt-3 text-sm text-muted">
                Download {CAPY_LAUNCHER_NAME} and get your mod library under control in minutes.
              </p>
              <div className="mt-8 flex justify-center">
                <DownloadCTA size="hero" />
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
