import { gameCoverUrl } from "@/lib/config";
import type { Game } from "@lambda-forge/types";

interface GamePosterHeaderProps {
  game: Game;
  onBack: () => void;
}

export function GamePosterHeader({ game, onBack }: GamePosterHeaderProps) {
  const cover = gameCoverUrl(game);

  return (
    <div className="relative shrink-0 overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <img
          src={cover}
          alt=""
          className="h-full w-full object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 to-bg/80" />
      </div>

      <div className="relative flex items-center gap-4 px-6 py-5 sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg/60 text-muted transition hover:text-text"
          aria-label="Back to games"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <img
          src={cover}
          alt={game.name}
          className="h-16 w-12 shrink-0 rounded-md object-cover shadow-lg sm:h-20 sm:w-[3.75rem]"
        />

        <div className="min-w-0">
          <h1 className="font-display truncate text-xl font-semibold sm:text-2xl">{game.name}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {(game.modCount ?? 0) > 0
              ? `${game.modCount} community mods`
              : "Browse and download community mods"}
          </p>
        </div>
      </div>
    </div>
  );
}
