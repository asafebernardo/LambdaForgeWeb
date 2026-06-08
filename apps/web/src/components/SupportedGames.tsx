import type { SupportedGame } from "@lambda-forge/types";
import { Link } from "react-router-dom";
import { gameCoverUrl } from "@/lib/config";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

interface SupportedGamesProps {
  games: SupportedGame[];
  linkToGamePage?: boolean;
}

export function SupportedGames({ games, linkToGamePage = false }: SupportedGamesProps) {
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(155px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(165px,1fr))]">
        {games.map((game, i) => {
          const card = (
            <ScrollReveal delay={Math.min(i * 30, 300)}>
              <article className="group relative aspect-[2/3] overflow-hidden rounded-md bg-[#0d0d0f] shadow-[0_2px_8px_rgba(0,0,0,0.4)] ring-1 ring-white/5 transition duration-300 hover:z-10 hover:scale-[1.04] hover:shadow-[0_12px_36px_rgba(232,93,4,0.2)] hover:ring-accent/30">
                <img
                  src={gameCoverUrl(game)}
                  alt={game.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-2.5 pb-2.5 pt-12">
                  <h3 className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow-sm">
                    {game.name}
                  </h3>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-300 group-hover:bg-accent/5" />
              </article>
            </ScrollReveal>
          );

          if (linkToGamePage) {
            return (
              <Link
                key={game.slug}
                to={`/mods/games/${game.slug}`}
                className="block no-underline hover:no-underline"
              >
                {card}
              </Link>
            );
          }

          return <div key={game.slug}>{card}</div>;
        })}

        <ScrollReveal delay={200}>
          <article className="flex aspect-[2/3] flex-col items-center justify-center rounded-md border border-dashed border-border/80 bg-card/20 p-4 text-center transition hover:border-accent/40 hover:bg-card/40">
            <span className="text-2xl text-accent/60">+</span>
            <p className="mt-2 text-xs font-medium text-muted">More games</p>
            <p className="mt-1 text-[11px] text-muted/70">coming soon</p>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
}
