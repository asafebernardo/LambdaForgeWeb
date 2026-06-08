import type { SyncJobStatus, SyncJobType } from "@prisma/client";
import { prisma } from "./prisma.js";
import { asJson } from "../queue/connection.js";

export async function writeSyncLog(input: {
  syncSourceId?: string;
  jobType: SyncJobType;
  status: SyncJobStatus;
  message?: string;
  metadata?: Record<string, unknown>;
  durationMs?: number;
  rateLimitHit?: boolean;
}) {
  return prisma.syncLog.create({
    data: {
      syncSourceId: input.syncSourceId,
      jobType: input.jobType,
      status: input.status,
      message: input.message,
      metadata: input.metadata ? asJson(input.metadata) : undefined,
      durationMs: input.durationMs,
      rateLimitHit: input.rateLimitHit ?? false,
    },
  });
}

export async function trackQueueItem(input: {
  bullJobId: string;
  jobType: SyncJobType;
  payload: Record<string, unknown>;
  syncSourceId?: string;
  indexedModId?: string;
  priority?: number;
}) {
  return prisma.syncQueueItem.upsert({
    where: { bullJobId: input.bullJobId },
    create: {
      bullJobId: input.bullJobId,
      jobType: input.jobType,
      payload: asJson(input.payload),
      syncSourceId: input.syncSourceId,
      indexedModId: input.indexedModId,
      priority: input.priority ?? 0,
      status: "PENDING",
    },
    update: {
      payload: asJson(input.payload),
      priority: input.priority ?? 0,
    },
  });
}

export async function markQueueProcessing(bullJobId: string) {
  return prisma.syncQueueItem.update({
    where: { bullJobId },
    data: { status: "PROCESSING", startedAt: new Date(), attempts: { increment: 1 } },
  });
}

export async function markQueueCompleted(bullJobId: string) {
  return prisma.syncQueueItem.update({
    where: { bullJobId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

export async function markQueueFailed(bullJobId: string, error: string) {
  return prisma.syncQueueItem.update({
    where: { bullJobId },
    data: { status: "FAILED", lastError: error, completedAt: new Date() },
  });
}
