import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Game } from "@lambda-forge/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DiscoverShell } from "./DiscoverShell";
import { DiscoverGameMosaic } from "./DiscoverGameCard";

interface DiscoverBrowseViewProps {
  games: Game[];
  loading: boolean;
}

export function DiscoverBrowseView({ games, loading }: DiscoverBrowseViewProps) {
  const [gameSearch, setGameSearch] = useState("");
  const debouncedSearch = useDebouncedValue(gameSearch, 200);

  const filteredGames = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const list =
      q.length >= 1
        ? games.filter((g) => g.name.toLowerCase().includes(q))
        : [...games];
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [games, debouncedSearch]);

  return (
    <DiscoverShell>
      <header className="shrink-0 border-b border-border px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Discover Mods</h1>
            <p className="mt-1 text-sm text-muted">
              {loading
                ? "Loading game library…"
                : filteredGames.length > 0
                  ? `${filteredGames.length} games — pick one to browse mods`
                  : "Pick a game from the library to browse mods"}
            </p>
          </div>
          <Link
            to="/mods/enviar"
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground no-underline transition hover:opacity-90"
          >
            Enviar mod
          </Link>
        </div>
      </header>

      <div className="shrink-0 border-b border-border px-6 py-4 sm:px-8">
        <div className="relative min-w-0">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search games in library…"
            value={gameSearch}
            onChange={(e) => setGameSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-3 text-sm text-text backdrop-blur-sm placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-md bg-card/50 ring-1 ring-white/5"
              />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center gap-2 rounded-xl px-6 py-12 text-center text-sm text-muted">
            <p className="font-medium text-text">No games found</p>
            <p className="max-w-md text-xs">Try a different search term.</p>
          </div>
        ) : (
          <DiscoverGameMosaic games={filteredGames} />
        )}
      </div>
    </DiscoverShell>
  );
}
