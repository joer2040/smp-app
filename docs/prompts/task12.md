You are an expert TypeScript + frontend engineer.

Task 12: Simulate synchronization by marking pending records as synced.

Context:
- AppRecord has syncStatus
- Records are stored in localStorage
- getPendingRecords exists
- No backend yet

Goal:
Simulate a sync process by updating records to "synced".

Requirements:

1. Update localStorage utility:

Add function:

markAllAsSynced(formId?: string): void

Behavior:

- Load records (all or by formId)
- For each record where:
  syncStatus !== "synced"
- Update:
  - syncStatus = "synced"
  - updatedAt = new Date().toISOString()

- Save updated records back to localStorage

2. Update UI (FormRenderer):

- Add a button:

"Sync Now"

- On click:
  - Call markAllAsSynced(form.id)
  - Refresh records list

3. UI behavior:

- Pending Sync count should go to 0
- Records remain visible
- syncStatus changes to "synced"

4. Do NOT:
- Connect to backend
- Remove records
- Add libraries

Acceptance criteria:

- Pending records count decreases to 0 after clicking Sync Now
- syncStatus becomes "synced"
- No runtime errors