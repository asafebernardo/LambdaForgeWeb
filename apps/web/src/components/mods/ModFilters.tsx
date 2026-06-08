"use client";

import { useNavigate, useSearchParams } from "react-router-dom";
import type { Game } from "@lambda-forge/types";

interface ModFiltersProps {
  games: Game[];
}

export function ModFilters({ games }: ModFiltersProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    navigate(`/mods?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card/40 p-4">
      <label className="flex flex-col gap-1 text-xs text-muted">
        Search
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search mods…"
          className="min-w-[200px] rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("q", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Game
        <select
          defaultValue={params.get("game") ?? ""}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
          onChange={(e) => update("game", e.target.value)}
        >
          <option value="">All games</option>
          {games.map((g) => (
            <option key={g.slug} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Sort
        <select
          defaultValue={params.get("sort") ?? "recent"}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text"
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="recent">Recent</option>
          <option value="popular">Popular</option>
          <option value="rating">Top rated</option>
        </select>
      </label>
    </div>
  );
}
