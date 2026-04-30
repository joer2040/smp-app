You are an expert TypeScript + Supabase engineer.

Task 20: Mark successfully inserted local records as synced.

Context:
- insertPendingCreates(formId) sends pending_create records to Supabase.
- Supabase insert now works.
- Local records remain pending_create after successful insert.
- We need to update local state only after Supabase confirms success.

Goal:
After a successful Supabase insert, mark local records as synced.

Requirements:

1. Update localStorage utility:

Add function:
- markRecordsAsSynced(formId: string, recordIds: string[]): void

Behavior:
- Find records for the given formId
- For records whose id is included in recordIds:
  - syncStatus = "synced"
  - syncError = null
  - updatedAt = new Date().toISOString()
- Save records back to localStorage

2. Update insertPendingCreates:

- Track successful insert IDs
- If insert succeeds:
  - add record.id to successful IDs
- If insert fails:
  - keep record unchanged
  - log error

3. After all inserts:
- call markRecordsAsSynced(formId, successfulIds)
- return successfulIds

4. Update UI:
- After clicking "Send Pending Creates":
  - refresh records list
  - Pending Sync count should decrease

5. Do NOT:
- implement update sync
- implement delete sync
- remove local records
- add new libraries

Acceptance criteria:
- pending_create records inserted successfully are marked synced locally.
- Failed inserts stay pending_create.
- Pending Sync count decreases after success.
- Supabase table still receives records correctly.