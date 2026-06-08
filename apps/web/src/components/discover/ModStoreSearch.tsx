import { useEffect, useMemo, useRef, useState } from "react";

const HISTORY_KEY = "lf-mod-search-history";

function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function pushSearchHistory(term: string) {
  const q = term.trim();
  if (q.length < 2) return;
  const prev = getSearchHistory().filter((h) => h !== q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...prev].slice(0, 8)));
}

interface ModStoreSearchProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onCommit?: (value: string) => void;
}

export function ModStoreSearch({
  value,
  onChange,
  suggestions,
  onCommit,
}: ModStoreSearchProps) {
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) setHistory(getSearchHistory());
  }, [focused]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applySuggestion = (text: string) => {
    onChange(text);
    pushSearchHistory(text);
    setHistory(getSearchHistory());
    onCommit?.(text);
    setFocused(false);
  };

  const showDropdown =
    focused && (suggestions.length > 0 || history.length > 0);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          id="mod-store-search"
          type="search"
          placeholder="Search mods, authors, categories…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              pushSearchHistory(value);
              setHistory(getSearchHistory());
              onCommit?.(value);
              setFocused(false);
            }
          }}
          className="w-full rounded-lg border border-border bg-card/60 py-2.5 pl-10 pr-9 text-sm text-text backdrop-blur-sm placeholder:text-muted focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-text"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Suggestions
              </p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-bg"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div className="border-t border-border p-2">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Recent
              </p>
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => applySuggestion(h)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-bg hover:text-text"
                >
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function useSearchSuggestions(mods: { title: string }[], query: string): string[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const names = new Set<string>();
    const results: string[] = [];
    for (const mod of mods) {
      if (mod.title.toLowerCase().includes(q) && !names.has(mod.title)) {
        names.add(mod.title);
        results.push(mod.title);
        if (results.length >= 6) break;
      }
    }
    return results;
  }, [mods, query]);
}
