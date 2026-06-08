import { CAPY_LAUNCHER_NAME } from "@/lib/config";
import { DownloadCTA } from "./DownloadCTA";
import { LauncherMockup } from "./LauncherMockup";
import { FeatureIcon } from "./FeatureIcon";

const TRUST_PILLS = [
  { label: "Open source", icon: "code" },
  { label: "No ads", icon: "ban" },
  { label: "Community-driven", icon: "users" },
] as const;

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:pb-20 sm:pt-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-accent/[0.12] via-accent/[0.04] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 top-40 h-48 w-48 rounded-full bg-accent/8 blur-[80px]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:max-w-7xl">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Built for sandbox &amp; indie games
          </div>

          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl xl:text-[3.35rem]">
            Stop extracting ZIPs{" "}
            <span className="bg-gradient-to-r from-accent-bright via-accent to-accent-hover bg-clip-text text-transparent">
              manually.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-text/90 lg:mx-0 mx-auto">
            <span className="font-medium text-text">{CAPY_LAUNCHER_NAME}</span> is your
            one launcher for mods — install, update, and launch in minutes.
          </p>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted lg:mx-0 mx-auto">
            Profiles, conflict detection, and download queues replace scattered folders
            and copy-paste chaos. Easier than manual modding, every time.
          </p>

          <div className="mt-8 flex justify-center lg:justify-start">
            <DownloadCTA size="hero" align="center" />
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
            {TRUST_PILLS.map((pill) => (
              <li
                key={pill.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted"
              >
                <FeatureIcon name={pill.icon} className="h-3.5 w-3.5 text-accent/80" />
                {pill.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-float lg:pl-4">
          <LauncherMockup />
        </div>
      </div>
    </section>
  );
}
