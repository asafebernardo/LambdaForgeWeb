# Indexer — external mod catalog sync

Background workers that sync mods from GameBanana (and future sources) into PostgreSQL + Meilisearch. **User-facing API never calls external services.**

## Architecture

```
Site / Launcher  →  API /v1/catalog/*  →  PostgreSQL + Meilisearch
                                              ↑
                                         apps/indexer
                                              ↓
                                    GameBanana (slow, throttled)
```

## Setup

```bash
pnpm dev:infra
pnpm db:migrate
pnpm db:seed
pnpm indexer:seed    # SyncSource rows for GameBanana games
pnpm indexer:dev     # BullMQ workers + schedulers
```

## API (local only)

| Endpoint | Description |
|----------|-------------|
| `GET /v1/catalog/mods` | List indexed mods |
| `GET /v1/catalog/mods/search?q=` | Search (Meilisearch + PG fallback) |
| `GET /v1/catalog/mods/trending` | By priority score |
| `GET /v1/catalog/mods/recent` | By update time |
| `GET /v1/catalog/mods/:id` | Detail + download URLs (no file proxy) |
| `GET /v1/catalog/mods/sync/status` | Queue / sync observability |

Existing `GET /v1/mods` (platform uploads) is unchanged.

## Workers

- **metadata-sync** — paginated GameBanana game feeds
- **stale-refresh** — mods due by `nextSyncAt` / priority
- **popularity-update** — refresh stats, recompute priority
- **image-sync** — placeholder (URLs only in phase 1)

## Rate limiting

Configurable via `.env`: random delays, max 2 concurrent requests, cooldown on 403/429, exponential backoff on retries.

## Priority tiers

| Score | Re-sync interval |
|-------|------------------|
| ≥ 100 | ~1 hour |
| ≥ 20  | ~1 day |
| else  | ~1 week |

Weekly category rotation refreshes a slice of the catalog per weekday.
