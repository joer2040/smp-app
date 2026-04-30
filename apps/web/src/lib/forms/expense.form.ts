import type { FormConfig } from "@/types/forms";

export const expenseForm = {
  id: "expense",
  title: "Expense Form",
  fields: [
    { name: "date", label: "Date", type: "date", required: true },
    { name: "concept", label: "Concept", type: "text", required: true },
    { name: "amount", label: "Amount", type: "number", required: true }
  ]
} satisfies FormConfig;
