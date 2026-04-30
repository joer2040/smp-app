You are an expert TypeScript backend + frontend architect.

Task 13: Define a sync contract between client and server.

Context:
- We have AppRecord with:
  id, formId, values, createdAt, updatedAt, syncStatus, isDeleted
- Sync is not yet implemented
- We need a clear contract before connecting to Supabase

Goal:
Define request and response types for synchronization.

Requirements:

1. Create file:

apps/web/src/types/sync.ts

2. Define types:

export type SyncRequest = {
  records: AppRecord[];
};

export type SyncSuccess = {
  id: string;
  status: "synced";
};

export type SyncError = {
  id: string;
  error: string;
};

export type SyncResponse = {
  success: SyncSuccess[];
  failed: SyncError[];
  serverTime: string;
};

3. Add comments explaining:

- why full AppRecord is sent
- how server decides create/update/delete
- what happens when a record fails

4. Do NOT:
- implement API calls
- connect to Supabase
- add external libraries

Acceptance criteria:
- Types are clean and reusable
- Comments explain sync logic clearly