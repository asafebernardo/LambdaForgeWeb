import type { Metadata } from "next";
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
import { LAUNCHER_FEATURES } from "@/lib/config";
import { fetchGames } from "@/lib/api";
import { getDownloadsManifest } from "@/lib/downloads";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Lambda Forge — launcher and mod manager for indie and sandbox games.",
};

export default async function HomePage() {
  const [games, manifest] = await Promise.all([
    fetchGames(),
    Promise.resolve(getDownloadsManifest()),
  ]);

  return (
    <>
      <Header active="home" showLandingExtras />
      <main>
        <LandingHero />

        <section className="pb-12 pt-2">
          <TrustBar gameCount={games.length} version={manifest.version} />
        </section>

        <section className="border-y border-border/60 bg-card/20 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-2xl font-semibold sm:text-3xl">What it does</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Everything you need to install and manage mods for your favorite
                  games — in one polished launcher.
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
                <h2 className="text-2xl font-semibold sm:text-3xl">Supported games</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
                  Vintage Story, Project Zomboid, Kenshi, OpenRCT2, and more —
                  with new titles on the way.
                </p>
              </div>
            </ScrollReveal>
            <div className="mt-10">
              <SupportedGames games={games} />
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-gradient-to-b from-accent/5 to-transparent py-16">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl px-4 text-center">
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Ready to ditch manual mod installs?
              </h2>
              <p className="mt-3 text-sm text-muted">
                Download Lambda Forge and get your mod library under control in minutes.
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
