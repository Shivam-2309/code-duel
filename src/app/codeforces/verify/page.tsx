"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "token-shown" | "checking" | "verified" | "error";

export default function VerifyHandlePage() {
  const router = useRouter();

  const [handle, setHandle] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("checking");

    try {
      const res = await fetch("/api/codeforces/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("idle");
        return;
      }

      setToken(data.token);
      setStatus("token-shown");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  const handleCheck = async () => {
    setError(null);
    setStatus("checking");

    try {
      const res = await fetch("/api/codeforces/verify", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.verified) {
        setError(data.error || data.message || "Token not detected yet");
        setStatus("token-shown");
        return;
      }

      setRating(data.rating ?? null);
      setStatus("verified");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStatus("token-shown");
    }
  };

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 relative overflow-hidden">
      {/* subtle yellow glow in the background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-125 h-125 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

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

        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 backdrop-blur-sm space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <StepDot
              active={status !== "idle"}
              done={status === "verified"}
              label="1"
            />
            <div className="flex-1 h-px bg-neutral-800" />
            <StepDot
              active={
                status === "token-shown" ||
                status === "checking" ||
                status === "verified"
              }
              done={status === "verified"}
              label="2"
            />
            <div className="flex-1 h-px bg-neutral-800" />
            <StepDot
              active={status === "verified"}
              done={status === "verified"}
              label="3"
            />
          </div>

          {status === "verified" ? (
            <div className="text-center space-y-3 py-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-500/30">
                <span className="text-yellow-400 text-xl">✓</span>
              </div>
              <div>
                <p className="text-white font-medium">{handle}</p>
                <p className="text-neutral-400 text-sm">
                  {rating !== null ? `Rating: ${rating}` : "Handle verified"}
                </p>
              </div>
              <button
                onClick={() => router.push("/battleground")}
                className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition"
              >
                Continue to Battleground
              </button>
            </div>
          ) : status === "idle" ? (
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

              {error && <ErrorBanner message={error} />}

              <button
                type="submit"
                className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "Generate token"
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-300 mb-2">
                  Paste this token into your Codeforces{" "}
                  <span className="text-white">First name</span> field:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-md bg-neutral-950 border border-yellow-500/30 px-3 py-2 text-yellow-400 text-sm font-mono tracking-wider">
                    {token}
                  </code>
                  <button
                    onClick={handleCopy}
                    type="button"
                    className="text-xs px-3 py-2 rounded-md border border-neutral-800 text-neutral-300 hover:border-yellow-500/40 hover:text-yellow-400 transition"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <a
                href="https://codeforces.com/settings/social"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
              >
                Open Codeforces settings ↗
              </a>

              {error && <ErrorBanner message={error} />}

              <button
                onClick={handleCheck}
                disabled={status === "checking"}
                className="w-full rounded-md bg-yellow-400 text-black text-sm font-semibold py-2 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "checking"
                  ? "Checking..."
                  : "I've added it — verify now"}
              </button>

              <button
                onClick={() => {
                  setStatus("idle");
                  setToken(null);
                  setError(null);
                }}
                type="button"
                className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition"
              >
                Use a different handle
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-600">
          You can change your first name back once verified
        </p>
      </div>
    </div>
  );
}

function StepDot({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium border transition ${
        done
          ? "bg-yellow-400 border-yellow-400 text-black"
          : active
            ? "border-yellow-500/60 text-yellow-400"
            : "border-neutral-800 text-neutral-600"
      }`}
    >
      {done ? "✓" : label}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
      {message}
    </p>
  );
}
