"use client";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CAPY_LAUNCHER_NAME, LOGO_SRC, SITE_NAME } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "@/components/auth/LogoutButton";

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
}

const publicLinks = [
  { to: "/", label: "Home", key: "home" as const },
  { to: "/launcher", label: CAPY_LAUNCHER_NAME, key: "launcher" as const },
  { to: "/mods", label: "Mods", key: "mods" as const },
];

const authLinks = [
  { to: "/", label: "Home", key: "home" as const },
  { to: "/launcher", label: CAPY_LAUNCHER_NAME, key: "launcher" as const },
  { to: "/mods", label: "Mods", key: "mods" as const },
  { to: "/mods/upload", label: "Upload", key: "upload" as const },
];

export function Header({ active = "home" }: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const links = isAuthenticated ? authLinks : publicLinks;

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
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-semibold text-text no-underline hover:no-underline"
        >
          <img
            src={LOGO_SRC}
            alt={SITE_NAME}
            width={32}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <span className="font-display hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5" aria-label="Main">
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
      </div>
    </header>
  );
}
