You are an expert React + TypeScript engineer.

Task 08: Add basic local record editing.

Context:
- FormRenderer creates AppRecord objects.
- Records are stored in localStorage.
- Records are displayed in RecordsTable.
- No database or sync yet.

Goal:
Allow editing an existing local record.

Requirements:

1. Update localStorage utility:
   - Add updateRecord(record: AppRecord): void
   - It should replace the existing record with the same id for the same formId.

2. Update RecordsTable:
   - Add an "Edit" button per row.
   - Accept an optional prop:
     onEdit(record: AppRecord): void

3. Update FormRenderer:
   - Add editing state:
     editingRecord: AppRecord | null
   - When Edit is clicked:
     - Load record.values into the form
     - Set editingRecord
   - On submit:
     - If editingRecord exists:
       - Keep the same id
       - Keep createdAt
       - Update updatedAt
       - Set syncStatus to "pending_update"
       - Save using updateRecord
     - If no editingRecord:
       - Create a new record as before with syncStatus "pending_create"

4. After successful submit:
   - Refresh records list
   - Clear editingRecord
   - Reset form values

5. UI:
   - Change submit button label:
     - "Create Record" when creating
     - "Update Record" when editing
   - Show a small text when editing:
     "Editing record: <id>"

6. Do NOT add:
   - database
   - sync
   - external libraries

Acceptance criteria:
- User can create a record.
- User can click Edit.
- Form loads existing values.
- User can update values.
- Table updates after submit.
- Record id remains the same.
- syncStatus changes to pending_update.