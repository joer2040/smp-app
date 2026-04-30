You are an expert frontend + offline-first systems engineer.

Task 34: Add basic conflict resolution actions.

Context:
- Records can be in syncStatus = "conflict"
- remoteVersion is available
- No resolution exists yet
- UI already shows conflict records

Goal:
Allow user to resolve conflicts manually with two simple actions.

Requirements:

1. Update UI for conflict records:

Add buttons:

- "Use my version"
- "Use remote version"

2. Use my version:

Behavior:
- Take local record
- Retry update using:
  id = record.id
  version = remoteVersion (latest)
- If successful:
  - syncStatus = "synced"
  - syncAction = null
  - syncError = null
  - remoteVersion updated

3. Use remote version:

Behavior:
- Fetch remote record by id
- Replace local values with remote values
- Set:
  - syncStatus = "synced"
  - syncAction = null
  - syncError = null
  - remoteVersion = remote.version

4. Do NOT:

- auto-resolve conflicts
- merge fields
- modify backend schema

Acceptance criteria:

- Conflict record shows both buttons
- Use my version overwrites remote safely
- Use remote version discards local changes
- Record exits conflict state
- No crash