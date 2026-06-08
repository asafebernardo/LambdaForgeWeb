import type { DownloadAsset, DownloadsManifest } from "@lambda-forge/types";
import manifest from "../../public/data/downloads.json";

export function getDownloadsManifest(): DownloadsManifest {
  return manifest as DownloadsManifest;
}

export function getDownloadAsset(id: string): DownloadAsset | undefined {
  return getDownloadsManifest().assets.find((a) => a.id === id);
}

/** Direct file URL when configured, otherwise the download page with anchor. */
export function resolveDownloadHref(assetId: string, fallbackHash?: string): string {
  const asset = getDownloadAsset(assetId);
  if (asset?.url) return asset.url;
  return fallbackHash ? `/download#${fallbackHash}` : "/download";
}

export function isDownloadAvailable(assetId: string): boolean {
  return Boolean(getDownloadAsset(assetId)?.url);
}
