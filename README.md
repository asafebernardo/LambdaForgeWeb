# Lambda Forge Web

Mod platform and launcher website for indie and sandbox games.

## Stack

| Technology | Use |
|------------|-----|
| **Turborepo + pnpm** | Monorepo |
| **Vite + React 19** | Website SPA (`apps/web`) |
| **NestJS** | REST API (`apps/api`, `/v1`) |
| **PostgreSQL + Prisma** | Database (Supabase Postgres in production) |
| **Supabase Auth** | Accounts (web client + JWT on API) |
| **Redis** | Rate limiting / cache |
| **MinIO** | Object storage (dev S3) |
| **Meilisearch** | Mod search |
| `@lambda-forge/types` | Shared types |
| `@lambda-forge/sdk` | API client for web |

Full stack reference: [docs/TECNOLOGIAS.md](docs/TECNOLOGIAS.md)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Launcher landing + supported games |
| `/download` | Launcher installer download |
| `/mods` | Global mod catalog with filters |
| `/games/[slug]` | Mods for one game |
| `/mods/[slug]` | Mod detail, ratings, comments |
| `/mods/upload` | Upload flow (auth required) |
| `/login`, `/register` | Accounts |
| `/users/[username]` | Author profile |

## Development

### 1. Environment

```bash
cp .env.example .env
```

Configure Supabase keys — see [docs/SUPABASE.md](docs/SUPABASE.md).

### 2. Infrastructure (PostgreSQL, Redis, MinIO, Meilisearch)

```bash
pnpm dev:infra
```

### 3. Database

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
```

### 4. Run API + web

```bash
pnpm dev:all
```

- Web: [http://localhost:3000](http://localhost:3000) (Vite dev server)
- API: [http://localhost:4000/v1](http://localhost:4000/v1)
- API docs: [http://localhost:4000/v1/docs](http://localhost:4000/v1/docs)
- MinIO console: [http://localhost:9001](http://localhost:9001)

Or run services separately:

```bash
pnpm dev:infra
pnpm --filter api dev
pnpm --filter web dev
```

## Production

```bash
pnpm build
pnpm --filter api start
pnpm --filter web start
```

## Project structure

```text
apps/web/           # Next.js website
apps/api/           # NestJS API + Prisma
packages/types/     # Shared TypeScript types
packages/sdk/       # REST client
docker-compose.yml  # Local infra
docs/               # Architecture & roadmap
```

## Documentation

- [Technology stack](docs/TECNOLOGIAS.md)
- [Project vision](docs/VISAO_GERAL.md)

## License

TBD.
