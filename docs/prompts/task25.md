You are an expert TypeScript + IndexedDB + offline-first engineer.

Task 25: Migrate local persistence from localStorage to IndexedDB using idb.

Context:
- Current storage is localStorage scoped by user:
  smp:forms:{userId}:{formId}
- Sync engine is already working.
- Auth, RLS, user-scoped storage and sync error handling are implemented.
- We want a real local database layer without changing app behavior.

Goal:
Replace localStorage persistence with IndexedDB using the idb library.

Requirements:

1. Install:
   idb

2. Create IndexedDB database:

Database name:
  smp-offline-db

Object store:
  records

Key:
  id

Indexes:
  userId
  formId
  syncStatus
  userId_formId if supported cleanly

3. Update storage layer:

Current API should remain conceptually the same:

- saveRecord(userId: string, record: AppRecord)
- getRecords(userId: string, formId: string)
- updateRecord(userId: string, record: AppRecord)
- markRecordDeleted(userId: string, record: AppRecord, deletedBy?: string | null)
- markRecordsAsSynced(userId: string, formId: string, recordIds: string[])
- markRecordSyncError(userId: string, record: AppRecord, error: string)
- markAllAsSynced(userId: string, formId?: string)

But these functions may become async.

4. Update all callers to await storage calls.

5. Keep user isolation:
- User A must not see User B records.

6. Migration:
- Do NOT automatically migrate old localStorage data.
- Leave old localStorage keys untouched.

7. Do NOT:
- change Supabase schema
- change RLS
- change sync behavior
- add unrelated features

8. UI behavior must remain the same:
- create
- edit
- logical delete
- show deleted toggle
- pending sync count
- sync all
- sync error retry

Acceptance criteria:
- App builds successfully.
- User can create records and refresh page; records persist.
- User A and User B local records remain isolated.
- Sync All still works.
- pending_create/update/delete/sync_error flows still work.
- No localStorage reads/writes are used for records anymore.