"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function AuthStatus() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setEmail(null);
  }

  if (isLoading) {
    return (
      <section className="rounded border border-slate-200 bg-white p-3 text-sm text-slate-700">
        Checking session
      </section>
    );
  }

  return (
    <section className="flex flex-wrap items-center gap-3 rounded border border-slate-200 bg-white p-3 text-sm text-slate-700">
      {email ? (
        <>
          <span>{email}</span>
          <button
            className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
            type="button"
            onClick={() => void handleLogout()}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <span>Not logged in</span>
          <Link
            className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-100"
            href="/login"
          >
            Login
          </Link>
        </>
      )}
    </section>
  );
}
