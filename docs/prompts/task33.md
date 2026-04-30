You are an expert frontend engineer focused on UX for distributed systems.

Task 33: Add UI support to display conflict records clearly.

Context:
- Records can now have syncStatus = "conflict".
- Conflict occurs when version mismatch is detected.
- No conflict resolution is implemented yet.
- Users need to understand what happened.

Goal:
Make conflict records visible and understandable in the UI.

Requirements:

1. Update records table UI:

- Add visual distinction for conflict records:
  - different color (e.g. amber/red background)
  - or icon (⚠️)
  - or badge "Conflict"

2. Show additional info for conflict records:

- syncError (already available)
- remoteVersion
- local version (if available)

3. Add column (if not present):

"Sync Status"

4. Add optional filter or section:

- "Show conflicts only" toggle (optional but recommended)

5. UX clarity:

Display message like:

"Conflict detected: This record was modified elsewhere. Review required."

6. Do NOT:

- implement conflict resolution
- modify sync logic
- auto-merge values
- retry conflict records automatically

7. Keep:

- existing table structure
- existing sync buttons

Acceptance criteria:

- Conflict records are clearly visible in UI.
- User can distinguish them from sync_error.
- User sees reason (version conflict).
- UI does not crash.