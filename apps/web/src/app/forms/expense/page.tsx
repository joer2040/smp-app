import { FormRenderer } from "@/components/forms";
import { AuthStatus, SupabaseStatus } from "@/components/layout";
import { expenseForm } from "@/lib/forms/expense.form";

export default function ExpenseFormPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-10">
      <SupabaseStatus />
      <AuthStatus />
      <FormRenderer form={expenseForm} />
    </main>
  );
}
