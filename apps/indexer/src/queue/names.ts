export const QUEUE_NAMES = {
  METADATA_SYNC: "indexer:metadata-sync",
  IMAGE_SYNC: "indexer:image-sync",
  POPULARITY_UPDATE: "indexer:popularity-update",
  STALE_REFRESH: "indexer:stale-refresh",
} as const;

export type MetadataSyncJob = {
  syncSourceId: string;
  page?: number;
  perPage?: number;
};

export type StaleRefreshJob = {
  indexedModId: string;
  syncSourceId: string;
  externalModId: string;
};

export type PopularityUpdateJob = {
  limit?: number;
};

export type ImageSyncJob = {
  indexedModId: string;
  imageUrl: string;
};
