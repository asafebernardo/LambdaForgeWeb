"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GITHUB_URL,
  LOGO_SRC,
  SITE_NAME,
} from "@/lib/config";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DownloadCTA } from "@/components/landing/DownloadCTA";
import type { HeaderActive } from "@/components/Header";

interface NavLink {
  href: string;
  label: string;
  key: HeaderActive;
  external?: boolean;
}

interface HeaderNavProps {
  active: HeaderActive;
  isAuthenticated: boolean;
  links: NavLink[];
  showLandingExtras?: boolean;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function HeaderNav({
  active,
  isAuthenticated,
  links,
  showLandingExtras = false,
}: HeaderNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-bg/95 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl"
          : "border-border/40 bg-bg/75 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          prefetch
          className="flex items-center gap-2.5 font-semibold text-text no-underline hover:no-underline"
        >
          <Image
            src={LOGO_SRC}
            alt={SITE_NAME}
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav
          className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5"
          aria-label="Main"
        >
          {links.map((link) =>
            link.key === "download" && !isAuthenticated ? (
              <DownloadCTA key={link.key} size="nav" />
            ) : (
              <Link
                key={link.key}
                href={link.href}
                prefetch={!link.external}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`rounded-lg px-3 py-2 text-sm no-underline transition-colors ${
                  active === link.key
                    ? "bg-accent/15 text-text"
                    : "text-muted hover:bg-white/5 hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}

          {showLandingExtras && !isAuthenticated && (
            <>
              <Link
                href="/#games"
                className="hidden rounded-lg px-3 py-2 text-sm text-muted no-underline transition hover:bg-white/5 hover:text-text md:inline"
              >
                Games
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted no-underline transition hover:bg-white/5 hover:text-text"
                aria-label="GitHub repository"
              >
                <GitHubIcon />
                <span className="hidden lg:inline">GitHub</span>
              </a>
            </>
          )}

          {isAuthenticated && <LogoutButton />}
        </nav>
      </div>
    </header>
  );
}
