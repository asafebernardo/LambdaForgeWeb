import { indexerConfig } from "../config.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Throttled outbound HTTP gate — simulates slow/human-like request pacing. */
export class RateLimiter {
  private lastRequestAt = 0;
  private cooldownUntil = 0;
  private inFlight = 0;

  get isInCooldown() {
    return Date.now() < this.cooldownUntil;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    if (now < this.cooldownUntil) {
      await sleep(this.cooldownUntil - now);
    }

    while (this.inFlight >= indexerConfig.maxConcurrentRequests) {
      await sleep(100);
    }

    const jitter = randomBetween(
      indexerConfig.requestMinDelayMs,
      indexerConfig.requestMaxDelayMs,
    );
    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < jitter) await sleep(jitter - elapsed);

    this.inFlight++;
    this.lastRequestAt = Date.now();
  }

  release() {
    this.inFlight = Math.max(0, this.inFlight - 1);
  }

  /** Call after 403/429 from upstream. */
  enterCooldown(extraMs?: number) {
    this.cooldownUntil =
      Date.now() + (extraMs ?? indexerConfig.rateLimitCooldownMs);
  }
}

export const globalRateLimiter = new RateLimiter();

export function retryDelayMs(attempt: number): number {
  return Math.pow(2, attempt) * 1000;
}
