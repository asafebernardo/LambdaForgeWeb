import { CAPY_LAUNCHER_NAME } from "@/lib/config";
import { DownloadCTA } from "./DownloadCTA";
import { LauncherMockup } from "./LauncherMockup";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-10 sm:pb-14 sm:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/8 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:max-w-7xl">
        <div className="text-center lg:text-left">
          <p className="font-display text-sm font-medium uppercase tracking-wider text-accent">
            Desktop launcher
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl xl:text-[3.25rem]">
            {CAPY_LAUNCHER_NAME}
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted lg:mx-0 mx-auto">
            One-click mod installs, profiles, conflict detection, and download
            queues — built for indie and sandbox games.
          </p>
          <p className="mt-2 max-w-lg text-sm text-muted/90 lg:mx-0 mx-auto">
            No ZIP extraction or manual folder copying. Manage your entire mod
            library from a single polished desktop app.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
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
