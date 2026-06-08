import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

loadEnv({ path: resolve(process.cwd(), "../../.env") });
loadEnv();

export const indexerConfig = {
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  meiliHost: process.env.MEILI_HOST ?? "http://localhost:7700",
  meiliApiKey: process.env.MEILI_API_KEY ?? "dev-master-key",
  /** Min delay between outbound API requests (ms). */
  requestMinDelayMs: Number(process.env.INDEXER_MIN_DELAY_MS ?? 800),
  requestMaxDelayMs: Number(process.env.INDEXER_MAX_DELAY_MS ?? 2200),
  maxConcurrentRequests: Number(process.env.INDEXER_MAX_CONCURRENT ?? 2),
  rateLimitCooldownMs: Number(process.env.INDEXER_COOLDOWN_MS ?? 120_000),
  metadataBatchSize: Number(process.env.INDEXER_PAGE_SIZE ?? 25),
  userAgent:
    process.env.INDEXER_USER_AGENT ??
    "CapyMods-Indexer/0.1 (+https://github.com/asafebernardo/LambdaForgeWeb)",
};
