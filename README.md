# SMP App

SMP App is a business application scaffold based on `smp-offline-template`.

The current app keeps the template's offline-first core and starts from the sample expense form. Business-specific forms, branding, reports, rules, and catalogs should be added outside the core sync and persistence layer.

## Main Features

- Next.js App Router web app.
- Config-driven form rendering.
- Local persistence with IndexedDB.
- User-scoped local records.
- Supabase Auth login and session handling.
- Supabase PostgreSQL `records` table with RLS.
- Create, update, delete sync flows.
- Logical deletion with tombstones.
- Retry support through `syncAction`.
- Optimistic concurrency with `remoteVersion`.
- Conflict detection and manual resolution.
- Controlled background sync when connectivity returns.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- IndexedDB through `idb`
- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- pnpm workspaces

## Repository Layout

```text
apps/web/              Next.js application
apps/web/src/lib/db/   IndexedDB persistence
apps/web/src/lib/sync/ Sync engine
apps/web/src/forms/    Form renderer integration points
docs/                  Architecture, plan, task log, template strategy
packages/              Workspace package placeholders
supabase/migrations/   Database migrations
```

Important docs:

- `docs/PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/TASKS.md`
- `docs/TEMPLATE_STRATEGY.md`

## Local Setup

Install dependencies:

```powershell
pnpm.cmd install
```

Create a local env file:

```powershell
Copy-Item .env.example apps/web/.env.local
```

Fill in the Supabase values in `apps/web/.env.local`.

Run the app:

```powershell
pnpm.cmd dev
```

Open:

```text
http://localhost:3000/forms/expense
```

## Environment Variables

The web app expects:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use `.env.example` as the template. Do not commit `.env`, `.env.local`, or real Supabase secrets.

## Supabase Setup

1. Create a Supabase project.
2. Enable email/password auth if it is not already enabled.
3. Copy the project URL and anon key into `apps/web/.env.local`.
4. Link or configure the Supabase CLI for the project.
5. Apply migrations from `supabase/migrations`.

The migrations create the `public.records` table, indexes, RLS, and owner-based access policies.

## Migration Instructions

For a linked Supabase project:

```powershell
supabase db push
```

If using the local project script:

```powershell
pnpm.cmd supabase db push
```

Review migrations before applying them to a production database.

## Development Commands

```powershell
pnpm.cmd dev
pnpm.cmd typecheck
pnpm.cmd lint
pnpm.cmd build
```

## Business Customization Path

1. Create a new Supabase project for this business app.
2. Copy `.env.example` to `apps/web/.env.local` and fill in that project's Supabase values.
3. Apply the base migrations to the new Supabase project.
4. Validate auth, local IndexedDB persistence, sync, background sync, RLS, and conflict handling.
5. Replace or extend the sample expense form with the first real business form.
6. Add branding, reports, rules, catalogs, and project-specific modules outside the core sync layer.
7. Run `pnpm.cmd typecheck`, `pnpm.cmd lint`, and `pnpm.cmd build`.

Read `docs/TEMPLATE_STRATEGY.md` before modifying the core offline-first modules.
