"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCfPage() {
  const router = useRouter();

  const [step, setStep] = useState<"input" | "confirm">("input");
  const [handle, setHandle] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {};

  const handleConfirm = async () => {};

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-150 h-150 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-sm space-y-6 relative">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-500/30 mb-4">
            <span className="text-yellow-400 text-xl font-bold">CF</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Verify your handle
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Link your Codeforces account to start dueling
          </p>
        </div>

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm space-y-4">
          {step === "input" && (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">
                  Codeforces handle
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/40 transition"
                  placeholder="tourist"
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
                className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {loading ? "Generating..." : "Continue"}
              </button>
            </form>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-300">
                We've generated a verification code for your handle. Please save
                it in your Codeforces profile's "About Me" section, then click
                "I've saved it — Verify".
              </p>
              <p className="text-sm text-neutral-400">
                If you haven't added the code yet, you can go back and change
                your handle.
              </p>
              <p className="text-sm text-neutral-400">
                Once verified, you'll be able to start dueling!
              </p>

              <div className="rounded-md bg-neutral-950 border border-yellow-500/40 px-4 py-3 text-center">
                <span className="text-yellow-400 font-mono text-lg tracking-wider">
                  {verificationCode}
                </span>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {loading ? "Checking..." : "I've saved it — Verify"}
              </button>

              <button
                onClick={() => setStep("input")}
                className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition"
              >
                Use a different handle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
