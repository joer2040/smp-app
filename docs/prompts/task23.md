You are an expert TypeScript + Supabase engineer.

Task 23: Add a unified Sync All action.

Context:
- We already have separate sync functions:
  - insertPendingCreates(formId)
  - syncPendingUpdates(formId)
  - syncPendingDeletes(formId)
- Each function works independently.
- We want one unified action for the user.

Goal:
Create a single "Sync All" action that syncs creates, updates, and deletes in a safe order.

Requirements:

1. Create file:

apps/web/src/lib/sync/syncAll.ts

Function:

async function syncAll(formId: string): Promise<{
  created: string[];
  updated: string[];
  deleted: string[];
}>

2. Execution order:

- First: insertPendingCreates(formId)
- Second: syncPendingUpdates(formId)
- Third: syncPendingDeletes(formId)

3. Reason:
- Creates must happen before updates/deletes to avoid updating/deleting records that do not exist remotely yet.

4. Update exports in:
   apps/web/src/lib/sync/index.ts

5. Update UI:

- Add button:
  "Sync All"

- On click:
  - call syncAll(form.id)
  - refresh records list
  - refresh pending sync count

6. Keep existing individual buttons for now.

7. Do NOT:
- remove existing functions
- add backend logic
- add external libraries
- implement conflict resolution

Acceptance criteria:
- Create a record, edit another, delete another.
- Click "Sync All".
- pending_create records are inserted.
- pending_update records are updated.
- pending_delete records are logically deleted remotely.
- Pending Sync count decreases.
- App does not crash if one category has no records.