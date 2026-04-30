You are an expert React + Next.js engineer.

Task 03: Implement a basic form engine (config-driven, hybrid) without persistence.

Context:
- Monorepo already set up
- Next.js app in apps/web
- We are building an offline-first system
- Do NOT implement database, sync, or backend yet

Goal:
Render a form from a config object and handle submission in memory.

Requirements:

1. Create a form definition in:
   apps/web/src/lib/forms/expense.form.ts

Example structure:

export const expenseForm = {
  id: "expense",
  title: "Expense Form",
  fields: [
    { name: "date", label: "Date", type: "date", required: true },
    { name: "concept", label: "Concept", type: "text", required: true },
    { name: "amount", label: "Amount", type: "number", required: true }
  ]
}

2. Create a FormRenderer component:

apps/web/src/components/forms/FormRenderer.tsx

Responsibilities:
- Receive form config
- Render inputs dynamically
- Handle local state (useState)
- Validate required fields (simple validation)
- On submit, log data to console AND show JSON result on screen

3. Create a page:

apps/web/src/app/forms/expense/page.tsx

- Import the form config
- Use FormRenderer
- Display submitted data below the form

4. Keep UI simple using Tailwind

5. Do NOT:
- Add database
- Add API calls
- Add external form libraries

6. Ensure:

- pnpm dev runs
- Form renders correctly
- User can input data
- Submit shows JSON result

Output:

- Show created files
- Show how to test