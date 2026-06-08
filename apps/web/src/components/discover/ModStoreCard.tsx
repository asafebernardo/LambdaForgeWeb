import { Link } from "react-router-dom";
import type { ModDetail } from "@lambda-forge/types";

function modThumbnail(mod: ModDetail, gameCover?: string): string | null {
  const shot = mod.media?.find((m) => m.type === "SCREENSHOT" && m.url);
  return shot?.url ?? gameCover ?? null;
}

interface ModStoreCardProps {
  mod: ModDetail;
  gameCover?: string;
}

export function ModStoreCard({ mod, gameCover }: ModStoreCardProps) {
  const thumb = modThumbnail(mod, gameCover);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-200 hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(232,93,4,0.12)]">
      <Link to={`/mods/${mod.slug}`} className="relative aspect-video overflow-hidden bg-bg">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-bg">
            <span className="text-3xl font-bold text-accent/40">λ</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-end justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="mb-3 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg">
            View details
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <Link
          to={`/mods/${mod.slug}`}
          className="line-clamp-2 text-sm font-medium leading-tight text-text hover:text-accent"
        >
          {mod.title}
        </Link>
        <p className="truncate text-xs text-muted">
          {mod.author?.username ?? "Unknown"}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-1 text-[11px] text-muted">
          {mod.averageRating > 0 && (
            <span className="text-accent">★ {mod.averageRating.toFixed(1)}</span>
          )}
          <span>{mod.downloadCount.toLocaleString()} dl</span>
        </div>
      </div>
    </article>
  );
}

interface ModFeaturedBannerProps {
  mod: ModDetail;
  gameCover?: string;
}

export function ModFeaturedBanner({ mod, gameCover }: ModFeaturedBannerProps) {
  const thumb = modThumbnail(mod, gameCover);

  return (
    <Link
      to={`/mods/${mod.slug}`}
      className="group relative flex overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 via-card to-card transition hover:border-accent/50"
    >
      <div className="relative hidden w-48 shrink-0 sm:block">
        {thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-[8rem] items-center justify-center bg-accent/20">
            <span className="text-4xl font-bold text-accent/50">λ</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
          Featured
        </span>
        <h3 className="text-lg font-semibold group-hover:text-accent">{mod.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{mod.description}</p>
        <div className="flex gap-3 text-xs text-muted">
          <span>{mod.downloadCount.toLocaleString()} downloads</span>
          {mod.averageRating > 0 && (
            <span className="text-accent">★ {mod.averageRating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ModCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="aspect-video bg-border/40" />
          <div className="space-y-2 p-2.5">
            <div className="h-4 rounded bg-border/40" />
            <div className="h-3 w-2/3 rounded bg-border/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
