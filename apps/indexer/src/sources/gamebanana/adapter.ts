import type { SyncSource } from "@prisma/client";
import slugify from "slugify";
import { prisma } from "../../lib/prisma.js";
import {
  computeNextSyncAt,
  computePriorityScore,
  syncPriorityFromScore,
} from "../../lib/priority.js";
import {
  fetchGameModPage,
  fetchModDetail,
  type GameBananaModRecord,
} from "./client.js";
import { indexModDocument } from "../../services/meilisearch.service.js";

function modSlug(_name: string, externalId: string) {
  return `gb-${externalId}`;
}

async function upsertAuthor(record: GameBananaModRecord) {
  if (!record.authorExternalId && !record.authorName) return null;

  const externalId = record.authorExternalId ?? record.authorName ?? "unknown";
  return prisma.indexedAuthor.upsert({
    where: {
      source_externalId: { source: "GAMEBANANA", externalId },
    },
    create: {
      source: "GAMEBANANA",
      externalId,
      name: record.authorName ?? "Unknown",
      slug: slugify(record.authorName ?? externalId, { lower: true, strict: true }),
    },
    update: {
      name: record.authorName ?? "Unknown",
    },
  });
}

export async function upsertIndexedMod(
  source: SyncSource,
  record: GameBananaModRecord,
  opts?: { fetchDetail?: boolean },
) {
  let data = record;
  if (opts?.fetchDetail) {
    try {
      data = await fetchModDetail(record.externalId);
    } catch {
      /* keep list data */
    }
  }

  const author = await upsertAuthor(data);
  const score = computePriorityScore({
    downloads: data.downloads,
    views: data.views,
    likes: data.likes,
    downloadsRecent: 0,
    viewsRecent: 0,
    externalUpdatedAt: data.externalUpdatedAt,
  });

  const slug = modSlug(data.name, data.externalId);
  const existing = await prisma.indexedMod.findUnique({
    where: { source_externalId: { source: "GAMEBANANA", externalId: data.externalId } },
  });

  const mod = await prisma.indexedMod.upsert({
    where: { source_externalId: { source: "GAMEBANANA", externalId: data.externalId } },
    create: {
      externalId: data.externalId,
      source: "GAMEBANANA",
      syncSourceId: source.id,
      name: data.name,
      slug: existing?.slug ?? slug,
      description: data.description,
      shortDescription: data.shortDescription,
      version: data.version,
      authorId: author?.id,
      authorName: data.authorName,
      gameId: source.gameId,
      categoryExternalId: data.categoryExternalId,
      categoryName: data.categoryName,
      views: data.views,
      downloads: data.downloads,
      likes: data.likes,
      thumbnailUrl: data.thumbnailUrl,
      externalUrl: data.externalUrl,
      downloadUrl: data.downloadUrl,
      fileSizeBytes: data.fileSizeBytes,
      externalUpdatedAt: data.externalUpdatedAt,
      priorityScore: score,
      syncPriority: syncPriorityFromScore(score),
      nextSyncAt: computeNextSyncAt(score),
      lastSyncAt: new Date(),
      lastSuccessfulSync: new Date(),
      failedSyncAttempts: 0,
    },
    update: {
      name: data.name,
      description: data.description,
      shortDescription: data.shortDescription,
      version: data.version,
      authorId: author?.id,
      authorName: data.authorName,
      categoryExternalId: data.categoryExternalId,
      categoryName: data.categoryName,
      views: data.views,
      downloads: data.downloads,
      likes: data.likes,
      thumbnailUrl: data.thumbnailUrl,
      externalUrl: data.externalUrl,
      downloadUrl: data.downloadUrl,
      fileSizeBytes: data.fileSizeBytes,
      externalUpdatedAt: data.externalUpdatedAt,
      priorityScore: score,
      syncPriority: syncPriorityFromScore(score),
      nextSyncAt: computeNextSyncAt(score),
      lastSyncAt: new Date(),
      lastSuccessfulSync: new Date(),
      failedSyncAttempts: 0,
    },
    include: { game: true, tags: true },
  });

  if (data.previewUrls.length) {
    await prisma.indexedModImage.deleteMany({ where: { modId: mod.id } });
    await prisma.indexedModImage.createMany({
      data: data.previewUrls.slice(0, 8).map((url, i) => ({
        modId: mod.id,
        url,
        sortOrder: i,
      })),
    });
  }

  if (data.version && data.downloadUrl) {
    await prisma.indexedModVersion.upsert({
      where: { modId_version: { modId: mod.id, version: data.version } },
      create: {
        modId: mod.id,
        version: data.version,
        downloadUrl: data.downloadUrl,
        fileSizeBytes: data.fileSizeBytes,
        externalUpdatedAt: data.externalUpdatedAt,
      },
      update: {
        downloadUrl: data.downloadUrl,
        fileSizeBytes: data.fileSizeBytes,
        externalUpdatedAt: data.externalUpdatedAt,
      },
    });
  }

  await indexModDocument(mod);
  return mod;
}

export async function syncGameMetadataPage(
  source: SyncSource,
  page: number,
  perPage: number,
) {
  if (!source.externalGameId) {
    throw new Error(`SyncSource ${source.id} missing externalGameId`);
  }

  const { records, totalPages } = await fetchGameModPage(
    source.externalGameId,
    page,
    perPage,
  );

  let upserted = 0;
  for (const record of records) {
    await upsertIndexedMod(source, record);
    upserted++;
  }

  return { upserted, totalPages, page };
}

export async function syncSingleMod(source: SyncSource, externalModId: string) {
  const detail = await fetchModDetail(externalModId);
  return upsertIndexedMod(source, detail, { fetchDetail: false });
}

export async function refreshStaleMods(limit: number) {
  const now = new Date();
  return prisma.indexedMod.findMany({
    where: {
      OR: [{ nextSyncAt: { lte: now } }, { nextSyncAt: null }],
    },
    orderBy: [{ priorityScore: "desc" }, { downloads: "desc" }],
    take: limit,
    include: { syncSource: true },
  });
}

export async function syncPopularityBatch(limit: number) {
  const mods = await prisma.indexedMod.findMany({
    orderBy: [{ priorityScore: "desc" }, { downloads: "desc" }],
    take: limit,
    include: { syncSource: true },
  });

  for (const mod of mods) {
    if (!mod.syncSource?.externalGameId) continue;
    try {
      const detail = await fetchModDetail(mod.externalId);
      const score = computePriorityScore({
        downloads: detail.downloads,
        views: detail.views,
        likes: detail.likes,
        downloadsRecent: Math.max(0, detail.downloads - mod.downloads),
        viewsRecent: Math.max(0, detail.views - mod.views),
        externalUpdatedAt: detail.externalUpdatedAt,
      });

      await prisma.indexedMod.update({
        where: { id: mod.id },
        data: {
          views: detail.views,
          downloads: detail.downloads,
          likes: detail.likes,
          downloadsRecent: Math.max(0, detail.downloads - mod.downloads),
          viewsRecent: Math.max(0, detail.views - mod.views),
          priorityScore: score,
          syncPriority: syncPriorityFromScore(score),
          nextSyncAt: computeNextSyncAt(score),
          lastSyncAt: new Date(),
        },
      });
    } catch {
      await prisma.indexedMod.update({
        where: { id: mod.id },
        data: {
          failedSyncAttempts: { increment: 1 },
          nextSyncAt: computeNextSyncAt(0),
        },
      });
    }
  }

  return mods.length;
}
