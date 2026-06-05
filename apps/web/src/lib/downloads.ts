import type { DownloadsManifest } from "@lambda-forge/types";
import manifest from "../../public/data/downloads.json";

export function getDownloadsManifest(): DownloadsManifest {
  return manifest as DownloadsManifest;
}
