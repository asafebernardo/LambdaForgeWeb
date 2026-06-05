import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DownloadCards } from "@/components/DownloadCards";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Logo } from "@/components/Logo";
import { SupportedGames } from "@/components/SupportedGames";
import {
  LAUNCHER_FEATURES,
  LAUNCHER_TAGLINE,
  SITE_NAME,
  SUPPORTED_GAMES,
} from "@/lib/config";
import { getDownloadsManifest } from "@/lib/downloads";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Download",
  description: "Download the Lambda Forge launcher and install mods with one click.",
};

export default function DownloadPage() {
  const manifest = getDownloadsManifest();

  const versionLabel = manifest.version
    ? `Version ${manifest.version}${
        manifest.released_at
          ? ` · ${new Date(manifest.released_at).toLocaleDateString("en-US")}`
          : ""
      }`
    : "Configure installers in public/data/downloads.json";

  return (
    <>
      <Header active="download" />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 text-center">
          <Logo size={112} className="mx-auto drop-shadow-[0_8px_24px_rgba(56,189,248,0.25)]" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Download {SITE_NAME}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{LAUNCHER_TAGLINE}</p>
        </section>

        <section className="border-y border-border bg-card/60 py-10">
          <div className="mx-auto max-w-6xl px-4">
            <p className="mb-5 text-center font-mono text-sm text-muted">
              {versionLabel}
            </p>
            <DownloadCards assets={manifest.assets} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <FeatureGrid features={LAUNCHER_FEATURES} />

          <div className="mt-10">
            <h2 className="mb-4 text-center text-lg font-semibold">
              Supported games
            </h2>
            <SupportedGames games={SUPPORTED_GAMES} />
          </div>

          <p className="pb-4 pt-8 text-center text-sm text-muted">
            <Link href="/" className="text-accent hover:underline">
              Back to home
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
