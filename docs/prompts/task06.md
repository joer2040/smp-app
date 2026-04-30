You are an expert TypeScript + React engineer.

Task 06: Normalize form values based on field type before saving.

Context:
- FormRenderer currently captures all values as strings
- We need to convert values based on field.type
- Supported types: text, number, date

Goal:
Ensure values are stored with correct types in AppRecord.values

Requirements:

1. Inside FormRenderer, before saving:

Create a function:

function normalizeValues(form, values)

2. Behavior:

- type "text" → string (no change)
- type "number" → convert to number using Number(value)
- type "date" → keep as string (ISO or yyyy-mm-dd is fine)

3. Apply normalization:

Before creating AppRecord:

const normalized = normalizeValues(form, values)

and store:

values: normalized

4. Edge case:

If number is invalid (empty or NaN), keep it as null.

5. Do NOT:
- Add libraries
- Change form structure
- Modify storage layer

Acceptance criteria:

- amount is stored as number
- date remains string
- concept remains string
- no runtime errors