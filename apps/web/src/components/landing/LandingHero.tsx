import { Logo } from "@/components/Logo";
import { DownloadCTA } from "./DownloadCTA";
import { LauncherMockup } from "./LauncherMockup";
import { LAUNCHER_TAGLINE, SITE_NAME } from "@/lib/config";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/8 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:max-w-7xl">
        <div className="text-center lg:text-left">
          <Logo
            size={96}
            className="mx-auto drop-shadow-[0_8px_24px_rgba(56,189,248,0.25)] lg:mx-0"
          />
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl xl:text-[3.25rem]">
            {SITE_NAME}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted lg:mx-0 mx-auto">
            {LAUNCHER_TAGLINE}
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted/90 lg:mx-0 mx-auto">
            Install mods with one click, manage profiles, detect conflicts, and
            stay up to date — no ZIP extraction or manual folder copying.
          </p>
          <div className="mt-7 flex justify-center lg:justify-start">
            <DownloadCTA size="hero" />
          </div>
        </div>

        <div className="animate-float">
          <LauncherMockup />
        </div>
      </div>
    </section>
  );
}
