import type { ModSummary } from "@lambda-forge/types";
import { ModCard } from "./ModCard";

interface ModGridProps {
  mods: ModSummary[];
  emptyMessage?: string;
}

export function ModGrid({ mods, emptyMessage = "No mods found." }: ModGridProps) {
  if (!mods.length) {
    return (
      <p className="rounded-lg border border-dashed border-border py-12 text-center text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} />
      ))}
    </div>
  );
}
