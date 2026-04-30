You are an expert software engineer working in an existing pnpm monorepo.

Task 02: Prepare the base module structure without implementing business logic.

Context:
- The project is an offline-first web app.
- The Next.js app already exists in apps/web.
- Do not add database, auth, sync, or backend logic yet.
- Keep everything minimal and clean.

Create or verify the following structure:

apps/web/
  src/
    app/
    components/
      layout/
      forms/
      tables/
    lib/
      config/
      forms/
      reports/
      sync/
      db/
    hooks/
    types/

packages/
  ui/
    src/
  types/
    src/
  db/
    src/
  sync/
    src/

Requirements:
1. Add index.ts files where useful.
2. Add placeholder README.md files for packages/ui, packages/types, packages/db, packages/sync.
3. Do not introduce unnecessary dependencies.
4. Do not implement real functionality.
5. Ensure the app still runs with pnpm dev.
6. Update docs/TASKS.md marking Task 02 as completed or add a Task 02 entry if missing.

Acceptance criteria:
- Folder structure exists.
- No runtime errors.
- Homepage still shows: "Offline-first POC running".
- pnpm dev works.