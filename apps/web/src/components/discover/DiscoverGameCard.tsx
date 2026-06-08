import { Link } from "react-router-dom";
import type { Game } from "@lambda-forge/types";
import { gameCoverUrl } from "@/lib/config";

interface DiscoverGameCardProps {
  game: Game;
}

export function DiscoverGameCard({ game }: DiscoverGameCardProps) {
  const cover = gameCoverUrl(game);

  return (
    <Link
      to={`/mods/games/${game.slug}`}
      className="group relative block w-full min-w-0 no-underline hover:no-underline"
    >
      <article className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-[#0d0d0f] shadow-[0_2px_8px_rgba(0,0,0,0.4)] ring-1 ring-white/5 transition duration-300 hover:z-10 hover:scale-[1.03] hover:shadow-[0_12px_36px_rgba(232,93,4,0.2)] hover:ring-accent/30">
        <img
          src={cover}
          alt={game.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-2.5 pb-2.5 pt-12">
          <h3 className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow-sm">
            {game.name}
          </h3>
          {(game.modCount ?? 0) > 0 && (
            <p className="mt-0.5 text-[11px] text-white/70">
              {game.modCount} mods
            </p>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-300 group-hover:bg-accent/5" />
      </article>
    </Link>
  );
}

interface DiscoverGameMosaicProps {
  games: Game[];
}

/** Steam library-style poster grid (2:3 vertical tiles). */
export function DiscoverGameMosaic({ games }: DiscoverGameMosaicProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(155px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(165px,1fr))]">
      {games.map((game) => (
        <DiscoverGameCard key={game.slug} game={game} />
      ))}
    </div>
  );
}
