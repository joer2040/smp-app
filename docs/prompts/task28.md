You are an expert TypeScript + offline-first frontend engineer.

Task 28: Scope localStorage records by authenticated user.

Context:
- Backend RLS is now owner-based using created_by.
- Remote RLS passes.
- UI local storage currently leaks records between users in the same browser because it uses keys like:
  smp:forms:{formId}
- We need per-user local storage keys.

Goal:
Change local record storage to use user-scoped keys.

Target key format:
smp:forms:{userId}:{formId}

Requirements:

1. Update localStorage utility:

Current behavior:
- storage key is based only on formId

New behavior:
- storage key must be based on userId + formId

Update functions to require userId:

- saveRecord(userId: string, record: AppRecord): void
- getRecords(userId: string, formId: string): AppRecord[]
- updateRecord(userId: string, record: AppRecord): void
- markRecordDeleted(userId: string, record: AppRecord, deletedBy?: string | null): void
- markRecordsAsSynced(userId: string, formId: string, recordIds: string[]): void
- markRecordSyncError(userId: string, record: AppRecord, error: string): void
- markAllAsSynced(userId: string, formId?: string): void

2. Update pending sync utilities:

- getPendingRecords(userId: string, formId?: string): AppRecord[]
- getRecordsByStatus(userId: string, status: SyncStatus): AppRecord[]

3. Update sync functions:

- insertPendingCreates(userId: string, formId: string)
- syncPendingUpdates(userId: string, formId: string)
- syncPendingDeletes(userId: string, formId: string)
- syncAll(userId: string, formId: string)

4. Update FormRenderer:

- Obtain current authenticated user id from Supabase session or passed-in auth state.
- If user is not logged in:
  - Do not allow create/edit/delete/sync actions.
  - Show a clear message:
    "Please log in to manage records."
- If user is logged in:
  - Load and manage records using userId-scoped storage.

5. Migration of old localStorage:
- Do NOT migrate old keys automatically.
- Leave old keys untouched.
- New code should ignore old keys without userId.

6. Do NOT:
- change Supabase schema
- change RLS policies
- apply migrations
- add external libraries

Acceptance criteria:
- User A creates local record.
- Logout.
- User B logs in in same browser.
- User B does not see User A local records.
- User B creates own local record.
- Logout/login User A.
- User A still sees own local record.
- Sync still works for logged-in users.