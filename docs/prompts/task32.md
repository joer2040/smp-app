You are an expert TypeScript + Supabase + distributed systems engineer.

Task 32: Detect version conflicts and introduce a "conflict" sync state.

Context:
- The system currently uses Last Write Wins implicitly.
- There is a `version` column in Supabase.
- Updates do not enforce version matching yet.
- sync_error is used for technical failures, not data conflicts.
- We want to detect conflicts without resolving them yet.

Goal:
Prevent silent overwrites by detecting version conflicts and marking records as "conflict".

Requirements:

1. Update AppRecord type:

Add:
- remoteVersion?: number | null

Update SyncStatus:
- Add new value: "conflict"

2. Update syncPendingUpdates:

Replace update logic:

- Use optimistic concurrency:

  update records
  where:
    id = record.id
    AND version = record.remoteVersion

- Increment version on successful update:
  version = version + 1

3. After update attempt:

If update succeeds:
- Mark local record as synced
- Update local remoteVersion

If update affects 0 rows:
- Perform SELECT by id

Cases:

A) No record found:
  → treat as sync_error ("not_found")

B) Record exists but created_by != user:
  → treat as sync_error ("forbidden")

C) Record exists and created_by matches:
  → treat as conflict

4. On conflict:

- Set:
  syncStatus = "conflict"
  syncError = "Version conflict detected"
  remoteVersion = remote.version (from SELECT)

- Do NOT overwrite remote data

5. Update Sync All:

- Do NOT retry conflict records automatically

6. Update UI:

- Display conflict status
- Show syncError message
- (no resolution UI yet)

7. Do NOT:
- implement conflict resolution
- auto-merge data
- change delete or create flows
- modify Supabase schema beyond version usage

Acceptance criteria:

- Device A updates record (version 1 → 2)
- Device B updates same record from version 1
- B sync detects conflict (not sync_error)
- B does NOT overwrite A
- B record is marked as conflict
- Sync All does not retry conflict automatically