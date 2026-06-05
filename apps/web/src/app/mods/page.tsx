import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModFilters } from "@/components/mods/ModFilters";
import { ModGrid } from "@/components/mods/ModGrid";
import { fetchGames, sdk } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mods",
  description: "Browse and download mods for supported games.",
};

interface ModsPageProps {
  searchParams: Promise<{
    game?: string;
    category?: string;
    tags?: string | string[];
    q?: string;
    sort?: "recent" | "popular" | "rating";
    page?: string;
  }>;
}

export default async function ModsPage({ searchParams }: ModsPageProps) {
  const params = await searchParams;
  const tags = params.tags
    ? Array.isArray(params.tags)
      ? params.tags
      : [params.tags]
    : undefined;

  const [games, modsResult] = await Promise.all([
    fetchGames(),
    sdk.listMods({
      game: params.game,
      category: params.category,
      tags,
      q: params.q,
      sort: params.sort ?? "recent",
      page: params.page ? Number(params.page) : 1,
    }).catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 20 } })),
  ]);

  return (
    <>
      <Header active="mods" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Mod catalog</h1>
        <p className="mt-2 text-muted">
          Browse community mods for Vintage Story, Project Zomboid, Kenshi, and more.
        </p>

        <div className="mt-6">
          <Suspense fallback={null}>
            <ModFilters games={games.filter((g): g is typeof g & { id: string } => "id" in g)} />
          </Suspense>
        </div>

        <div className="mt-8">
          <ModGrid mods={modsResult.data} />
        </div>

        {modsResult.meta.total > modsResult.meta.limit && (
          <p className="mt-6 text-center text-sm text-muted">
            Showing page {modsResult.meta.page} — {modsResult.meta.total} mods total
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
