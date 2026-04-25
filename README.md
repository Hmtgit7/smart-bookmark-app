# Smart Bookmark

A full-stack AI-powered bookmark manager — auto-tagging, private vaults, and a conversational chat interface.

**Live Demo:** [smart-bookmark-app-lilac-phi.vercel.app](https://smart-bookmark-app-lilac-phi.vercel.app)

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui |
| Backend | NestJS 11, Prisma 6, PostgreSQL |
| Auth | Supabase SSR |
| AI | Groq SDK (Llama 3.3 70B) |
| Monorepo | TurboRepo + pnpm workspaces |
| Deploy | Vercel (web) · Render (api + postgres) |

---

## Project Structure

```
smart-bookmark-app/
├── apps/
│   ├── web/          # Next.js frontend → Vercel
│   └── api/          # NestJS REST API → Render
├── packages/
│   ├── db/           # Prisma schema, migrations, generated client
│   └── shared/       # Shared TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **Docker** (optional, for local postgres + redis)

---

## Quick Start

```bash
# 1. Install all dependencies
pnpm install

# 2. Copy env files and fill in values
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 3. Start local postgres + redis (optional)
docker compose up -d postgres redis

# 4. Run database migrations
pnpm db:migrate

# 5. Start all apps in parallel
pnpm dev
```

- **Web**: http://localhost:3000
- **API**: http://localhost:4000/api/v1
- **Swagger**: http://localhost:4000/api/docs (dev only)

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check across all packages |
| `pnpm test` | Run all unit tests |
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:migrate` | Run pending Prisma migrations (dev) |
| `pnpm db:studio` | Open Prisma Studio |

---

## Docker

```bash
# Local development (postgres + redis + api + web)
docker compose up

# Production stack
docker compose -f docker-compose.prod.yml up -d
```

---

## Deployment

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `apps/web`
3. Set **Build Command** to `cd ../.. && pnpm turbo run build --filter=@smart-bookmark/web`
4. Add env vars from `apps/web/.env.local.example`

### Backend → Render

The `render.yaml` at the root is a [Render Blueprint](https://render.com/docs/infrastructure-as-code).
Push to `main` to trigger auto-deploy. Set env vars from `apps/api/.env.example` in the Render dashboard.

---

## Environment Variables

| Variable | App | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | web | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | web | Supabase anon/publishable key |
| `NEXT_PUBLIC_API_URL` | web | NestJS API base URL |
| `DATABASE_URL` | api | PostgreSQL connection string |
| `SUPABASE_JWT_SECRET` | api | From Supabase → Settings → API |
| `GROQ_API_KEY` | api | Groq AI API key |

---

## Contributing

1. Fork → create a branch with `feat/`, `fix/`, or `chore/` prefix
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/) format
3. Open a PR — CI runs lint, typecheck, and tests automatically

---

## Author

**Hemant Gehlod** · [GitHub @Hmtgit7](https://github.com/Hmtgit7) · [LinkedIn](https://www.linkedin.com/in/hemant-gehlod/)
