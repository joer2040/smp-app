You are an expert Supabase + PostgreSQL engineer.

Task 19: Create temporary RLS policies for POC development.

Context:
- Table public.records exists.
- RLS is enabled.
- Frontend insert fails with:
  new row violates row-level security policy for table "records"
- This is a development POC.
- Auth and proper roles are not implemented yet.

Goal:
Create a migration that allows temporary client access to public.records for POC validation.

Requirements:

1. Create a new migration file in:
   supabase/migrations/

Name it with timestamp:
   YYYYMMDDHHMMSS_add_records_poc_rls_policies.sql

2. Add comments clearly stating:
   - These policies are temporary for POC only.
   - They must be replaced before production.
   - Proper auth-based policies will be implemented later.

3. Create policies for public.records:

- Allow select
- Allow insert
- Allow update

For roles:
- anon
- authenticated

4. Do NOT allow physical delete.

5. Do NOT disable RLS.

6. Do NOT modify frontend code.

7. Do NOT apply migration automatically.

Acceptance criteria:
- Migration file exists.
- RLS remains enabled.
- Select/insert/update are allowed for POC.
- Delete is not allowed.