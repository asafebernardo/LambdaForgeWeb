# Lambda Forge — Stack de Tecnologias

Documento de referência das tecnologias definidas para o projeto. A fundação foi escolhida para escalar da Fase 1 à Fase 4 sem troca de arquitetura.

## Princípio arquitetural

```
Web ──┐
      ├──► API Central (única fonte de verdade) ──► PostgreSQL
Launcher ┘                              │
                                        ├── Redis
                                        ├── Object Storage (R2/S3)
                                        └── Meilisearch
```

**Regras que não mudam:**

1. Web e launcher só falam com a API — nunca com o banco diretamente
2. Arquivos (mods, imagens, instaladores) sempre em object storage
3. Tipos compartilhados em `packages/types`
4. API REST versionada desde o início (`/v1/...`)

---

## Stack por camada

| Camada | Tecnologia | Status |
|--------|------------|--------|
| Monorepo | Turborepo + pnpm + TypeScript | Implementado |
| Website | Next.js + Tailwind CSS | Implementado |
| Tipos compartilhados | `packages/types` | Implementado |
| SDK web | `packages/sdk` | Implementado |
| API central | NestJS + OpenAPI (REST `/v1`) | Implementado (Fase 1) |
| Banco de dados | PostgreSQL + Prisma | Implementado (Fase 1) |
| Cache / filas | Redis | Implementado (rate limit) |
| Arquivos | MinIO (dev) / Cloudflare R2 (prod) | Implementado (Fase 1) |
| Busca | Meilisearch | Implementado (Fase 1) |
| Autenticação | JWT na API (access + refresh) | Implementado (Fase 1) |
| CDN | Cloudflare | Planejado |
| Launcher desktop | Tauri 2 + Rust | Planejado (Fase 3) |
| Dev / CI | Docker Compose + GitHub Actions | Planejado |

---

## Website (implementado)

### Next.js (App Router)

- Rotas: landing (`/`), download (`/download`), catálogo de mods (`/mods`), jogos (`/games/[slug]`), detalhe do mod, upload, login, perfis de autor
- Server Components com ISR (`revalidate: 60`) para listagens
- Middleware para rotas protegidas (`/mods/upload`, edit)
- Integração via `@lambda-forge/sdk` — nunca acessa PostgreSQL diretamente

### Tailwind CSS

- Tema dark com acento dourado (inspiração Steam / Discord)
- Design responsivo e componentes reutilizáveis

### TypeScript

- Tipagem em todo o frontend
- Tipos de domínio em `@lambda-forge/types`

### Conteúdo atual

- Informações sobre o launcher e funcionalidades
- Jogos suportados (capas via Steam CDN)
- Downloads via manifesto local `public/data/downloads.json`

---

## API central (implementado — Fase 1)

**NestJS + TypeScript + OpenAPI** em `apps/api`, prefixo `/v1`.

Módulos:

- `auth` — register, login, refresh, logout (JWT em cookie httpOnly)
- `users` — perfil (`/me`) e perfil público por username
- `games` — lista dos 11 jogos suportados (seed)
- `mods` — CRUD, versões, publish, download, listagem com filtros
- `uploads` — presigned URLs (MinIO/S3)
- `ratings` / `comments` — nested em `/mods/:id/...`
- `search` — Meilisearch com fallback PostgreSQL ILIKE

---

## Banco de dados (implementado — Fase 1)

**PostgreSQL + Prisma** em `apps/api/prisma/schema.prisma`

Entidades principais: `users`, `mods`, `mod_versions`, `mod_files`, `comments`, `ratings`, `tags`, `categories`, `mod_dependencies`, `download_events`.

**Fase 4:** read replicas + PgBouncer.

---

## Cache e filas (planejado)

**Redis + BullMQ**

| Fase | Uso |
|------|-----|
| 1 | Cache de listagens, rate limit |
| 2 | Sessões, notificações, jobs em background |
| 3 | Sync com launcher, fila de atualizações |
| 4 | Cache distribuído, pub/sub |

---

## Armazenamento (planejado)

**Cloudflare R2** (compatível com S3)

- Mods, screenshots, vídeos
- Instaladores do launcher
- URLs assinadas para download seguro (Fase 3)

---

## Busca (planejado)

**Meilisearch** (Fases 1–3) → **OpenSearch** (Fase 4, se necessário)

Campos: nome, autor, categoria, tags, jogo, popularidade, data de atualização.

---

## Launcher (planejado — Fase 3)

**Tauri 2 + Rust + TypeScript (UI)**

Consome o mesmo SDK/API REST. Responsável por instalação local, backup, perfis e dependências — sem lógica de negócio própria.

---

## Infraestrutura

| Ambiente | Ferramentas |
|----------|-------------|
| Desenvolvimento | Docker Compose (web + api + postgres + redis + meilisearch) |
| Produção (início) | Vercel/Cloudflare Pages (web) + Railway/Render (API) |
| Produção (Fase 4) | Kubernetes ou ECS, CDN global, multi-região |
| CI/CD | GitHub Actions |
| Observabilidade | Sentry → OpenTelemetry + Grafana |

---

## Roadmap × tecnologias

| Fase | Entregas | Stack em uso |
|------|----------|--------------|
| **1** | Cadastro, mods, perfil, comentários, busca | Next.js + NestJS + PostgreSQL + R2 + Meilisearch |
| **2** | API pública, seguidores, notificações, stats | + Redis + BullMQ + OpenAPI v1 |
| **3** | Launcher, instalação 1-clique | + Tauri + URLs assinadas + SDK |
| **4** | Escala global, alto tráfego | + CDN agressivo + read replicas + workers + K8s |

---

## O que não usar como base definitiva

| Tecnologia | Motivo |
|------------|--------|
| HTML/CSS/JS puro | Não escala em features nem em equipe |
| APIs de terceiros no frontend | Mods devem vir da API própria quando implementada |
| SQLite | Insuficiente para produção |
| Acesso direto ao banco pelo frontend | Viola a arquitetura da API central |
| Firebase como backend principal | Limita API pública e launcher |

---

## Estrutura do monorepo

```text
LambdaForgeWeb/
├── apps/
│   └── web/                 # Next.js (website)
├── packages/
│   └── types/               # Tipos TypeScript compartilhados
├── docs/
│   ├── TECNOLOGIAS.md       # Este documento
│   └── VISAO_GERAL.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Evolução prevista:

```text
├── apps/
│   ├── web/
│   ├── api/                 # NestJS (Fase 1)
│   └── launcher/            # Tauri (Fase 3)
├── packages/
│   ├── types/
│   ├── ui/                  # Componentes compartilhados
│   └── sdk/                 # Cliente da API
```
