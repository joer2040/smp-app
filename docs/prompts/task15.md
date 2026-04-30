You are an expert Next.js + Supabase engineer.

Task 15: Add Supabase client configuration.

Context:
- Supabase Cloud project exists.
- Environment variables are already configured in apps/web/.env.local:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- Do NOT implement sync yet.

Goal:
Create a Supabase browser client and verify connection setup.

Requirements:

1. Install Supabase client if missing:
   @supabase/supabase-js

2. Create file:
   apps/web/src/lib/supabase/client.ts

3. Export a browser client using:
   createClient

4. Validate env vars:
   - Throw a clear error if missing

5. Add a simple test section in the app, preferably on /forms/expense:
   - Show "Supabase client configured" if env vars exist
   - Do NOT query database yet

6. Do NOT:
   - create tables
   - implement auth
   - implement sync
   - send records

Acceptance criteria:
- pnpm dev works
- App does not crash
- Page shows "Supabase client configured"