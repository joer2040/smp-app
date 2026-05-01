# Data Model And Reporting Strategy

## Current Decision

`smp-app` starts with `public.records` as the flexible offline-first capture table.

This keeps the validated core stable:

- Browser writes records locally first.
- IndexedDB stores form payloads while offline.
- Sync promotes local changes to Supabase.
- RLS keeps records scoped to `created_by`.
- Conflict handling stays tied to the core record version.

Business-specific data should be introduced above this core, not inside the sync engine.

## Flexible Capture Layer

`public.records` remains the source for early capture workflows:

- `form_id` identifies the business form.
- `values jsonb` stores dynamic field values.
- `sync_status`, `sync_action`, `is_deleted`, and `version` remain core sync metadata.
- `created_by` and `updated_by` preserve owner-based access control.

Use this model while forms are still changing or while the business process is being discovered.

Good candidates for `records.values` only:

- Early forms with unstable fields.
- Low-volume capture.
- Simple tabular review.
- Operational notes or inspections.
- Data that does not require strict relational constraints yet.

## Reporting Layer Options

Reports should read from a business reporting layer when requirements become stable.

Recommended options:

- SQL views for lightweight projections over `records.values`.
- Materialized views for slower aggregate reports that need refresh control.
- Normalized derived tables for high-value business processes.
- Scheduled jobs or future transformation processes for heavier analytics.

The first reporting layer should be read-only from the app perspective. Sync continues writing to `records`; reports consume or derive from it.

## When To Stay With JSON

Keep data in flexible JSON when:

- The form is still evolving.
- Reporting is simple.
- Data volume is low.
- Fields are optional or highly variable.
- No strict joins, unique constraints, or foreign keys are needed.
- Business users are still validating the workflow.

## When To Promote To Relational Structure

Promote fields or processes to relational structure when:

- Reports require frequent filtering, grouping, or joins.
- Values need database-level constraints.
- Data volume makes JSON queries slow.
- The process is stable and unlikely to change weekly.
- Other tables need to reference the captured data.
- Auditing, approvals, or financial controls depend on exact fields.
- Export requirements become formal and repeatable.

Promotion does not mean deleting `records`. A stable business table can be derived from `records` or written by a controlled transformation process.

## Risks Of Reporting Directly From JSON

Reporting directly from `records.values` has tradeoffs:

- Field names can drift across form versions.
- Numeric values may arrive as strings if normalization is incomplete.
- Missing fields can break assumptions.
- JSON extraction queries become harder to maintain.
- Indexing is less obvious than normal columns.
- Complex joins and constraints are weak.
- Report logic can become duplicated across SQL and frontend code.

Mitigation:

- Version form definitions.
- Normalize values before local save.
- Keep report SQL centralized.
- Promote stable fields to views or derived tables.
- Document each report's expected field set.

## Core Protection Rules

Do not change core sync to satisfy one report.

Core must not know business-specific fields, report names, or domain rules. Business code may use core records, but core should stay generic.

Protected areas:

- `apps/web/src/lib/db/*`
- `apps/web/src/lib/sync/*`
- `apps/web/src/lib/supabase/*`
- `apps/web/src/types/records.ts`
- `supabase/migrations` that define core record behavior

Business-specific work should live in a separate layer, for example:

```text
apps/web/src/business/
  forms/
  reports/
  rules/
  catalogs/
  branding/
```

## First Real Form Design Checklist

Before implementing the first business form, define:

- Business process name.
- User role that captures the data.
- Required fields.
- Optional fields.
- Field types.
- Validation rules.
- Which fields are report-critical.
- Which fields may change later.
- Whether records are append-only or editable.
- Whether logical deletion is allowed.
- Expected offline usage.
- First report that will consume the data.

## Recommended Next Step

Create a short form specification for the first real business workflow.

Suggested document:

```text
docs/FIRST_BUSINESS_FORM_SPEC.md
```

That document should define the first form and its report needs before adding code, migrations, or business modules.
