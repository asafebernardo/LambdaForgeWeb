import type { Prisma } from "@prisma/client";
import { indexerConfig } from "../config.js";

/** BullMQ connection options (avoids ioredis version mismatch). */
export function createRedisConnection() {
  return {
    url: indexerConfig.redisUrl,
    maxRetriesPerRequest: null as null,
  };
}

export function asJson(value: Record<string, unknown>): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
