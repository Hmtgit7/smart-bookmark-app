// Prisma configuration — uses Supabase PostgreSQL as the database.
// DATABASE_URL : transaction-pooler URL (port 6543) — used for runtime queries.
// DIRECT_URL   : direct connection URL  (port 5432) — used for migrations.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: process.env['DATABASE_URL']!,
    },
});
