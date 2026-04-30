# SMP Offline-First Architecture

## 1. Overview

SMP is an offline-first web application built around local-first data entry and later synchronization with Supabase.

Supabase is the source of truth for synced records. IndexedDB is a local replica scoped by authenticated user and form. The browser can accept writes before the network round trip completes, so users can create, edit, logically delete, review, and retry records from local state.

The system follows an eventual consistency model. Local and remote state may diverge temporarily while records are pending sync. Sync actions reconcile the local replica with Supabase.

The current implementation focuses on a dynamic form record model. Form values are stored as flexible JSON payloads locally and remotely, so new form definitions do not require one database column per form field.

## 2. Data Model

The main client-side record type is `AppRecord`.

Core fields:

- `id`: UUID used as the stable local and remote primary identifier.
- `formId`: identifies which form definition owns the record, for example `expense`.
- `values`: dynamic form payload stored as key/value data. Values may be strings, numbers, booleans, or null.
- `syncStatus`: current sync state for the record.
- `syncAction`: operation intent used when retrying a record in `sync_error`.
- `createdAt`: local creation timestamp.
- `updatedAt`: local update timestamp.
- `isDeleted`: logical deletion flag.
- `deletedAt`: timestamp for logical deletion.
- `deletedBy`: user id that marked the record deleted.
- `syncError`: last sync error message, when any.

Remote Supabase metadata uses snake_case equivalents:

