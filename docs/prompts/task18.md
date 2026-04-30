You are an expert Next.js + Supabase engineer.

Task 18: Insert pending_create records into Supabase.

Context:
- Supabase client is configured
- Table public.records exists
- AppRecord is defined
- Records are stored locally
- getPendingRecords exists
- No full sync yet

Goal:
Send only pending_create records to Supabase and confirm insertion.

Requirements:

1. Create file:

apps/web/src/lib/sync/insertRecords.ts

2. Implement function:

async function insertPendingCreates(formId: string)

Behavior:

- Get pending records:
  const pending = getPendingRecords(formId)

- Filter:
  only records where syncStatus === "pending_create"

- For each record:
  insert into Supabase:

  table: records

  map fields:

  id → id
  form_id → formId
  values → values
  sync_status → "synced"
  created_at → createdAt
  updated_at → updatedAt
  is_deleted → isDeleted
  deleted_at → deletedAt
  sync_error → null

3. Handle errors:
- If insert fails:
  log error
  do not modify local record

4. Return inserted record IDs

5. Update UI:

- Add button:
  "Send Pending Creates"

- On click:
  call insertPendingCreates(form.id)

6. Do NOT:
- update local syncStatus yet
- implement full sync
- send updates or deletes
- add libraries

Acceptance criteria:

- Only pending_create records are sent
- Records appear in Supabase table
- No crash if insert fails