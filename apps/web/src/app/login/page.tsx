"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/forms/expense");
  }

  async function handleSignUp() {
    setIsSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Check your email if confirmation is enabled.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md space-y-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use Supabase email and password auth.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
              id="email"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950 outline-none focus:border-slate-900"
              id="password"
              minLength={6}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {message ? <p className="text-sm text-slate-700">{message}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              Login
            </button>
            <button
              className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-60"
              disabled={isSubmitting}
              type="button"
              onClick={() => void handleSignUp()}
            >
              Sign Up
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
