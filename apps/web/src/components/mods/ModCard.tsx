import Link from "next/link";
import type { ModSummary } from "@lambda-forge/types";
import { RatingStars } from "./RatingStars";
import { AuthorBadge } from "./AuthorBadge";

interface ModCardProps {
  mod: ModSummary;
}

export function ModCard({ mod }: ModCardProps) {
  return (
    <Link
      href={`/mods/${mod.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card/60 p-4 no-underline transition hover:border-accent/40 hover:bg-card"
    >
      <h3 className="line-clamp-2 text-base font-semibold text-text group-hover:text-accent">
        {mod.title}
      </h3>
      <p className="mt-1 text-xs text-muted">{mod.game.name}</p>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{mod.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <AuthorBadge username={mod.author.username} />
        <RatingStars value={mod.averageRating} count={mod.ratingCount} size="sm" />
        <span>{mod.downloadCount.toLocaleString()} downloads</span>
      </div>
    </Link>
  );
}
