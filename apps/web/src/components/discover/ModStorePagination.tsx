const PER_PAGE_OPTIONS = [12, 24, 48] as const;

interface ModStorePaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function ModStorePagination({
  page,
  totalPages,
  totalCount,
  perPage,
  loading,
  onPageChange,
  onPerPageChange,
}: ModStorePaginationProps) {
  const start = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);

  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-xl px-4 py-3">
      <div className="text-sm text-muted">
        {totalCount > 0 ? (
          <>
            Showing <span className="text-text">{start}–{end}</span> of{" "}
            <span className="font-medium text-text">{totalCount.toLocaleString()}</span> results
          </>
        ) : (
          "No results"
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          Per page
          <select
            aria-label="Results per page"
            value={perPage}
            disabled={loading}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-border bg-bg px-2 py-1.5 text-sm text-text"
          >
            {PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="min-w-[5rem] text-center text-sm font-medium">
            {page} / {Math.max(totalPages, 1)}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
