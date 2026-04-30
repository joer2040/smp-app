You are an expert Supabase + TypeScript engineer.

Task 29: Treat zero affected rows as sync failure for update/delete.

Context:
- RLS is owner-based using created_by.
- User-scoped localStorage is implemented.
- Supabase may return no error but affect 0 rows when RLS prevents update.
- syncPendingUpdates and syncPendingDeletes currently may treat that as success.

Goal:
Ensure update/delete sync only succeeds when the target remote row was actually updated.

Requirements:

1. Update syncPendingUpdates:

When updating public.records:
- Use a Supabase query that returns the updated row or at least its id.
- Example:
  .update(...)
  .eq("id", record.id)
  .select("id")
  .single()

Behavior:
- If error exists:
  - keep local record pending_update or sync_error according to existing error handling
- If no row is returned:
  - treat as sync failure
  - mark record as sync_error
  - syncError should explain:
    "Remote update affected 0 rows. Record may not exist or access is denied."

2. Update syncPendingDeletes similarly:

- Use:
  .update(...)
  .eq("id", record.id)
  .select("id")
  .single()

- If no row is returned:
  - mark sync_error
  - syncError:
    "Remote delete affected 0 rows. Record may not exist or access is denied."

3. Do NOT:
- change RLS policies
- change Supabase schema
- change localStorage key format
- add external libraries

4. Update UI only if needed to show existing syncError.

Acceptance criteria:

- Updating own record still syncs successfully.
- Deleting own record still syncs successfully.
- Attempting to sync an update/delete for a record not accessible remotely results in sync_error.
- syncError is visible in the table.
- Pending Sync count includes the sync_error record.