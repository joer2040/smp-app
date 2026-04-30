You are an expert TypeScript + frontend engineer.

Task 14: Simulate sync failures and persist sync errors.

Context:
- AppRecord has syncStatus.
- We already simulate successful sync by marking records as "synced".
- We need to simulate failed sync attempts before connecting to a real backend.

Goal:
Allow records to enter a "sync_error" state and keep the error visible.

Requirements:

1. Update AppRecord type:

Add optional field:
- syncError?: string | null

2. Update localStorage utility:

Add function:
- markRecordSyncError(record: AppRecord, error: string): void

Behavior:
- Find record by id and formId
- Update:
  - syncStatus = "sync_error"
  - syncError = error
  - updatedAt = new Date().toISOString()

3. Update RecordsTable:

Add column:
- Sync Error

Display:
- syncError if present
- empty value if not present

4. Update UI:

Add a button per row:
- "Simulate Sync Error"

When clicked:
- call markRecordSyncError(record, "Simulated sync failure")
- refresh records list

5. Do NOT:
- connect backend
- add libraries
- remove records

Acceptance criteria:
- User can mark a record as sync_error
- syncError is visible in the table
- Pending Sync count includes sync_error records
- Record remains available for future retry