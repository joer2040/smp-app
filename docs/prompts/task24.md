You are an expert TypeScript + offline-first sync engineer.

Task 24: Add syncAction and retry sync_error records in Sync All.

Context:
- AppRecord has syncStatus and optional syncError.
- Records can fail and become sync_error.
- Currently sync_error does not tell us whether the failed action was create, update, or delete.
- syncAll already runs creates, updates, deletes.

Goal:
Track the intended sync action and allow Sync All to retry failed records correctly.

Requirements:

1. Update AppRecord type:

Add:

export type SyncAction = "create" | "update" | "delete" | null;

syncAction?: SyncAction;

2. When creating a new record:
- syncStatus = "pending_create"
- syncAction = "create"

3. When editing an existing record:
- syncStatus = "pending_update"
- syncAction = "update"

4. When logically deleting a record:
- syncStatus = "pending_delete"
- syncAction = "delete"

5. When marking a record as sync_error:
- Do NOT erase syncAction.
- Keep the original intended syncAction.

6. After successful sync:
- syncStatus = "synced"
- syncError = null
- syncAction = null

7. Update insert/update/delete sync functions:

They should include records where either:

Create:
- syncStatus === "pending_create"
OR
- syncStatus === "sync_error" AND syncAction === "create"

Update:
- syncStatus === "pending_update"
OR
- syncStatus === "sync_error" AND syncAction === "update"

Delete:
- syncStatus === "pending_delete"
OR
- syncStatus === "sync_error" AND syncAction === "delete"

8. Update Sync All:
- It should retry sync_error records according to syncAction.

9. Update RecordsTable:
- Add a column:
  Sync Action

10. Do NOT:
- implement background sync
- add timers
- add external libraries
- change Supabase schema unless strictly necessary

Acceptance criteria:
- New records show syncAction = create.
- Edited records show syncAction = update.
- Deleted records show syncAction = delete.
- Simulated sync_error keeps syncAction.
- Sync All retries sync_error correctly.
- After successful retry, syncStatus = synced and syncAction = null.