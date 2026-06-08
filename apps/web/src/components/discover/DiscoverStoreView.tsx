import { useCallback, useEffect, useState } from "react";
import type { Game, ModDetail, Category } from "@lambda-forge/types";
import { fetchCategories, sdk } from "@/lib/api";
import { gameCoverUrl } from "@/lib/config";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { DiscoverShell } from "./DiscoverShell";
import { GamePosterHeader } from "./GamePosterHeader";
import { CategorySidebar } from "./CategorySidebar";
import { ModQuickFilters, quickFilterToSort, type QuickFilterId } from "./ModQuickFilters";
import { ModStoreSearch, useSearchSuggestions } from "./ModStoreSearch";
import { ModStorePagination } from "./ModStorePagination";
import {
  ModCardSkeletonGrid,
  ModFeaturedBanner,
  ModStoreCard,
} from "./ModStoreCard";

interface DiscoverStoreViewProps {
  game: Game;
  onBack: () => void;
}

export function DiscoverStoreView({ game, onBack }: DiscoverStoreViewProps) {
  const cover = gameCoverUrl(game);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>("all");
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);

  const [mods, setMods] = useState<ModDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setCategoriesLoading(false));
  }, []);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sort = quickFilterToSort(quickFilter) as "recent" | "popular" | "rating";
      const res = await sdk.listMods({
        game: game.slug,
        category: categorySlug ?? undefined,
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
  }, [game.slug, categorySlug, debouncedSearch, quickFilter, page, perPage]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const suggestions = useSearchSuggestions(mods, search);

  const featuredMod =
    quickFilter === "all" && !debouncedSearch.trim() && page === 1 && mods.length > 0
      ? [...mods].sort((a, b) => b.downloadCount - a.downloadCount)[0]
      : null;

  const gridMods = featuredMod
    ? mods.filter((m) => m.id !== featuredMod.id)
    : mods;

  function handleQuickFilter(id: QuickFilterId) {
    setQuickFilter(id);
    setPage(1);
  }

  function handleCategorySelect(slug: string | null) {
    setCategorySlug(slug);
    setPage(1);
  }

  function handleSearchCommit() {
    setPage(1);
  }

  return (
    <DiscoverShell>
      <GamePosterHeader game={game} onBack={onBack} />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="shrink-0 space-y-4 border-b border-border px-6 py-4 sm:px-8">
            <div>
              <label htmlFor="mod-store-search" className="sr-only">
                Search mods
              </label>
              <ModStoreSearch
                value={search}
                onChange={setSearch}
                suggestions={suggestions}
                onCommit={handleSearchCommit}
              />
            </div>

            <ModQuickFilters value={quickFilter} onChange={handleQuickFilter} />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
              <span>
                {loading
                  ? "Loading…"
                  : total > 0
                    ? `${total.toLocaleString()} mods`
                    : "No mods found"}
              </span>
              <div className="flex items-center gap-2 lg:hidden">
                <select
                  aria-label="Category"
                  value={categorySlug ?? ""}
                  onChange={(e) =>
                    handleCategorySelect(e.target.value || null)
                  }
                  className="rounded-lg border border-border bg-bg px-2 py-1 text-xs text-text"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {categorySlug && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect(null)}
                  className="text-accent hover:underline"
                >
                  Clear category filter
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
            {error && (
              <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </div>
            )}

            {loading ? (
              <ModCardSkeletonGrid count={perPage > 12 ? 9 : 6} />
            ) : mods.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-muted">
                <p>No mods match your filters.</p>
                <p className="mt-1 text-xs">Try another category or search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {featuredMod && (
                  <ModFeaturedBanner mod={featuredMod} gameCover={cover} />
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {gridMods.map((mod) => (
                    <ModStoreCard key={mod.id} mod={mod} gameCover={cover} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {total > 0 && (
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

        <CategorySidebar
          categories={categories}
          loading={categoriesLoading}
          selectedSlug={categorySlug}
          onSelect={handleCategorySelect}
        />
      </div>
    </DiscoverShell>
  );
}
