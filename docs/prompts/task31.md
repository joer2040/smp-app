You are an expert software architect and technical writer.

Task 31: Refine ARCHITECTURE.md with advanced system design concepts.

Context:
- ARCHITECTURE.md already exists and describes an offline-first system.
- The system includes:
  - IndexedDB local storage
  - Supabase backend
  - Auth + RLS owner-based security
  - Sync engine with create/update/delete
  - syncStatus + syncAction
  - retry logic
- The document is already good but missing deeper architectural clarity.

Goal:
Upgrade the document to senior-level clarity.

Requirements:

1. Improve Overview:

Explicitly define:

- Supabase as the source of truth
- IndexedDB as a local replica
- Offline-first behavior

Add:

"The system follows an eventual consistency model."

2. Add section or subsection:

## Consistency Model

Explain:
- Eventual consistency
- Temporary divergence between local and remote
- Sync as reconciliation

3. Improve Sync Process:

Explain WHY the order matters:

create → update → delete

4. Add subsection:

## Retry Strategy

Explain:
- role of syncAction
- deterministic retries
- why retry without syncAction is ambiguous

5. Improve Error Handling:

Clarify:
- difference between error vs 0 rows affected
- why 0 rows can indicate RLS or missing record

6. Improve Security:

Add note:

- created_by is a simplified ownership model
- future evolution:
  - multi-tenant (company_id)
  - roles/permissions

7. Improve Logical Deletion explanation:

Explain:
- tombstones
- why physical delete is unsafe in offline-first

8. Add subsection:

## Conflict Handling (Current Behavior)

Explain:

- system currently uses Last Write Wins implicitly
- no version enforcement yet
- conflicts are not detected
- data may be overwritten silently

9. Add subsection:

## Future Improvements

Include:

- conflict detection via version
- conflict resolution strategies
- background sync
- multi-tenant access
- idempotency

10. Style:

- precise
- no fluff
- structured
- consistent terminology

11. Do NOT:
- change code
- change system behavior
- invent features not implemented

Acceptance criteria:
- Document clearly explains architecture decisions
- Includes consistency model and conflict behavior
- Suitable for onboarding a senior developer