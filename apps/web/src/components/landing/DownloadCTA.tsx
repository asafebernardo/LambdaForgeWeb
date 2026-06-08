import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadAsset,
  getDownloadsManifest,
  isDownloadAvailable,
  resolveDownloadHref,
} from "@/lib/downloads";

function WindowsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M3 5.5L10.5 4.2v7.1H3V5.5zm0 8.4h7.5v7.1L3 19.7v-5.8zm9.8-9.9L21 3.1v8.2h-8.2V3.9zM12.8 13h8.2v7.9l-8.2-1.4V13z" />
    </svg>
  );
}

/** Tux — Linux mascot (white belly, black body, orange beak & feet). */
function TuxIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#1a1a1a"
        d="M12 2C7.03 2 3 6.03 3 11c0 2.55 1.08 4.85 2.8 6.5C4.95 19.35 4 21.5 4 23.5V24h16v-.5c0-2-1-4.15-1.8-6C19.92 15.85 21 13.55 21 11c0-4.97-4.03-9-9-9z"
      />
      <ellipse cx="12" cy="13.5" rx="4.2" ry="5.2" fill="#f5f5f5" />
      <circle cx="10.1" cy="10.2" r="1.05" fill="#1a1a1a" />
      <circle cx="13.9" cy="10.2" r="1.05" fill="#1a1a1a" />
      <path fill="#f8a800" d="M12 12.2 10.2 14.8h3.6L12 12.2z" />
      <path fill="#f8a800" d="M8.5 21.2h2.2v1.3H8.5zm5.3 0h2.2v1.3h-2.2z" />
      <ellipse cx="7.2" cy="8.8" rx="1.6" ry="2.1" fill="#1a1a1a" />
      <ellipse cx="16.8" cy="8.8" rx="1.6" ry="2.1" fill="#1a1a1a" />
    </svg>
  );
}

interface DownloadCTAProps {
  size?: "hero" | "nav";
}

const btnBase =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-semibold no-underline transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";

function DownloadLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  children: ReactNode;
}) {
  const shimmer = (
    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  );

  if (external) {
    return (
      <a href={href} download className={className}>
        {shimmer}
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {shimmer}
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {shimmer}
      {children}
    </a>
  );
}

export function DownloadCTA({ size = "hero" }: DownloadCTAProps) {
  const manifest = getDownloadsManifest();
  const version = manifest.version;
  const isHero = size === "hero";

  const windowsHref = resolveDownloadHref("windows", "windows");
  const debHref = resolveDownloadHref("linux-deb", "linux-deb");
  const windowsExternal = isDownloadAvailable("windows");
  const debExternal = isDownloadAvailable("linux-deb");
  const debTitle = getDownloadAsset("linux-deb")?.title ?? "Debian package (.deb)";

  if (!isHero) {
    return (
      <DownloadLink
        href="/download"
        external={false}
        className={`btn-primary ${btnBase} px-4 py-2 text-sm`}
      >
        <WindowsIcon />
        <span>Download</span>
      </DownloadLink>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <DownloadLink
          href={windowsHref}
          external={windowsExternal}
          className={`btn-primary ${btnBase} px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base`}
        >
          <WindowsIcon />
          <span>Download for Windows</span>
        </DownloadLink>

        <DownloadLink
          href={debHref}
          external={debExternal}
          className={`btn-secondary ${btnBase} px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base`}
        >
          <TuxIcon />
          <span>Download .deb (Linux)</span>
        </DownloadLink>
      </div>
      <p className="text-center text-xs text-muted">
        v{version} · 64-bit · {debTitle}
        {!debExternal && !windowsExternal && " · Installers on the download page"}
      </p>
    </div>
  );
}
