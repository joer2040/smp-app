You are an expert software architect preparing a project to become a reusable GitHub template.

Task 36: Prepare SMP as a reusable offline-first application template.

Context:
- SMP is an offline-first web app with:
  - Next.js
  - IndexedDB
  - Supabase Auth
  - Supabase RLS
  - sync engine
  - conflict detection/resolution
  - background sync
- We want to preserve SMP as a base template.
- Future business-specific apps will be created from this template.

Goal:
Clean, document, and prepare the repository so it can be safely used as a GitHub template.

Requirements:

1. Update README.md

Include:
- What SMP is
- Main features
- Tech stack
- Local setup
- Environment variables
- Supabase setup
- Migration instructions
- How to run dev/build
- How to create a new project from this template

2. Create:

docs/TEMPLATE_STRATEGY.md

Explain:
- What belongs to Core
- What belongs to Business customization
- What files/modules should not be modified casually
- What should be changed per company/project
- Recommended future structure:
  - core/
  - business/
  - branding/
  - reports/
  - rules/

3. Create:

.env.example

Include:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Do not include real secrets.

4. Verify .gitignore

Ensure it ignores:
- .env
- .env.local
- node_modules
- .next
- supabase/.temp
- build artifacts

5. Review docs

Ensure these files exist and are referenced:
- docs/PLAN.md
- docs/ARCHITECTURE.md
- docs/TASKS.md
- docs/TEMPLATE_STRATEGY.md

6. Do NOT:
- change app behavior
- change Supabase schema
- apply migrations
- remove working features
- add new dependencies

7. Acceptance criteria:
- Project can be cloned and understood by a new developer.
- No secrets are committed.
- README clearly explains setup.
- Template strategy is clear.
- Existing app still builds.