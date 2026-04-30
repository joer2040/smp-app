You are an expert TypeScript + Supabase engineer.

Task 22: Sync pending_delete records to Supabase using logical deletion.

Context:
- pending_create records can be inserted into Supabase.
- pending_update records can update Supabase rows.
- Local deletion is logical:
  - isDeleted = true
  - deletedAt is set
  - syncStatus = "pending_delete"
- We do NOT physically delete records.

Goal:
Sync local pending_delete records to Supabase by marking them deleted remotely.

Requirements:

1. Create file:

apps/web/src/lib/sync/deleteRecords.ts

Function:

async function syncPendingDeletes(formId: string): Promise<string[]>

Behavior:
- Get pending records for formId.
- Filter only:
  syncStatus === "pending_delete"

For each record:
- Update public.records where id = record.id
- Set:
  - is_deleted = true
  - deleted_at = record.deletedAt
  - deleted_by = record.deletedBy ?? null
  - updated_at = record.updatedAt
  - sync_error = null
  - sync_status = "synced"

2. After successful remote update:
- Mark local record as synced.
- Keep isDeleted = true locally.
- Clear syncError.
- Do not restore the record visually.

3. If update fails:
- Keep local record as pending_delete.
- Log error.
- Do not lose data.

4. Update UI:
- Add button:
  "Send Pending Deletes"

5. Do NOT:
- physically delete records
- implement full sync all-in-one
- add external libraries

Acceptance criteria:
- Create a record.
- Send pending creates.
- Delete the record locally.
- Confirm it becomes pending_delete locally.
- Click "Send Pending Deletes".
- Confirm Supabase row has is_deleted = true.
- Confirm local record isDeleted remains true and syncStatus becomes synced.
- Pending Sync count decreases.