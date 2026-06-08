import { Queue } from "bullmq";
import { indexerConfig } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { weeklyCategorySlot } from "../lib/priority.js";
import { refreshStaleMods } from "../sources/gamebanana/adapter.js";
import { createRedisConnection } from "../queue/connection.js";
import { QUEUE_NAMES } from "../queue/names.js";

const connection = createRedisConnection();

function hours(ms: number) {
  return ms * 60 * 60 * 1000;
}

export async function startSchedulers() {
  const metadataQ = new Queue(QUEUE_NAMES.METADATA_SYNC, { connection });
  const staleQ = new Queue(QUEUE_NAMES.STALE_REFRESH, { connection });
  const popularityQ = new Queue(QUEUE_NAMES.POPULARITY_UPDATE, { connection });

  async function enqueuePopularGamesSync() {
    const sources = await prisma.syncSource.findMany({
      where: { enabled: true, type: "GAMEBANANA" },
    });
    for (const source of sources) {
      await metadataQ.add(
        "hourly-game-sync",
        { syncSourceId: source.id, page: 1, perPage: indexerConfig.metadataBatchSize },
        {
          priority: 10,
          attempts: 5,
          backoff: { type: "exponential", delay: 1000 },
        },
      );
    }
    console.log(`[scheduler] enqueued metadata sync for ${sources.length} sources`);
  }

  async function enqueueStaleRefresh() {
    const stale = await refreshStaleMods(30);
    for (const mod of stale) {
      if (!mod.syncSourceId) continue;
      await staleQ.add(
        "stale-mod",
        {
          indexedModId: mod.id,
          syncSourceId: mod.syncSourceId,
          externalModId: mod.externalId,
        },
        {
          priority: mod.syncPriority,
          attempts: 5,
          backoff: { type: "exponential", delay: 1000 },
        },
      );
    }
    console.log(`[scheduler] enqueued ${stale.length} stale mod refreshes`);
  }

  async function enqueuePopularityUpdate() {
    await popularityQ.add("daily-popularity", { limit: 100 }, { attempts: 3 });
    console.log("[scheduler] enqueued popularity update");
  }

  async function weeklyCategoryRotation() {
    const slot = weeklyCategorySlot();
    const categories = await prisma.indexedMod.findMany({
      where: { categoryName: { not: null } },
      select: { categoryName: true },
      distinct: ["categoryName"],
    });
    const names = categories.map((c) => c.categoryName!).filter(Boolean);
    if (!names.length) return;

    const category = names[slot % names.length];
    const mods = await prisma.indexedMod.findMany({
      where: { categoryName: category },
      orderBy: { downloads: "desc" },
      take: 40,
      select: { id: true, syncSourceId: true, externalId: true },
    });

    for (const mod of mods) {
      if (!mod.syncSourceId) continue;
      await staleQ.add(
        "category-rotation",
        {
          indexedModId: mod.id,
          syncSourceId: mod.syncSourceId,
          externalModId: mod.externalId,
        },
        { priority: 5, attempts: 3, backoff: { type: "exponential", delay: 1000 } },
      );
    }
    console.log(`[scheduler] weekly rotation category="${category}" mods=${mods.length}`);
  }

  async function cleanupQueue() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deleted = await prisma.syncQueueItem.deleteMany({
      where: {
        status: { in: ["COMPLETED", "FAILED", "CANCELLED"] },
        completedAt: { lt: cutoff },
      },
    });
    console.log(`[scheduler] cleaned ${deleted.count} old queue items`);
  }

  // Hourly: popular game first-page sync
  setInterval(() => void enqueuePopularGamesSync(), hours(1));
  // Every 15 min: stale mods due for refresh
  setInterval(() => void enqueueStaleRefresh(), hours(0.25));
  // Daily: popularity batch
  setInterval(() => void enqueuePopularityUpdate(), hours(24));
  // Weekly: category rotation (check daily, run on matching slot once per day)
  let lastRotationDay = -1;
  setInterval(() => {
    const day = new Date().getDate();
    if (day !== lastRotationDay) {
      lastRotationDay = day;
      void weeklyCategoryRotation();
    }
  }, hours(24));
  // Daily cleanup
  setInterval(() => void cleanupQueue(), hours(24));

  // Bootstrap on start (delayed to let workers attach)
  setTimeout(() => {
    void enqueuePopularGamesSync();
    void enqueueStaleRefresh();
  }, 5000);

  console.log("[scheduler] cron intervals registered");
  return async () => {
    await metadataQ.close();
    await staleQ.close();
    await popularityQ.close();
  };
}
