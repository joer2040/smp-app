You are an expert Next.js + Supabase Auth + PostgreSQL RLS engineer.

Task 26: Add authentication foundation and replace temporary POC RLS with auth-based policies.

Context:
- Supabase client is configured.
- public.records table exists.
- Temporary POC RLS policies currently allow anon/authenticated access.
- This is unsafe for production.
- We need authentication before multi-user support.

Goal:
Add basic Supabase Auth login/logout and prepare records access for authenticated users only.

Requirements:

1. Frontend Auth UI

Create basic auth pages:

apps/web/src/app/login/page.tsx

Features:
- email/password login
- email/password sign up if simple to add
- show errors clearly
- redirect to /forms/expense after successful login

2. Auth utilities

Create or update:

apps/web/src/lib/supabase/client.ts

Ensure Supabase browser client is reused safely.
Avoid creating multiple GoTrueClient instances unnecessarily.

3. Session UI

On /forms/expense:
- show current user email if logged in
- show logout button
- if not logged in, show link to /login

4. RLS migration

Create new migration:

supabase/migrations/YYYYMMDDHHMMSS_replace_poc_rls_with_auth_policies.sql

The migration must:

- Drop temporary POC policies:
  records_poc_select_anon_authenticated
  records_poc_insert_anon_authenticated
  records_poc_update_anon_authenticated

- Create auth-based policies:
  - authenticated users can select records
  - authenticated users can insert records
  - authenticated users can update records
  - no physical delete policy

5. Do NOT disable RLS.

6. Do NOT implement roles yet.

7. Do NOT implement company_id filtering yet.

8. Update record insert/update/delete sync functions:
- When inserting/updating records, set:
  created_by / updated_by when user id is available
- Keep working if user is not available, but Supabase should reject unauthenticated writes due to RLS.

9. Do NOT apply the migration automatically.

Acceptance criteria:
- User can sign up/login.
- Logged-in user sees their email.
- User can logout.
- Unauthenticated insert/update should fail after RLS migration is applied.
- Authenticated insert/update should succeed.
- Temporary POC policies are removed by migration.
- RLS remains enabled.