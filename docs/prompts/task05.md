You are an expert TypeScript + React engineer.

Task 05: Introduce a real Record model for local persistence.

Context:
- The app already has a config-driven FormRenderer.
- Local persistence currently stores raw form values directly.
- We need a proper record structure before adding SQLite or sync.

Goal:
Instead of storing only raw values, store records with metadata.

Requirements:

1. Create shared record types in:

apps/web/src/types/records.ts

Define:

export type SyncStatus =
  | "pending_create"
  | "pending_update"
  | "pending_delete"
  | "synced"
  | "sync_error";

export type RecordValues = Record<string, string | number | boolean | null>;

export type AppRecord = {
  id: string;
  formId: string;
  values: RecordValues;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
};

2. Update localStorage utility:

apps/web/src/lib/db/localStorage.ts

Functions should work with AppRecord:

- saveRecord(record: AppRecord): void
- getRecords(formId: string): AppRecord[]

Storage should still be per formId.

3. Update FormRenderer:

On submit:
- Create an AppRecord
- Generate id using crypto.randomUUID()
- Set formId from form.id
- Store submitted form values under values
- Set createdAt and updatedAt as ISO strings
- Set syncStatus = "pending_create"
- Save using saveRecord(record)

4. Display saved records as JSON below the form.

5. Do NOT add:
- SQLite
- Supabase
- sync implementation
- external libraries

6. Keep the app working at:

/forms/expense

Acceptance criteria:
- Submitting the form creates an AppRecord with metadata.
- Refreshing the page keeps saved records.
- Each new submission has a unique id.
- syncStatus is visible as "pending_create".