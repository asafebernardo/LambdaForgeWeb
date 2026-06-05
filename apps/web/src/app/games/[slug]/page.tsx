import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModGrid } from "@/components/mods/ModGrid";
import { fetchGame, sdk } from "@/lib/api";
import { gameCoverUrl } from "@/lib/config";
import Image from "next/image";

export const revalidate = 60;

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await fetchGame(slug);
  if (!game) return { title: "Game not found" };
  return {
    title: `${game.name} mods`,
    description: `Mods for ${game.name} on Lambda Forge.`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await fetchGame(slug);
  if (!game) notFound();

  const modsResult = await sdk
    .listMods({ game: slug, sort: "popular" })
    .catch(() => ({ data: [], meta: { total: 0, page: 1, limit: 20 } }));

  return (
    <>
      <Header active="mods" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-sm">
            <Image
              src={gameCoverUrl(game)}
              alt={game.name}
              fill
              className="object-cover"
              unoptimized={!game.steamAppId}
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">{game.name}</h1>
            <p className="mt-1 text-muted">
              {game.modCount ?? modsResult.meta.total} published mods
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Mods</h2>
          <div className="mt-4">
            <ModGrid mods={modsResult.data} emptyMessage={`No mods for ${game.name} yet.`} />
          </div>
        </section>

        <section className="mt-12">
          <Link href="/mods" className="text-sm text-accent">
            View all mods →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
