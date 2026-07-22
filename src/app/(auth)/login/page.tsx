"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // Successful login — send them into the app.
    // Later this should check `verified` and route to /codeforces/verify
    // if they haven't linked their CF handle yet.
    router.push("/codeforces/verify");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-500/30 mb-4">
            <span className="text-yellow-400 text-xl font-bold">⚔</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Log in to enter the battleground
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
        >
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/40 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/40 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
