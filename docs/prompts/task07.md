You are an expert React + TypeScript engineer.

Task 07: Display saved records in a simple table.

Context:
- FormRenderer creates AppRecord objects and stores them locally.
- Saved records are currently displayed as JSON.
- We want a simple readable table before adding advanced table libraries.

Goal:
Replace or complement the JSON saved records display with a table.

Requirements:

1. Create a component:

apps/web/src/components/tables/RecordsTable.tsx

Props:
- records: AppRecord[]

2. The table should display:

- createdAt
- syncStatus
- date
- concept
- amount

3. For date, concept and amount:
- Read values from record.values
- Handle missing values gracefully

4. Update FormRenderer:
- Import RecordsTable
- Display "Saved Records" using the table
- Keep JSON output optional or remove it if table works cleanly

5. Do NOT add:
- TanStack Table
- external libraries
- database
- sync

6. Keep UI simple with Tailwind.

Acceptance criteria:
- Submitting a record updates the table
- Refreshing the page keeps records visible
- amount displays as a number
- No runtime errors