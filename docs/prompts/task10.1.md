You are an expert React + TypeScript engineer.

Task 10: Add a toggle to show or hide logically deleted records.

Context:
- Records can be logically deleted.
- Deleted records remain in localStorage with:
  - isDeleted: true
  - syncStatus: "pending_delete"
- Currently deleted records are hidden from the table by default.

Goal:
Allow the user to optionally view deleted records.

Requirements:

1. Update FormRenderer:
   - Add state:
     showDeleted: boolean
   - Add a checkbox or toggle labeled:
     "Show deleted records"

2. Update RecordsTable:
   - Accept prop:
     showDeleted?: boolean
   - If showDeleted is false:
     - Display only records where isDeleted is not true
   - If showDeleted is true:
     - Display all records

3. Visual indication:
   - Deleted records should be clearly marked.
   - Add a column:
     "Deleted"
   - Show "Yes" if isDeleted is true, otherwise "No"

4. Optional styling:
   - Deleted rows may appear visually muted.
   - Keep Tailwind simple.

5. Do NOT add:
   - database
   - sync
   - external libraries

Acceptance criteria:
- Deleted records are hidden by default.
- User can enable "Show deleted records".
- Deleted records appear in the table.
- Deleted records show Deleted = Yes.
- Active records show Deleted = No.