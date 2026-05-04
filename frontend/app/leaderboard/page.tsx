"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getLeaderboard } from "@/lib/api";
import { formatCredits } from "@/lib/mockData";
import type { LeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch {
      setError("Unable to load leaderboard. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title="Discover traders worth following"
        description="Compare traders by balance, trading volume, follower activity, and market participation."
      />
      <section className="section-container pb-16">
        <div className="glass-panel overflow-hidden">
          {isLoading ? (
            <LoadingRows />
          ) : error ? (
            <ErrorState message={error} onRetry={loadLeaderboard} />
          ) : leaderboard.length > 0 ? (
            leaderboard.map((trader) => <TraderRow key={trader.userId} trader={trader} />)
          ) : (
            <div className="p-8 text-center">
              <p className="font-semibold text-white">No traders yet</p>
              <p className="mt-2 text-sm text-slate-400">Trader rankings will appear once accounts are active.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function TraderRow({ trader }: { trader: LeaderboardEntry }) {
  const topRank = trader.rank <= 3;

  return (
    <div
      className={`grid gap-4 border-b border-white/10 p-5 last:border-0 lg:grid-cols-[90px_1fr_repeat(5,112px)_110px] lg:items-center ${
        topRank ? "bg-cyan-300/[0.035]" : ""
      }`}
    >
      <div className={topRank ? "flex items-center gap-2 text-cyan-300" : "flex items-center gap-2 text-slate-400"}>
        <Trophy className="h-5 w-5" />
        <span className="font-bold">#{trader.rank}</span>
      </div>

      <div>
        <p className="font-semibold text-white">{trader.name}</p>
        <p className="mt-1 text-sm text-slate-500">@{trader.username}</p>
      </div>

      <Metric label="Balance" value={`${formatCredits(trader.balance)} cr`} />
      <Metric label="Trades" value={formatCredits(trader.tradeCount)} />
      <Metric label="Volume" value={`${formatCredits(trader.totalVolume)} cr`} />
      <Metric label="Followers" value={formatCredits(trader.followerCount)} icon />
      <Metric label="Following" value={formatCredits(trader.followingCount)} />

      <button
        type="button"
        className="secondary-button justify-center px-4 py-2"
        aria-label={`Follow ${trader.name}`}
      >
        Follow
      </button>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
        {icon ? <Users className="h-3.5 w-3.5 text-slate-500" /> : null}
        {value}
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
      <p className="text-sm text-slate-300">{message}</p>
      <button type="button" onClick={onRetry} className="secondary-button self-start px-4 py-2 sm:self-auto">
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-1 p-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}
