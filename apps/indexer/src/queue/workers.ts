import { Job, Worker } from "bullmq";
import { indexerConfig } from "../config.js";
import { prisma } from "../lib/prisma.js";
import { UpstreamRateLimitError } from "../sources/gamebanana/client.js";
import {
  markQueueCompleted,
  markQueueFailed,
  markQueueProcessing,
  trackQueueItem,
  writeSyncLog,
} from "../lib/sync-log.js";
import { createRedisConnection } from "./connection.js";
import {
  QUEUE_NAMES,
  type MetadataSyncJob,
  type PopularityUpdateJob,
  type StaleRefreshJob,
} from "./names.js";
import {
  syncGameMetadataPage,
  syncPopularityBatch,
  syncSingleMod,
} from "../sources/gamebanana/adapter.js";

const connection = createRedisConnection();

async function wrapJob<T>(
  job: Job<T>,
  jobType: "METADATA_SYNC" | "POPULARITY_UPDATE" | "STALE_REFRESH" | "IMAGE_SYNC",
  handler: () => Promise<unknown>,
) {
  const started = Date.now();
  await trackQueueItem({
    bullJobId: job.id!,
    jobType,
    payload: job.data as Record<string, unknown>,
    syncSourceId: (job.data as MetadataSyncJob).syncSourceId,
  });
  await markQueueProcessing(job.id!);

  try {
    const result = await handler();
    await markQueueCompleted(job.id!);
    await writeSyncLog({
      syncSourceId: (job.data as MetadataSyncJob).syncSourceId,
      jobType,
      status: "COMPLETED",
      durationMs: Date.now() - started,
      metadata: { result: result as Record<string, unknown> },
    });
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await markQueueFailed(job.id!, message);
    await writeSyncLog({
      syncSourceId: (job.data as MetadataSyncJob).syncSourceId,
      jobType,
      status: "FAILED",
      message,
      durationMs: Date.now() - started,
      rateLimitHit: err instanceof UpstreamRateLimitError,
    });
    throw err;
  }
}

export function startWorkers() {
  const metadataWorker = new Worker<MetadataSyncJob>(
    QUEUE_NAMES.METADATA_SYNC,
    async (job) =>
      wrapJob(job, "METADATA_SYNC", async () => {
        const { syncSourceId, page = 1, perPage = indexerConfig.metadataBatchSize } =
          job.data;
        const source = await prisma.syncSource.findUnique({
          where: { id: syncSourceId },
        });
        if (!source?.enabled) return { skipped: true };

        const result = await syncGameMetadataPage(source, page, perPage);

        if (page < result.totalPages) {
          const { Queue } = await import("bullmq");
          const q = new Queue(QUEUE_NAMES.METADATA_SYNC, { connection });
          await q.add(
            "next-page",
            { syncSourceId, page: page + 1, perPage },
            {
              delay: indexerConfig.requestMinDelayMs,
              priority: job.opts.priority,
              attempts: 5,
              backoff: { type: "exponential", delay: 1000 },
            },
          );
          await q.close();
        } else {
          await prisma.syncSource.update({
            where: { id: syncSourceId },
            data: { lastFullSyncAt: new Date() },
          });
        }

        return result;
      }),
    {
      connection,
      concurrency: 1,
      limiter: { max: 1, duration: indexerConfig.requestMinDelayMs },
    },
  );

  const staleWorker = new Worker<StaleRefreshJob>(
    QUEUE_NAMES.STALE_REFRESH,
    async (job) =>
      wrapJob(job, "STALE_REFRESH", async () => {
        const source = await prisma.syncSource.findUnique({
          where: { id: job.data.syncSourceId },
        });
        if (!source) return { skipped: true };
        return syncSingleMod(source, job.data.externalModId);
      }),
    { connection, concurrency: 1 },
  );

  const popularityWorker = new Worker<PopularityUpdateJob>(
    QUEUE_NAMES.POPULARITY_UPDATE,
    async (job) =>
      wrapJob(job, "POPULARITY_UPDATE", async () => {
        const limit = job.data.limit ?? 50;
        return { updated: await syncPopularityBatch(limit) };
      }),
    { connection, concurrency: 1 },
  );

  const imageWorker = new Worker(
    QUEUE_NAMES.IMAGE_SYNC,
    async (job) =>
      wrapJob(job, "IMAGE_SYNC", async () => {
        // Phase 1: store URL only; MinIO cache in a later iteration.
        return { cached: false, url: (job.data as { imageUrl: string }).imageUrl };
      }),
    { connection, concurrency: 1 },
  );

  for (const w of [metadataWorker, staleWorker, popularityWorker, imageWorker]) {
    w.on("failed", (job, err) => {
      if (!job) return;
      const attempt = job.attemptsMade;
      console.error(`[worker] ${job.name} failed (attempt ${attempt}):`, err.message);
      if (err instanceof UpstreamRateLimitError) {
        console.warn(`[worker] rate limit cooldown ${err.retryAfterMs ?? "default"}ms`);
      }
    });
  }

  console.log("[indexer] workers started");
  return () =>
    Promise.all([
      metadataWorker.close(),
      staleWorker.close(),
      popularityWorker.close(),
      imageWorker.close(),
    ]);
}
