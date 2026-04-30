You are an expert frontend engineer specializing in offline-first systems.

Task 35: Add controlled background sync triggered by connectivity changes.

Context:
- syncAll(userId, formId) already exists
- Auth is implemented
- IndexedDB storage is implemented
- Conflict detection and resolution exist
- No background sync yet

Goal:
Trigger Sync All automatically when the app regains connectivity.

Requirements:

1. Detect connectivity:

Use browser events:
- window.addEventListener("online", ...)
- window.addEventListener("offline", ...)

2. Implement a hook:

apps/web/src/hooks/useBackgroundSync.ts

Behavior:

- When app mounts:
  - subscribe to online event

- When "online" fires:
  - check:
    - user is authenticated
    - there are pending records (pending_create/update/delete/sync_error)

- If conditions met:
  - run syncAll(userId, formId)

3. Prevent duplicate runs:

- Use a flag:
  isSyncing

- If already syncing:
  do nothing

4. Add small delay:

- After "online", wait ~500ms before syncing
  to avoid immediate network instability

5. UI feedback:

- Add state:
  backgroundSyncStatus:

  "idle"
  "syncing"
  "synced"
  "error"

- Display small indicator:

Examples:
"Syncing..."
"Synced"
"Sync failed"

6. Integrate hook:

Use it in FormRenderer or page level

7. Do NOT:

- run sync repeatedly in loops
- add intervals
- sync while offline
- retry conflicts automatically
- override manual sync button

8. Acceptance criteria:

- Turn off internet
- Create/edit records
- Turn internet back on
- Sync runs automatically once
- Pending count decreases
- UI shows syncing status
- No infinite loops