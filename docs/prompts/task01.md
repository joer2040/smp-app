You are an expert software engineer.

Create a monorepo project using pnpm workspaces with the following structure:

root/
  apps/
    web/
  packages/
    ui/
    types/
    db/
    sync/
  supabase/
  docs/

Requirements:

1. Initialize pnpm workspace
2. Create a Next.js app inside apps/web with:
   - TypeScript
   - App Router
   - TailwindCSS
   - ESLint
3. Ensure project runs with:
   pnpm install
   pnpm dev

4. Create a simple homepage in apps/web that displays:

   "Offline-first POC running"

5. Do NOT implement:
   - authentication
   - database
   - synchronization
   - backend logic

6. Keep the structure clean and minimal.

7. Use best practices for folder structure.

8. Ensure compatibility with Windows environment.

9. Add necessary configuration files:
   - package.json (root with workspaces)
   - pnpm-workspace.yaml
   - tsconfig
   - tailwind config

Goal:

Have a working monorepo with a running Next.js app.

Output:

- Show the folder structure
- Show key files created
- Show commands to run the project