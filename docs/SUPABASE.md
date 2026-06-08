# Supabase setup (CapyMods)

Auth and optional file storage use [Supabase](https://supabase.com). The NestJS API still owns mods and games; Supabase replaces custom JWT + bcrypt.

## 1. Create a project

1. [supabase.com/dashboard](https://supabase.com/dashboard) → New project
2. Copy from **Project Settings → API**:
   - Project URL → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `anon` key → `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (API only, never expose to web)
   - JWT Secret → `SUPABASE_JWT_SECRET` (API token verification)

## 2. Database

**Project Settings → Database → Connection string**

Copie **duas** URIs para o `.env`:

| Modo no dashboard | Variável | Porta |
|-------------------|----------|-------|
| **Transaction pooler** | `DATABASE_URL` | 6543 |
| **Session pooler** | `DIRECT_URL` | 5432 |

Substitua `[YOUR-PASSWORD]` pela senha do banco (ou reset em **Database → Reset database password**).

```env
DATABASE_URL=postgresql://postgres.xxxxx:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Teste antes de migrar:

```bash
pnpm db:test
pnpm db:migrate
pnpm db:seed
```

### Erro `tenant/user postgres.xxxxx not found`

- Projeto **pausado** → Dashboard → **Restore project**
- **Senha** errada → reset no dashboard
- **URL** montada na mão → copie de novo do dashboard (região incluída no hostname)

## 3. Auth profiles (optional)

Run `supabase/migrations/001_profiles.sql` in the Supabase SQL Editor for RLS-backed `profiles` and signup trigger. The API auto-creates local `User` rows on first authenticated request.

## 4. Storage (optional)

1. Storage → New bucket `mods` (public if you want direct CDN URLs)
2. Set `STORAGE_DRIVER=supabase` and `SUPABASE_STORAGE_BUCKET=mods`
3. For local dev without Supabase Storage, use `STORAGE_DRIVER=s3` with MinIO (`pnpm dev:infra`)

## 5. Local `.env`

Copy `.env.example` and fill Supabase values. Web needs `VITE_SUPABASE_*`; API needs `SUPABASE_*` and `DATABASE_URL`.

## Auth flow

| Step | Where |
|------|--------|
| Sign up / sign in | Web → `@supabase/supabase-js` |
| Access token | Bearer header on `/v1/*` |
| Local profile | `POST /v1/auth/sync` (username on register) |
| Session refresh | Supabase client (localStorage) |

Legacy cookie JWT endpoints (`/auth/login`, `/auth/register`) were removed.
