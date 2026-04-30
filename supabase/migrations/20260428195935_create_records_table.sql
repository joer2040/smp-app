create table public.records (
  id uuid primary key,
  form_id text not null,
  -- Dynamic form definitions store their field payload here without needing
  -- one PostgreSQL column per form field.
  values jsonb not null default '{}'::jsonb,
  -- Offline-first clients use sync_status to decide what still needs upload,
  -- retry, or conflict handling.
  sync_status text not null default 'synced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null,
  updated_by uuid null,
  -- Logical deletion keeps tombstones available for future sync instead of
  -- physically removing records before every client has observed the delete.
  is_deleted boolean not null default false,
  deleted_at timestamptz null,
  deleted_by uuid null,
  sync_error text null,
  version integer not null default 1,
  constraint records_sync_status_check check (
    sync_status in (
      'pending_create',
      'pending_update',
      'pending_delete',
      'synced',
      'sync_error'
    )
  )
);
  
create index records_form_id_idx on public.records (form_id);
create index records_sync_status_idx on public.records (sync_status);
create index records_is_deleted_idx on public.records (is_deleted);
create index records_updated_at_idx on public.records (updated_at);

alter table public.records enable row level security;
