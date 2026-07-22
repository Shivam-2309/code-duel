"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
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

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("Result", res);

      const data = await res.json();

      console.log("DATA: ", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 relative overflow-hidden">
      {/* subtle yellow glow in the background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-500/30 mb-4">
            <span className="text-yellow-400 text-xl font-bold">⚔</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Start dueling on Codeforces problems
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm"
        >
          <div>
            <label className="block text-sm text-neutral-300 mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/40 transition"
              placeholder="tourist"
            />
          </div>

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
              minLength={6}
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
