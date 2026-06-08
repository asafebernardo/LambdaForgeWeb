import type { Category } from "@lambda-forge/types";

interface CategorySidebarProps {
  categories: Category[];
  loading: boolean;
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategorySidebar({
  categories,
  loading,
  selectedSlug,
  onSelect,
}: CategorySidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-l border-border bg-bg/50 lg:block">
      <div className="sticky top-0 border-b border-border bg-bg/80 px-4 py-3 backdrop-blur-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Categories
        </h2>
      </div>

      <nav className="p-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`mb-0.5 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            selectedSlug === null
              ? "bg-accent/10 font-medium text-accent"
              : "text-muted hover:bg-card hover:text-text"
          }`}
        >
          All categories
        </button>

        {loading ? (
          <div className="px-3 py-4 text-xs text-muted">Loading…</div>
        ) : categories.length === 0 ? (
          <p className="px-3 py-4 text-xs text-muted">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelect(cat.slug)}
              className={`mb-0.5 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedSlug === cat.slug
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-muted hover:bg-card hover:text-text"
              }`}
            >
              {cat.name}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}
