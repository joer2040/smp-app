You are an expert Supabase + PostgreSQL engineer.

Task 16: Create an initial Supabase migration for the records table.

Context:
- The app stores AppRecord locally.
- We now need a remote PostgreSQL table to store synced records.
- Do NOT apply the migration automatically.
- Only create the migration SQL file.

Goal:
Create a versioned SQL migration for a flexible records table.

Requirements:

1. Create a new migration file in:

supabase/migrations/

Use a timestamped filename like:

YYYYMMDDHHMMSS_create_records_table.sql

2. The migration should create table:

public.records

Columns:

- id uuid primary key
- form_id text not null
- values jsonb not null default '{}'::jsonb
- sync_status text not null default 'synced'
- created_at timestamptz not null
- updated_at timestamptz not null
- created_by uuid null
- updated_by uuid null
- is_deleted boolean not null default false
- deleted_at timestamptz null
- deleted_by uuid null
- sync_error text null
- version integer not null default 1

3. Add check constraint for sync_status:

Allowed:
- pending_create
- pending_update
- pending_delete
- synced
- sync_error

4. Add useful indexes:

- form_id
- sync_status
- is_deleted
- updated_at

5. Enable Row Level Security:

alter table public.records enable row level security;

6. Add comments in the SQL explaining:
- values jsonb is used for dynamic form data
- logical deletion is used instead of physical deletion
- sync_status supports offline-first sync

7. Do NOT create policies yet.
8. Do NOT create auth logic.
9. Do NOT connect frontend to backend yet.

Acceptance criteria:
- Migration SQL file exists.
- SQL is valid PostgreSQL/Supabase.
- No frontend code changes.