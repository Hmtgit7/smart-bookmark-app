# @smart-bookmark/api

NestJS REST API backend for the Smart Bookmark monorepo.

---

## Local Development

```bash
# From monorepo root
pnpm dev --filter=@smart-bookmark/api

# Or from this directory
pnpm start:dev
```

The API starts on **http://localhost:4000**.

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check |
| — | `/api/docs` | Swagger UI (dev only) |

---

## Environment

Copy `.env.example` → `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 4000) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | JWT signing secret |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret (Settings → API) |
| `GROQ_API_KEY` | Groq AI API key |
| `WEB_URL` | Frontend origin for CORS |

---

## Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# e2e tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

---

## Project Layout

```
src/
├── common/
│   ├── filters/          # Global exception filter
│   └── interceptors/     # Logging interceptor
├── app.controller.ts     # Health check
├── app.module.ts         # Root module (Config + Throttler)
└── main.ts               # Bootstrap (helmet, CORS, Swagger, versioning)
```
