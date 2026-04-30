import { hasSupabaseConfig } from "@/lib/supabase";

export function SupabaseStatus() {
  const isConfigured = hasSupabaseConfig();

  return (
    <section className="rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
      {isConfigured
        ? "Supabase client configured"
        : "Supabase client missing env vars"}
    </section>
  );
}
