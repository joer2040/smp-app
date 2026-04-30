# Template Strategy

SMP is intended to be the reusable base for offline-first business applications. The template should keep the synchronization, persistence, auth, and safety rules stable while allowing each new project to add its own forms, branding, reports, and business rules.

## Core

Core is the reusable offline-first platform layer. It should be treated as shared infrastructure.

Core includes:

- IndexedDB persistence in `apps/web/src/lib/db`.
- Sync orchestration in `apps/web/src/lib/sync`.
- Supabase browser client setup in `apps/web/src/lib/supabase`.
- Auth session handling and record ownership flow.
- `AppRecord`, `SyncStatus`, `SyncAction`, and shared record types.
- Logical deletion behavior.
- Retry behavior for `sync_error`.
- Conflict detection and manual conflict resolution.
- Background sync triggered by browser connectivity events.
- Supabase migrations and RLS policies.

Modify Core only when the change improves the reusable template itself. Core changes should include typecheck, lint, build, and browser validation.

## Business Customization

Business customization is the project-specific layer. It can vary per company or application.

Business customization includes:

- Form definitions and field labels.
- Business-specific validation rules.
- Reports and dashboards.
- Branding and navigation.
- Role-specific workflows.
- Company terminology.
- Domain-specific data models that sit above the generic `records` storage model.

The sample expense form is not the final business app. It is a proof of concept for the template's offline-first mechanics.

## Files to Avoid Changing Casually

Do not casually modify these files or modules in a business project:

- `apps/web/src/lib/db/indexedDb.ts`
- `apps/web/src/lib/sync/*`
- `apps/web/src/lib/supabase/*`
- `apps/web/src/hooks/useBackgroundSync.ts`
- `apps/web/src/types/records.ts`
- `supabase/migrations/*`
- `docs/ARCHITECTURE.md`

These files define the core guarantees of local persistence, sync, RLS, retries, conflicts, and background sync. Changes here can affect data safety.

## Files Expected to Change Per Project

These areas are expected to change when creating a company-specific app:

- `README.md`
- `apps/web/src/lib/forms/*`
- `apps/web/src/app/*`
- `apps/web/src/components/*` for business UI and layout
- `docs/PLAN.md`
- Project branding assets and copy
- Business reports
- Business rule modules

When adding new forms, prefer config-driven form definitions first. Add custom components only when the business workflow cannot be represented cleanly by the generic renderer.

## Recommended Future Structure

As SMP grows, split project-specific work away from the core:

```text
apps/web/src/core/
  db/
  sync/
  supabase/
  auth/
  records/

apps/web/src/business/
  forms/
  workflows/
  validation/

apps/web/src/branding/
  theme/
  copy/
  assets/

apps/web/src/reports/
  definitions/
  components/
  export/

apps/web/src/rules/
  permissions/
  calculations/
  policies/
```

The current repository has not been refactored into this structure yet. Use it as the direction for future template hardening.

## Per-Company Checklist

For each new project created from SMP:

- Rename project metadata.
- Create a new Supabase project.
- Configure `NEXT_PUBLIC_SUPABASE_URL`.
- Configure `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Apply migrations.
- Review RLS policies against the business ownership model.
- Replace sample forms with business forms.
- Add branding.
- Add reports.
- Add business rules.
- Validate offline create, update, delete, sync, conflict, and background sync flows.

## Template Rules

- Do not commit secrets.
- Do not bypass RLS for browser flows.
- Do not physically delete records as the default offline-first behavior.
- Do not auto-resolve conflicts without a product decision.
- Do not add background polling loops without a clear operational need.
- Do not mix business-specific assumptions into Core unless the template is intentionally evolving.
