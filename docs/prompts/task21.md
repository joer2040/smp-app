You are an expert TypeScript + Supabase engineer.

Task 21: Sync pending_update records to Supabase.

Context:
- pending_create records can be inserted into Supabase.
- Successfully inserted records are marked as synced locally.
- Records can be edited locally and become pending_update.
- We need to send those updates to Supabase.

Goal:
Update Supabase records for local records with syncStatus = "pending_update".

Requirements:

1. Create or update sync utility:

apps/web/src/lib/sync/updateRecords.ts

Function:

async function syncPendingUpdates(formId: string): Promise<string[]>

Behavior:
- Get pending records for formId.
- Filter only:
  syncStatus === "pending_update"

For each record:
- Update public.records where id = record.id
- Update fields:
  - values
  - updated_at
  - updated_by
  - is_deleted
  - deleted_at
  - deleted_by
  - sync_error = null
  - sync_status = "synced"
  - version = version + 1 if currently available locally, otherwise leave out

2. After successful update:
- Mark local record as synced.
- Clear syncError.
- Update updatedAt only if needed.

3. If update fails:
- Keep local record as pending_update.
- Log error.
- Do not lose data.

4. Update UI:
- Add button:
  "Send Pending Updates"

5. Do NOT:
- implement delete sync
- implement conflict resolution
- add external libraries

Acceptance criteria:
- Edit a previously synced record locally.
- syncStatus becomes pending_update.
- Click "Send Pending Updates".
- Supabase row updates correctly.
- Local record becomes synced.
- Pending Sync count decreases.