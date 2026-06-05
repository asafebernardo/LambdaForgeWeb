import Link from "next/link";
import { getDownloadsManifest } from "@/lib/downloads";

function WindowsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M3 5.5L10.5 4.2v7.1H3V5.5zm0 8.4h7.5v7.1L3 19.7v-5.8zm9.8-9.9L21 3.1v8.2h-8.2V3.9zM12.8 13h8.2v7.9l-8.2-1.4V13z" />
    </svg>
  );
}

interface DownloadCTAProps {
  size?: "hero" | "nav";
}

export function DownloadCTA({ size = "hero" }: DownloadCTAProps) {
  const manifest = getDownloadsManifest();
  const version = manifest.version;
  const isHero = size === "hero";

  return (
    <div className={`flex flex-col items-center ${isHero ? "gap-2" : ""}`}>
      <Link
        href="/download"
        className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-dim font-semibold text-accent-foreground no-underline transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(56,189,248,0.45)] active:scale-[0.98] ${
          isHero
            ? "px-8 py-4 text-base shadow-[0_0_24px_rgba(56,189,248,0.25)]"
            : "px-4 py-2 text-sm shadow-[0_0_16px_rgba(56,189,248,0.2)]"
        }`}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <WindowsIcon />
        <span>{isHero ? "Download for Windows" : "Download"}</span>
      </Link>
      {isHero && (
        <p className="text-xs text-muted">
          v{version} · 64-bit · Linux builds available
        </p>
      )}
    </div>
  );
}
