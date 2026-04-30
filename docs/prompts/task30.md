You are an expert software architect and technical writer.

Task 30: Create technical documentation for the offline-first system.

Context:
- The project is SMP.
- It is an offline-first system with:
  - IndexedDB local storage (idb)
  - Supabase backend
  - Auth with Supabase
  - RLS owner-based security
  - Sync engine with create/update/delete
  - syncStatus states
  - syncAction for retry
  - sync_error handling
  - unified syncAll
- The system is already implemented and working.

Goal:
Document the architecture clearly for developers.

Requirements:

1. Create file:

docs/ARCHITECTURE.md

2. Include sections:

## 1. Overview
Explain what the system is and its offline-first nature.

## 2. Data Model
Explain AppRecord structure:
- id
- formId
- values
- syncStatus
- syncAction
- isDeleted
- timestamps
- created_by / updated_by

## 3. Local Storage (IndexedDB)
- database name
- object store
- indexes
- user-scoped storage strategy

## 4. Sync Engine
Explain:
- pending_create
- pending_update
- pending_delete
- sync_error
- synced

Explain flow:
- create → pending_create → synced
- update → pending_update → synced
- delete → pending_delete → synced

## 5. Sync Process
Explain:
- insertPendingCreates
- syncPendingUpdates
- syncPendingDeletes
- syncAll

Explain execution order:
create → update → delete

## 6. Error Handling
Explain:
- sync_error
- retry logic using syncAction
- 0 rows affected handling

## 7. Backend (Supabase)
- table structure
- jsonb values
- logical deletion
- version field

## 8. Security
- Supabase Auth
- RLS using created_by
- auth.uid() = created_by
- why delete is logical

## 9. User Isolation
- frontend IndexedDB per user
- backend RLS per user

## 10. Known Limitations
- no background sync yet
- no conflict resolution
- no multi-tenant/company model yet

3. Style:
- clear
- structured
- no fluff
- developer-oriented

4. Do NOT:
- modify source code
- change behavior
- add diagrams unless trivial

Acceptance criteria:
- File exists
- Clear explanation of architecture
- Someone new could understand the system