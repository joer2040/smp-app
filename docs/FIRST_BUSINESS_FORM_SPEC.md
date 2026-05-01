# First Business Form Spec

Use this template before implementing the first real business form. Fill it with business decisions first; code, migrations, and reports come after review.

## 1. Business Process Name

- Process name:
- Business area:
- Short description:

## 2. Form Objective

- What problem does this form solve?
- What decision or operation depends on this data?
- What should be true after a record is captured?

## 3. Capture User Or Role

- Primary role:
- Secondary roles:
- Who can create records?
- Who can review records?
- Who can edit records?

## 4. Expected Capture Frequency

- Per user:
- Per day/week/month:
- Peak capture times:
- Expected record volume:

## 5. Offline Need

- Must work offline? Yes/No:
- Typical offline scenario:
- Maximum expected offline duration:
- Does the user need to see prior records while offline?
- Should sync be immediate when connection returns?

## 6. Required Fields

| Field | Description | Type | Required Reason | Report Critical |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 7. Optional Fields

| Field | Description | Type | When Used | Report Critical |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 8. Field Types

Use only field types the current form renderer can support or that are approved for extension.

| Field | Type | Format | Default | Notes |
| --- | --- | --- | --- | --- |
|  | text |  |  |  |
|  | number |  |  |  |
|  | date | YYYY-MM-DD |  |  |
|  | boolean | true/false |  |  |
|  | select | catalog-backed |  |  |

## 9. Validations

| Field | Validation Rule | Error Message | Blocking? |
| --- | --- | --- | --- |
|  |  |  | Yes/No |

General validation notes:

- Required fields:
- Numeric ranges:
- Date rules:
- Duplicate prevention:
- Cross-field rules:

## 10. Required Catalogs

| Catalog | Purpose | Source | Offline Required | Update Frequency |
| --- | --- | --- | --- | --- |
|  |  |  | Yes/No |  |

Catalog notes:

- Can catalogs be hardcoded initially?
- Must catalogs sync offline?
- Who maintains catalog values?

## 11. Edit Rules

- Can records be edited after creation?
- Who can edit?
- Until what status or time window?
- Should edits preserve history?
- Should edits trigger `pending_update`?

## 12. Logical Delete Rules

- Is logical delete allowed?
- Who can delete?
- Should deleted records remain visible to reviewers?
- Should delete require a reason?
- Should delete sync as `pending_delete`?

## 13. Report-Critical Fields

List fields that reports will depend on. These fields are candidates for future SQL views, materialized views, or derived tables.

| Field | Report Use | Needs Index? | Candidate For Relational Promotion |
| --- | --- | --- | --- |
|  |  | Yes/No | Yes/No |

## 14. First Expected Report

- Report name:
- Audience:
- Purpose:
- Filters:
- Grouping:
- Totals/calculations:
- Export needed? Yes/No:
- Online only or offline-capable:

## 15. Possible Future SQL Views

Potential view names:

- `business_<process>_records_v`
- `business_<process>_summary_v`

Expected columns:

| Column | Source | Transformation |
| --- | --- | --- |
|  | `records.values ->>` |  |

## 16. Criteria To Stay In JSON

Keep this form in `records.values` if:

- Fields are still changing.
- Reports are simple.
- Volume is low.
- No strict joins or constraints are needed.
- Business users are still validating the workflow.

Project-specific decision:

- Stay in JSON for now? Yes/No:
- Reason:

## 17. Criteria To Promote To Relational Table Or View

Promote when:

- The process is stable.
- Report logic becomes repetitive or slow.
- Fields need database constraints.
- Other tables need references.
- Exports become formal business artifacts.

Project-specific promotion trigger:

- Trigger condition:
- Candidate table/view:
- Required migration:

## 18. Risks Or Open Questions

- Open business questions:
- Technical unknowns:
- Data quality risks:
- Reporting risks:
- Security/RLS concerns:
- Offline edge cases:

## Approval Before Implementation

- Business owner approved:
- Technical owner approved:
- Ready for code implementation: Yes/No
