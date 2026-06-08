export type QuickFilterId = "all" | "popular" | "trending" | "new" | "updated" | "top-rated";

export const QUICK_FILTERS: { id: QuickFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
  { id: "updated", label: "Updated" },
  { id: "top-rated", label: "Top rated" },
];

export function quickFilterToSort(filter: QuickFilterId): string {
  switch (filter) {
    case "popular":
    case "trending":
      return "popular";
    case "new":
    case "updated":
      return "recent";
    case "top-rated":
      return "rating";
    default:
      return "recent";
  }
}

interface ModQuickFiltersProps {
  value: QuickFilterId;
  onChange: (id: QuickFilterId) => void;
}

export function ModQuickFilters({ value, onChange }: ModQuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            value === id
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-muted hover:border-accent/30 hover:text-text"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
