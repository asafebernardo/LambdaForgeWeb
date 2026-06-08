import type { SupportedGame } from "@lambda-forge/types";

export const SITE_NAME = "CapyMods";

export const CAPY_LAUNCHER_NAME = "CapyLauncher";

export const LOGO_SRC = "/assets/logo.png";

export const LAUNCHER_TAGLINE =
  "Launcher and mod manager for classic and indie games.";

export type GameSupportBadge = "Native" | "Workshop" | "Community" | "Experimental";

/** Optional support badges for launcher landing game grid. */
export const GAME_SUPPORT_BADGES: Partial<Record<string, GameSupportBadge>> = {
  "vintage-story": "Native",
  "project-zomboid": "Community",
  "team-fortress-2": "Workshop",
  "garrys-mod": "Workshop",
  "kenshi": "Community",
  starsector: "Native",
  openttd: "Native",
  openrct2: "Native",
  mindustry: "Community",
  barotrauma: "Community",
  unturned: "Workshop",
  cdda: "Community",
  "songs-of-syx": "Experimental",
};

export const SUPPORTED_GAMES: SupportedGame[] = [
  { name: "Left 4 Dead 2", slug: "left-4-dead-2", steamAppId: 550 },
  { name: "Garry's Mod", slug: "garrys-mod", steamAppId: 4000 },
  { name: "Team Fortress 2", slug: "team-fortress-2", steamAppId: 440 },
  { name: "Portal", slug: "portal", steamAppId: 400 },
  { name: "Portal 2", slug: "portal-2", steamAppId: 620 },
  {
    name: "Vintage Story",
    slug: "vintage-story",
    coverUrl: "/assets/games/vintage-story.png",
  },
  { name: "Project Zomboid", slug: "project-zomboid", steamAppId: 108600 },
  { name: "Kenshi", slug: "kenshi", steamAppId: 233860 },
  {
    name: "Starsector",
    slug: "starsector",
    coverUrl: "/assets/games/starsector.png",
  },
  { name: "OpenTTD", slug: "openttd", steamAppId: 1536610 },
  {
    name: "OpenRCT2",
    slug: "openrct2",
    coverUrl: "/assets/games/openrct2.jpg",
  },
  { name: "Mindustry", slug: "mindustry", steamAppId: 1127400 },
  { name: "Barotrauma", slug: "barotrauma", steamAppId: 602960 },
  { name: "Unturned", slug: "unturned", steamAppId: 304930 },
  { name: "CDDA", slug: "cdda", steamAppId: 2330750 },
  { name: "Songs of Syx", slug: "songs-of-syx", steamAppId: 1162750 },
];

export const LAUNCHER_FEATURES = [
  {
    title: "Auto-detection",
    description: "Finds installed games and libraries on your PC.",
    icon: "scan",
  },
  {
    title: "One-click install",
    description: "Downloads, extracts, and deploys mods — no manual file copying.",
    icon: "download",
  },
  {
    title: "Mod profiles",
    description: "Named loadouts — Vanilla, competitive, meme stacks, and more.",
    icon: "layers",
  },
  {
    title: "Download queue",
    description: "Track download, extraction, and install progress in one place.",
    icon: "queue",
  },
  {
    title: "Conflict detection",
    description: "Spots conflicting files between mods before you launch.",
    icon: "shield",
  },
  {
    title: "Updates",
    description: "Keep mods and the launcher up to date with a few clicks.",
    icon: "refresh",
  },
] as const;

export const TRUST_INDICATORS = [
  { label: "Open Source", icon: "code" },
  { label: "No Ads", icon: "ban" },
  { label: "One-click Install", icon: "zap" },
  { label: "Conflict Detection", icon: "shield" },
  { label: "Active Development", icon: "pulse" },
] as const;

export const WHY_LAMBDA_FORGE = [
  {
    title: "No ZIP extraction",
    description: "Skip manual archives, folder hunting, and copy-paste errors.",
    icon: "folder",
  },
  {
    title: "Automatic conflict detection",
    description: "See overlapping mod files before they break your save.",
    icon: "shield",
  },
  {
    title: "Multi-game support",
    description: "One launcher for Vintage Story, Zomboid, Kenshi, and more.",
    icon: "grid",
  },
  {
    title: "Faster workflow",
    description: "Queue downloads, install in batches, and launch faster.",
    icon: "rocket",
  },
  {
    title: "Profile system",
    description: "Swap loadouts instantly — vanilla nights or modded chaos.",
    icon: "layers",
  },
  {
    title: "Community-first",
    description: "Built for mod authors and players, not ad revenue.",
    icon: "users",
  },
] as const;

export const GITHUB_URL = "https://github.com/asafebernardo/LambdaForgeWeb";
export const DOCS_URL = "https://github.com/asafebernardo/LambdaForgeWeb/tree/main/docs";
export const DISCORD_URL = "#";
export const ROADMAP_URL = "https://github.com/asafebernardo/LambdaForgeWeb/blob/main/docs/VISAO_GERAL.md";

export const SHOWCASE_SLIDES = [
  {
    id: "library",
    title: "Mod library",
    description: "Browse installed mods with status, versions, and quick actions.",
  },
  {
    id: "browser",
    title: "Mod browser",
    description: "Discover community mods with filters, ratings, and one-click install.",
  },
  {
    id: "downloads",
    title: "Download manager",
    description: "Queue multiple mods and track progress in real time.",
  },
  {
    id: "profiles",
    title: "Profile manager",
    description: "Save named loadouts and switch between them instantly.",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Configure game paths, updates, and launcher preferences.",
  },
] as const;

/** Vertical library art — Steam library mosaic ratio (2:3). */
export function steamCoverUrl(steamAppId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/library_600x900.jpg`;
}

export function gameCoverUrl(game: SupportedGame): string {
  if (game.coverUrl) return game.coverUrl;
  if (game.steamAppId) return steamCoverUrl(game.steamAppId);
  return "/assets/games/placeholder.jpg";
}
