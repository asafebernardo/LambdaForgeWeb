# Lambda Forge Web

React SPA for the Lambda Forge mod platform and launcher website.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router** — client-side routing
- **Tailwind CSS 4**
- `@lambda-forge/sdk` — API client
- `@lambda-forge/types` — shared types

## Development

```bash
pnpm install
pnpm dev
```

Runs at [http://localhost:3000](http://localhost:3000).

Set `VITE_API_URL` in `.env` (see root `.env.example`).

## Production

```bash
pnpm build
pnpm preview
```

Output in `dist/`.
