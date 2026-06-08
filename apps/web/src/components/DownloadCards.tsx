import type { DownloadAsset } from "@lambda-forge/types";
import { formatBytes } from "@/lib/format";

interface DownloadCardsProps {
  assets: DownloadAsset[];
}

export function DownloadCards({ assets }: DownloadCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
      {assets.map((asset) => (
        <article
          key={asset.id}
          id={asset.id}
          className="glass-card flex flex-col rounded-2xl p-6 scroll-mt-24"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {asset.os}
          </span>
          <h3 className="mt-1 text-lg font-semibold">{asset.title}</h3>
          {asset.file && (
            <p className="mt-2 break-all font-mono text-xs text-muted">{asset.file}</p>
          )}
          {asset.size != null && (
            <p className="mt-1 text-sm text-muted">{formatBytes(asset.size)}</p>
          )}
          <a
            href={asset.url!}
            download
            className="btn-primary mt-6 block rounded-xl py-3 text-center text-sm font-semibold no-underline transition hover:opacity-95"
          >
            Download
          </a>
        </article>
      ))}
    </div>
  );
}
