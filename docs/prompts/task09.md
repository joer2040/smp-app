You are an expert React + TypeScript engineer.

Task 09: Add local logical deletion for records.

Context:
- AppRecord exists.
- Records are stored in localStorage.
- Records can be created and edited.
- We need logical deletion before future sync.

Goal:
Allow deleting a record by marking it as deleted, not removing it physically.

Requirements:

1. Update AppRecord type in:
   apps/web/src/types/records.ts

Add optional fields:

- isDeleted?: boolean
- deletedAt?: string | null
- deletedBy?: string | null

2. Update localStorage utility:

Add function:
- markRecordDeleted(record: AppRecord): void

Behavior:
- Find record by id and formId
- Update:
  - isDeleted = true
  - deletedAt = new Date().toISOString()
  - updatedAt = new Date().toISOString()
  - syncStatus = "pending_delete"

Do not physically remove the record from localStorage.

3. Update RecordsTable:

- Add a "Delete" button per row
- Accept optional prop:
  onDelete(record: AppRecord): void

4. Update FormRenderer:

- Add handler for delete
- Call markRecordDeleted
- Refresh records after deletion

5. Display behavior:

- By default, RecordsTable should only show records where isDeleted is not true.
- Deleted records should remain in localStorage.

6. Do NOT add:
- database
- backend
- sync
- external libraries

Acceptance criteria:
- User can delete a record from the table.
- Record disappears from visible table.
- Record still exists in localStorage.
- Deleted record has:
  - isDeleted: true
  - syncStatus: pending_delete
  - deletedAt set
  - updatedAt changed