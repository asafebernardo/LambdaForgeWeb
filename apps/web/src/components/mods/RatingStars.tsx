interface RatingStarsProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  onRate?: (score: number) => void;
}

export function RatingStars({ value, count, size = "md", onRate }: RatingStarsProps) {
  const starSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onRate}
          onClick={() => onRate?.(star)}
          className={`${starSize} ${onRate ? "cursor-pointer hover:scale-110" : "cursor-default"} ${
            star <= Math.round(value) ? "text-accent" : "text-border"
          } bg-transparent p-0 leading-none`}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
      {count !== undefined && (
        <span className="ml-1 text-xs text-muted">({count})</span>
      )}
    </span>
  );
}
