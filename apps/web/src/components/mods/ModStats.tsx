import type { ModSummary } from "@lambda-forge/types";
import { RatingStars } from "./RatingStars";

interface ModStatsProps {
  mod: ModSummary;
}

export function ModStats({ mod }: ModStatsProps) {
  return (
    <dl className="flex flex-wrap gap-4 text-sm">
      <div>
        <dt className="text-xs text-muted">Downloads</dt>
        <dd className="font-semibold">{mod.downloadCount.toLocaleString()}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted">Rating</dt>
        <dd>
          <RatingStars value={mod.averageRating} count={mod.ratingCount} />
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted">Comments</dt>
        <dd className="font-semibold">{mod.commentCount ?? 0}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted">Updated</dt>
        <dd>{new Date(mod.updatedAt).toLocaleDateString()}</dd>
      </div>
    </dl>
  );
}
