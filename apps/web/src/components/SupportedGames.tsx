import type { SupportedGame } from "@lambda-forge/types";
import { Link } from "react-router-dom";
import { GAME_SUPPORT_BADGES, gameCoverUrl } from "@/lib/config";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

interface SupportedGamesProps {
  games: SupportedGame[];
  linkToGamePage?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  Native: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
  Workshop: "bg-sky-500/20 text-sky-300 ring-sky-500/30",
  Community: "bg-accent/20 text-accent ring-accent/30",
  Experimental: "bg-amber-500/20 text-amber-300 ring-amber-500/30",
};

export function SupportedGames({ games, linkToGamePage = false }: SupportedGamesProps) {
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(155px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(165px,1fr))]">
        {games.map((game, i) => {
          const badge = GAME_SUPPORT_BADGES[game.slug];

          const card = (
            <ScrollReveal delay={Math.min(i * 30, 300)}>
              <article className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-[#0d0d0f] shadow-[0_4px_16px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.07] transition duration-300 hover:z-10 hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(232,93,4,0.22)] hover:ring-accent/35">
                <img
                  src={gameCoverUrl(game)}
                  alt={game.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.06] group-hover:brightness-110"
                />

                {badge && (
                  <span
                    className={`absolute left-2 top-2 z-10 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1 backdrop-blur-sm ${BADGE_STYLES[badge]}`}
                  >
                    {badge}
                  </span>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-2.5 pb-2.5 pt-14">
                  <h3 className="line-clamp-2 text-[13px] font-medium leading-tight text-white drop-shadow-sm">
                    {game.name}
                  </h3>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-accent/0 transition duration-300 group-hover:bg-accent/[0.06]" />
                <div className="pointer-events-none absolute inset-0 opacity-0 ring-2 ring-inset ring-accent/0 transition duration-300 group-hover:opacity-100 group-hover:ring-accent/20" />
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
          <article className="flex aspect-[2/3] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-card/25 p-4 text-center transition duration-300 hover:border-accent/40 hover:bg-card/40 hover:shadow-[0_8px_24px_rgba(232,93,4,0.08)]">
            <span className="text-2xl text-accent/70">+</span>
            <p className="mt-2 text-xs font-medium text-muted">More games</p>
            <p className="mt-1 text-[11px] text-muted/70">coming soon</p>
          </article>
        </ScrollReveal>
      </div>
    </div>
  );
}
