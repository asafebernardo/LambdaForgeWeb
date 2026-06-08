import { Link } from "react-router-dom";
import {
  CAPY_LAUNCHER_NAME,
  DISCORD_URL,
  DOCS_URL,
  GITHUB_URL,
  ROADMAP_URL,
  SITE_NAME,
} from "@/lib/config";
import { getDownloadsManifest } from "@/lib/downloads";

export function Footer() {
  const manifest = getDownloadsManifest();
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Product",
      links: [
        { label: CAPY_LAUNCHER_NAME, href: "/home" },
        { label: "Mods", href: "/mods" },
        { label: "Download", href: "/download" },
        { label: "Supported games", href: "/home#games" },
        { label: "Roadmap", href: ROADMAP_URL, external: true },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: DOCS_URL },
        { label: "GitHub", href: GITHUB_URL, external: true },
        { label: "Discord", href: DISCORD_URL, external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "License", href: `${GITHUB_URL}#license` },
        { label: `Version v${manifest.version}`, href: "/download" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-border/80 bg-[#0a0a0b]/80">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-text">{SITE_NAME}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
              Mod launcher and manager for indie and sandbox games. Open source,
              community-driven, no ads.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted no-underline transition hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted no-underline transition hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted sm:flex-row">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p>Built for modders, by modders.</p>
        </div>
      </div>
    </footer>
  );
}
