You are an expert TypeScript + frontend architect.

Task 11: Implement a local "pending sync" selector.

Context:
- AppRecord has a syncStatus field
- Records are stored in localStorage
- We support:
  pending_create
  pending_update
  pending_delete
  synced
  sync_error

Goal:
Create a way to identify which records need to be synchronized.

Requirements:

1. Create utility:

apps/web/src/lib/sync/getPendingRecords.ts

Function:

getPendingRecords(formId?: string): AppRecord[]

Behavior:

- Load records from localStorage
- If formId is provided:
  - Filter by formId
- Return only records where:
  syncStatus !== "synced"

2. Optional utility:

getRecordsByStatus(status: SyncStatus): AppRecord[]

3. Update UI (FormRenderer or a simple section):

- Show a small section:

"Pending Sync: X records"

Where X = number of records with pending status

4. Do NOT:
- Connect to backend
- Implement actual sync
- Modify storage structure

Acceptance criteria:

- getPendingRecords returns only pending records
- UI shows correct count
- Count updates when creating, editing, deleting records