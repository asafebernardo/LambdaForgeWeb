import type { DownloadAsset } from "@lambda-forge/types";
import { formatBytes } from "@/lib/format";

interface DownloadCardsProps {
  assets: DownloadAsset[];
}

export function DownloadCards({ assets }: DownloadCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {assets.map((asset) => {
        const available = Boolean(asset.url);
        return (
          <article
            key={asset.id}
            className="flex flex-col rounded-xl border border-border bg-card p-5"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {asset.os}
            </span>
            <h3 className="mt-1 text-base font-semibold">{asset.title}</h3>
            <p className="min-h-10 break-all font-mono text-xs text-muted">
              {asset.file || (available ? asset.title : "Coming soon.")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {available ? formatBytes(asset.size) : ""}
            </p>
            {available ? (
              <a
                href={asset.url!}
                download
                className="mt-auto block rounded-[10px] bg-gradient-to-br from-accent to-accent-dim py-2.5 text-center text-sm font-semibold text-accent-foreground no-underline transition hover:opacity-95"
              >
                Download
              </a>
            ) : (
              <span className="mt-auto block rounded-[10px] border border-dashed border-border py-2.5 text-center text-sm text-muted">
                Unavailable
              </span>
            )}
          </article>
        );
      })}
    </div>
  );
}
