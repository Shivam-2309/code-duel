import Link from "next/link";

export default function BattlegroundPage() {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center space-y-8">
        <div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-yellow-400/10 border border-yellow-500/30 mb-5">
            <span className="text-yellow-400 text-2xl font-bold">⚔</span>
          </div>
          <h1 className="text-3xl font-semibold text-white">Battleground</h1>
          <p className="text-neutral-400 text-sm mt-2 max-w-sm">
            Get matched with an opponent and race to solve a Codeforces problem
            first.
          </p>
        </div>

        <button
          disabled
          className="rounded-md bg-yellow-400 text-black text-sm font-semibold px-8 py-3 hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Matchmaking isn't wired up yet"
        >
          Start Duel
        </button>

        <p className="text-xs text-neutral-500">
          Matchmaking coming soon — this button is a placeholder until the
          socket server is built.
        </p>

        <div className="flex gap-4 text-sm text-neutral-400 pt-4">
          <Link
            href="/result"
            className="hover:text-yellow-400 transition underline underline-offset-2"
          >
            View past results
          </Link>
        </div>
      </div>
    </div>
  );
}
