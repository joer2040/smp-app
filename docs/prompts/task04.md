You are an expert frontend engineer.

Task 04: Add local persistence using localStorage (temporary storage layer).

Context:
- FormRenderer already exists
- We are NOT implementing SQLite yet
- This is a temporary persistence layer to validate flow

Goal:
Persist submitted form data locally and reload it on page refresh.

Requirements:

1. Create a storage utility:

apps/web/src/lib/db/localStorage.ts

Functions:

- saveRecord(formId: string, data: object)
- getRecords(formId: string): object[]

Implementation:
- Use localStorage
- Store data per formId
- Use JSON.stringify / JSON.parse

2. Update FormRenderer:

- On submit:
  - Save the record using saveRecord
- On load:
  - Load existing records using getRecords
  - Show them below the form (list or JSON)

3. UI:

- Add a section "Saved Records"
- Display all saved records

4. Keep it simple:
- No external libraries
- No database yet
- No sync

5. Ensure:

- Data persists after refresh
- Multiple submissions are stored
- No runtime errors

Output:

- Show new files
- Show updated FormRenderer
- Explain how to test