- `form_id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `is_deleted`
- `deleted_at`
- `deleted_by`
- `sync_status`
- `sync_error`

`created_by` is the backend ownership field used by RLS. `updated_by` tracks the authenticated user that last synced an update.

## 3. Local Storage (IndexedDB)

Local persistence uses IndexedDB through the `idb` library.

Database:

- Name: `smp-offline-db`
- Version: `1`

Object store:

- Store: `records`
- Key path: `id`

Indexes:

- `userId`
- `formId`
- `syncStatus`
- `userId_formId`

Each stored IndexedDB row is an `AppRecord` plus a local `userId` field. The `userId_formId` compound index reads records for one authenticated user and one form without scanning unrelated local rows.

Old `localStorage` keys are not migrated automatically. Existing keys such as `smp:forms:{userId}:{formId}` are left untouched, and record persistence no longer reads from or writes to those keys.

## 4. Consistency Model

SMP follows an eventual consistency model between IndexedDB (local) and Supabase (remote).

Supabase is the source of truth. IndexedDB acts as a local replica that may temporarily diverge while the client is offline or during sync operations.

Local writes are accepted immediately and reflected in the UI. Each write assigns a sync state that indicates pending reconciliation with the remote system.

Sync acts as a reconciliation process. It reads local records with pending states, executes the corresponding remote operation, and updates local metadata based on the result.

Temporary divergence is expected and explicitly modeled:

- Local has a `pending_create` record that does not yet exist in Supabase.
- Local has a `pending_update` while Supabase still holds the previous version.
- Local has a `pending_delete` tombstone while Supabase still shows the record as active.
- Local has `sync_error` when the last reconciliation attempt failed.

The system guarantees eventual convergence, not immediate consistency. Once synchronization succeeds, local and remote states become aligned.

The system does not perform automatic background reconciliation. Users explicitly trigger synchronization via UI actions such as `Sync All`.

## 5. Sync Engine

The sync engine uses `syncStatus` to decide which records need remote work.

Statuses:

- `pending_create`: local record exists and still needs insertion into Supabase.
- `pending_update`: local record has changes that need to update the remote row.
- `pending_delete`: local record is logically deleted locally and needs a remote logical delete.
- `sync_error`: the previous sync attempt failed. `syncAction` decides which operation to retry.
- `conflict`: a version mismatch was detected during update sync. The remote row was not overwritten.
- `synced`: local record is considered aligned with Supabase.

Normal flows:

- Create -> `pending_create` -> `synced`
- Update -> `pending_update` -> `synced`
- Delete -> `pending_delete` -> `synced`

Deletion is logical. A deleted record remains in local storage and Supabase with `isDeleted = true` so future sync logic can keep tombstones available.

### Logical Deletion

Logical deletion creates a tombstone. A tombstone is a durable marker that says a record existed and was deleted.

Physical delete is unsafe as the default offline-first behavior because it can remove the only evidence that a delete happened before another offline client has reconciled. With tombstones, later sync cycles can still observe deletion metadata and converge.

## 6. Sync Process

The sync process is implemented in focused helpers.

`insertPendingCreates(userId, formId)`:

- Loads pending local records for the user and form.
- Selects records with `pending_create`.
- Also retries `sync_error` records whose `syncAction` is `create`.
- Inserts rows into `public.records`.
- Marks successfully inserted local records as `synced`.

`syncPendingUpdates(userId, formId)`:

- Loads pending local records for the user and form.
- Selects records with `pending_update`.
- Also retries `sync_error` records whose `syncAction` is `update`.
- Updates `public.records` by `id`.
- Requires Supabase to return the updated row id.
- Marks successful records as `synced`.

`syncPendingDeletes(userId, formId)`:

- Loads pending local records for the user and form.
- Selects records with `pending_delete`.
- Also retries `sync_error` records whose `syncAction` is `delete`.
- Updates the remote row to `is_deleted = true`.
- Requires Supabase to return the updated row id.
- Marks successful records as `synced`.

`syncAll(userId, formId)` runs the full sync sequence:

1. Create
2. Update
3. Delete

This order matters because later operations can depend on earlier remote state.

Creates run first so a locally created record exists remotely before any later update or delete for the same record is attempted. Updates run before deletes so the final local state is applied before the record becomes a remote tombstone. Deletes run last because a logical delete is the terminal operation for the current record lifecycle.

The current implementation processes each operation type sequentially and marks only successful records as `synced`.

### Background Sync

The browser app includes a controlled background sync hook, `useBackgroundSync`.

The hook listens for browser connectivity events:

- `online`
- `offline`

When the browser fires `online`, the hook waits 500ms before doing work. This avoids immediately syncing during unstable network recovery. After the delay, it checks:

- The user is authenticated.
- The browser is still online.
- The form has pending records with `pending_create`, `pending_update`, `pending_delete`, or `sync_error`.
- A background sync is not already running.

If those conditions pass, the hook calls `syncAll(userId, formId)` and refreshes local records after completion.

The hook does not use intervals, polling, or repeated retry loops. It also does not automatically retry `conflict` records, because conflicts require an explicit user decision.

The UI exposes a small background sync status:

- `Syncing...`
- `Synced`
- `Sync failed`

### Retry Strategy

Retries are driven by `syncAction`.

When a record enters `sync_error`, `syncStatus` only says that the last attempt failed. It does not say which remote operation should be retried. `syncAction` preserves that intent:

- `create` means retry an insert.
- `update` means retry an update.
- `delete` means retry a logical delete.

This makes retries deterministic. Without `syncAction`, retry behavior would be ambiguous. The app would need to infer intent from other fields such as `isDeleted`, record existence, or timestamps, which is unreliable across offline sessions.

## 7. Error Handling

Sync failures do not remove local data.

For create failures, the local record remains pending or in `sync_error` according to its current retry path. The UI can retry via `Sync All`.

There are two important failure classes:

- Request errors: Supabase returns an error object, for example network, validation, auth, or database errors.
- Zero affected rows: the request completes but no row is returned by `.select("id").single()`.

Zero affected rows is handled as a sync failure for update and delete. It can mean the record does not exist remotely, or RLS made the target row invisible or non-updatable for the current user. Treating this as success would silently mark local data as synced even though Supabase did not change.

Zero-row update error:

`Remote update affected 0 rows. Record may not exist or access is denied.`

Zero-row delete error:

`Remote delete affected 0 rows. Record may not exist or access is denied.`

After a successful sync, the local record is marked:

- `syncStatus = "synced"`
- `syncAction = null`
- `syncError = null`

## 8. Backend (Supabase)

Remote records are stored in `public.records`.

Important columns:

- `id uuid primary key`
- `form_id text not null`
- `values jsonb not null default '{}'::jsonb`
- `sync_status text not null default 'synced'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by uuid null`
- `updated_by uuid null`
- `is_deleted boolean not null default false`
- `deleted_at timestamptz null`
- `deleted_by uuid null`
- `sync_error text null`
- `version integer not null default 1`

The `values` column stores dynamic form data as `jsonb`. This keeps form definitions flexible without requiring a schema migration for every new field.

The `version` field is used for optimistic concurrency during update sync. A local record stores `remoteVersion`, and updates only succeed when the remote `version` still matches that local value.

Indexes currently exist for:

- `form_id`
- `sync_status`
- `is_deleted`
- `updated_at`

## 9. Security

Authentication uses Supabase Auth.

Remote access is protected with Supabase RLS. The owner-based policies use `created_by` as the ownership column.

Current ownership rule:

`auth.uid() = created_by`

Policies allow authenticated users to:

- Select only their own records.
- Insert only records whose `created_by` matches their auth uid.
- Update only records whose `created_by` matches their auth uid.

There is no physical delete policy. Deletes are logical because offline-first systems need tombstones. A physical delete can remove evidence before every client has observed the deletion.

`created_by` is a simplified ownership model. It is appropriate for the current single-user ownership POC, but it is not a complete authorization model for organizations.

Expected future evolution:

- Add `company_id` or tenant ownership for multi-tenant access.
- Add user roles and permissions.
- Separate record ownership from operational privileges.
- Enforce tenant and role checks in RLS policies.

## 10. User Isolation

SMP enforces user isolation in two places.

Frontend:

- IndexedDB stores `userId` on every local record.
- Reads use the `userId_formId` index.
- User A and User B can share the same browser without seeing each other's local records in the UI.

Backend:

- Supabase Auth identifies the user.
- RLS checks `auth.uid() = created_by`.
- A user cannot select or update records owned by another user.

This means local isolation protects same-browser state, while RLS protects remote data.

## 11. Conflict Handling (Current Behavior)

The system detects update conflicts and supports two manual resolution actions.

Updates use optimistic concurrency with the remote `version` column. A local record stores `remoteVersion`, then `syncPendingUpdates` updates the remote row only when both conditions match:

- `id = record.id`
- `version = record.remoteVersion`

When the update succeeds, the remote version is incremented and the local `remoteVersion` is updated. When the update affects 0 rows, the client reads the remote row by id.

Outcomes:

- No visible remote row: mark the local record as `sync_error`.
- Remote row belongs to another user: mark the local record as `sync_error`.
- Remote row belongs to the same user but has a different version: mark the local record as `conflict`.

Conflict state:

- `syncStatus = "conflict"`
- `syncError = "Version conflict detected"`
- `remoteVersion = remote.version`

`Sync All` does not retry `conflict` records automatically. A conflict is a data consistency condition, not a technical retry failure.

Manual resolution:

- `Use my version`: updates the remote row with the local values using the current `remoteVersion` as the optimistic concurrency guard. On success, the local record becomes `synced`, `syncAction` and `syncError` are cleared, and `remoteVersion` is updated.
- `Use remote version`: fetches the remote row by id, replaces the local `values` with the remote `values`, then marks the local record as `synced` and clears `syncAction` and `syncError`.

Current implications:

- Conflicts are detected for updates.
- Conflict resolution is manual and explicit.
- Remote data is not overwritten when a stale version is detected during normal sync.
- Users can choose either local-wins or remote-wins for a conflict.
- Creates and deletes do not participate in version conflict detection yet.

## 12. Known Limitations

- Background sync only runs on browser connectivity changes. There is no interval-based polling or service worker sync yet.
- No automatic or field-level conflict merge yet. Update conflicts are resolved only through explicit local-wins or remote-wins actions.
- No multi-tenant or company ownership model yet. Ownership is currently per authenticated user.
- No automatic migration from old `localStorage` record keys to IndexedDB.
- No server-side sync API yet. The browser client writes directly to Supabase.

## 13. Future Improvements

- Broader conflict detection for delete flows when needed.
- Conflict resolution strategies such as manual merge, field-level merge, or richer review workflows.
- Background sync when the browser returns online.
- Multi-tenant access using `company_id` plus role-based policies.
- Idempotent sync operations so repeated retries are safe across refreshes, network failures, and duplicate submissions.
- Server-side sync endpoints for stronger validation and centralized reconciliation rules.
