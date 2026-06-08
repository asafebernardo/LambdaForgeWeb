import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Game, ModSummary } from "@lambda-forge/types";
import { sdk } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ModCard } from "@/components/mods/ModCard";
import { DiscoverShell } from "./DiscoverShell";
import { GamePosterHeader } from "./GamePosterHeader";
import { ModStorePagination } from "./ModStorePagination";

type SortId = "recent" | "popular" | "rating";

interface DiscoverStoreViewProps {
  game: Game;
  onBack: () => void;
}

export function DiscoverStoreView({ game, onBack }: DiscoverStoreViewProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [sort, setSort] = useState<SortId>("recent");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);

  const [mods, setMods] = useState<ModSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sdk.listMods({
        game: game.slug,
        q: debouncedSearch.trim() || undefined,
        sort,
        page,
        limit: perPage,
      });
      setMods(res.data);
      setTotal(res.meta.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load mods");
      setMods([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [game.slug, debouncedSearch, sort, page, perPage]);

  useEffect(() => {
    void loadMods();
  }, [loadMods]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <DiscoverShell>
      <GamePosterHeader game={game} onBack={onBack} />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 space-y-4 border-b border-border px-6 py-4 sm:px-8">
          <div className="relative min-w-0">
            <label htmlFor="mod-store-search" className="sr-only">
              Search mods
            </label>
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
              id="mod-store-search"
              type="search"
              placeholder="Search mods…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-3 text-sm text-text backdrop-blur-sm placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span>
              {loading
                ? "Loading…"
                : total > 0
                  ? `${total.toLocaleString()} mods`
                  : "No mods found"}
            </span>
            <label className="flex items-center gap-2">
              Sort
              <select
                aria-label="Sort mods"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortId);
                  setPage(1);
                }}
                className="rounded-lg border border-border bg-bg px-2 py-1 text-xs text-text"
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
          {error && (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg border border-border bg-card/50"
                />
              ))}
            </div>
          ) : mods.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center text-muted">
              <p>Nenhum mod para {game.name} ainda.</p>
              <p className="mt-1 text-xs">Seja o primeiro a enviar um.</p>
              <Link
                to={`/mods/enviar?game=${encodeURIComponent(game.slug)}`}
                className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground no-underline hover:opacity-90"
              >
                Enviar mod
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          )}
        </div>

        {total > perPage && (
          <div className="shrink-0 px-6 pb-4 sm:px-8">
            <ModStorePagination
              page={page}
              totalPages={totalPages}
              totalCount={total}
              perPage={perPage}
              loading={loading}
              onPageChange={setPage}
              onPerPageChange={(n) => {
                setPerPage(n);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </DiscoverShell>
  );
}
