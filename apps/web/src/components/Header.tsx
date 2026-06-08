"use client";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  CAPY_LAUNCHER_NAME,
  DISCORD_URL,
  DOCS_URL,
  GITHUB_URL,
  LOGO_SRC,
  SITE_NAME,
} from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DownloadCTA } from "@/components/landing/DownloadCTA";
import { getDownloadsManifest } from "@/lib/downloads";

export type HeaderActive =
  | "home"
  | "launcher"
  | "download"
  | "mods"
  | "login"
  | "register"
  | "upload";

interface HeaderProps {
  active?: HeaderActive;
  /** Premium marketing nav for launcher landing */
  marketing?: boolean;
}

const publicLinks = [{ to: "/home", label: "Home", key: "home" as const }];

const authLinks = [
  { to: "/home", label: "Home", key: "home" as const },
  { to: "/mods", label: "Mods", key: "mods" as const },
  { to: "/mods/enviar", label: "Enviar mod", key: "upload" as const },
];

const marketingLinks = [
  { href: "/home", label: CAPY_LAUNCHER_NAME, key: "launcher" as const, external: false },
  { href: "/home#games", label: "Games", key: "games" as const, external: false },
  { href: DOCS_URL, label: "Docs", key: "docs" as const, external: true },
  { href: GITHUB_URL, label: "GitHub", key: "github" as const, external: true },
  { href: DISCORD_URL, label: "Discord", key: "discord" as const, external: true },
] as const;

export function Header({ active = "home", marketing = false }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const links = isAuthenticated ? authLinks : publicLinks;
  const version = getDownloadsManifest().version;

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
          ? "border-border/80 bg-bg/95 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-border/50 bg-bg/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
        <Link
          to="/home"
          className="group flex shrink-0 items-center gap-2.5 font-semibold text-text no-underline hover:no-underline"
        >
          <span className="relative">
            <span
              className="pointer-events-none absolute inset-0 rounded-lg bg-accent/25 blur-md opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <img
              src={LOGO_SRC}
              alt={SITE_NAME}
              width={38}
              height={48}
              className="relative h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(232,93,4,0.35)] sm:h-12"
            />
          </span>
          <span className="font-display hidden text-sm sm:inline lg:text-base">
            {marketing ? CAPY_LAUNCHER_NAME : SITE_NAME}
          </span>
        </Link>

        {marketing ? (
          <>
            <nav
              className="hidden items-center gap-0.5 md:flex"
              aria-label="Launcher"
            >
              {marketingLinks.map((link) => {
                const isActive =
                  link.key === "launcher" && (active === "home" || active === "launcher");
                const className = `rounded-lg px-2.5 py-2 text-sm no-underline transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(232,93,4,0.2)]"
                    : "text-muted hover:bg-white/5 hover:text-text"
                }`;
                if (link.external) {
                  return (
                    <a
                      key={link.key}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {link.label}
                    </a>
                  );
                }
                if (link.href === "/home") {
                  return (
                    <Link key={link.key} to={link.href} className={className}>
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a key={link.key} href={link.href} className={className}>
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden rounded-full border border-border/80 bg-card/50 px-2.5 py-1 text-[10px] font-medium text-muted lg:inline">
                Open Source
              </span>
              <span className="hidden rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent sm:inline">
                v{version}
              </span>
              <DownloadCTA size="nav" />
            </div>
          </>
        ) : (
          <nav
            className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5"
            aria-label="Main"
          >
            {links.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                className={`rounded-lg px-3 py-2 text-sm no-underline transition-colors ${
                  active === link.key
                    ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(232,93,4,0.2)]"
                    : "text-muted hover:bg-white/5 hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && <LogoutButton />}
          </nav>
        )}
      </div>
    </header>
  );
}
