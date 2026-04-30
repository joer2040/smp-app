You are an expert Supabase + PostgreSQL RLS engineer.

Task 27: Restrict records access to the owner using created_by.

Context:
- Authentication is already implemented.
- public.records table has:
  created_by uuid
- Current RLS policies allow all authenticated users to access all records.
- We need to restrict access so each user only sees their own records.

Goal:
Implement owner-based access control using created_by.

Requirements:

1. Create a new migration:

supabase/migrations/YYYYMMDDHHMMSS_records_owner_rls.sql

2. Drop previous auth policies:

- records_select_authenticated
- records_insert_authenticated
- records_update_authenticated

3. Create new policies:

SELECT:
- Allow only if:
  auth.uid() = created_by

INSERT:
- Allow only if:
  auth.uid() = created_by

UPDATE:
- Allow only if:
  auth.uid() = created_by

4. Use:

using (auth.uid() = created_by)
with check (auth.uid() = created_by)

5. Keep:
- RLS enabled
- No delete policy

6. Do NOT:
- modify table structure
- disable RLS
- add roles
- add company_id yet

7. Important:
- Ensure frontend always sets created_by on insert
- Otherwise inserts will fail

Acceptance criteria:

- User A inserts a record → visible to A
- User B logs in → cannot see A’s record
- User B cannot update A’s record
- User A can update/delete (logical) their own record