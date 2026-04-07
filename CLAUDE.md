# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server
bun build        # Build for production
bun check        # Lint (Biome)
bun check:fix    # Lint with auto-fix
bun typecheck    # TypeScript type check
bun db:push      # Push schema changes to DB
bun studio       # Open Drizzle Studio
```

## Architecture

Next.js 16 (App Router) + Hono RPC + Drizzle ORM + Supabase (PostgreSQL).

### API layer (Hono RPC)

- `server/index.ts` — Hono app root. Exports `AppType` used for the typed client.
- `app/api/[...route]/route.ts` — Next.js catch-all that delegates to the Hono app via `hono/vercel`.
- `lib/client.ts` — `hc<AppType>` typed client, used in all client components.
- Routes live in `server/routes/<resource>/`. Each route file exports a `new Hono()` instance and is composed in `server/index.ts`.

### Typing API responses

Use `InferResponseType` from `hono/client` against the typed client:

```ts
import type { InferResponseType } from "hono/client";
import type { client } from "@/lib/client";

type MapListResponse = InferResponseType<typeof client.api.maps.$get>;
type MapItem = MapListResponse["items"][number];
```

Define types in the component file if used in one place only. Move to `lib/types.ts` when shared across multiple files.

### Database

- `db/client.ts` — exports `db` (Drizzle instance), `schema`, `DBType`, `TXType`.
- Schema files live in `db/schema/` and are re-exported from `db/schema.ts`.
- Always import DB via `import { db, schema } from "@/db/client"`.

### Pagination

`server/pagination.ts` exports `useScrollPagination` — cursor-based scroll pagination helper used in route handlers. Returns `{ limit, offset, buildPageResult }`.

### Shared query logic

`server/lib/<resource>.ts` — reusable Drizzle query fragments (e.g. correlated subqueries) shared across routes for the same resource.

### Environment variables

Validated via `@t3-oss/env-nextjs` in `env.ts`. Always import env vars from `@/env`, never from `process.env` directly (enforced by Biome).

## Conventions

- **Linter**: Biome with `lineWidth: 120`, `indentStyle: space`. No ESLint.
- **Filenames**: kebab-case (enforced by Biome).
- **No enums**: use `as const` objects instead (Biome `noEnum` rule).
- **No CommonJS**: ESM only (`noCommonJs` rule).
- **Tailwind class sorting**: handled automatically by Biome `useSortedClasses` for `twMerge`, `twJoin`, `tv`.
- **UI components**: shadcn/ui in `components/ui/`.
