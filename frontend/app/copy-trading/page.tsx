"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Copy, Pause, RefreshCw, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  getCopyActivity,
  getCopyFollowing,
  unfollowTrader,
  updateCopySettings,
} from "@/lib/api";
import { formatCredits } from "@/lib/mockData";
import type { CopyActivityTrade, CopyFollowingItem } from "@/lib/types";
import { resolveUserId } from "@/lib/user";
import { useAuthStore } from "@/store/authStore";

export default function CopyTradingPage() {
  const user = useAuthStore((state) => state.user);
  const userId = resolveUserId(user);
  const [following, setFollowing] = useState<CopyFollowingItem[]>([]);
  const [activity, setActivity] = useState<CopyActivityTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadCopyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [followingData, activityData] = await Promise.all([
        getCopyFollowing(userId),
        getCopyActivity(userId),
      ]);
      setFollowing(followingData.following);
      setActivity(activityData.copiedTrades);
    } catch {
      setError("Unable to load copy settings. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadCopyData();
  }, [loadCopyData]);

  async function handleUpdate(traderId: number, copyRatio: number, isEnabled: boolean) {
    setMessage(null);
    setError(null);
    try {
      await updateCopySettings(traderId, { followerId: userId, copyRatio, isEnabled });
      setMessage("Copy settings updated.");
      await loadCopyData();
    } catch {
      setError("Unable to update copy settings.");
    }
  }

  async function handleUnfollow(traderId: number) {
    setMessage(null);
    setError(null);
    try {
      await unfollowTrader(traderId, userId);
      setMessage("Trader removed from your copy list.");
      await loadCopyData();
    } catch {
      setError("Unable to remove trader.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Copy Trading"
        title="Follow traders and set copy ratios"
        description="Choose skilled traders, set your preferred copy ratio, and manage active follow relationships."
      />
      <section className="section-container space-y-6 pb-16">
        {message ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        ) : null}

        {error ? <ErrorState message={error} onRetry={loadCopyData} /> : null}

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="glass-panel overflow-hidden">
            {isLoading ? (
              <LoadingRows />
            ) : following.length > 0 ? (
              following.map((item) => (
                <CopyRelationshipCard
                  key={item.traderId}
                  item={item}
                  onUpdate={handleUpdate}
                  onUnfollow={handleUnfollow}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="font-semibold text-white">You are not copying any traders yet.</p>
                <p className="mt-2 text-sm text-slate-400">Visit the leaderboard to discover top traders.</p>
                <Link href="/leaderboard" className="premium-button mt-5 inline-flex px-4 py-2">
                  View leaderboard
                </Link>
              </div>
            )}
          </div>

          <div className="surface-card p-5">
            <h2 className="text-lg font-semibold text-white">Copied activity</h2>
            <p className="mt-1 text-sm text-slate-500">Trades mirrored into your account.</p>
            <div className="mt-5 space-y-3">
              {isLoading ? (
                <div className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
              ) : activity.length > 0 ? (
                activity.map((trade) => <ActivityRow key={trade.id} trade={trade} />)
              ) : (
                <p className="text-sm leading-6 text-slate-400">Copied trades will appear here when followed traders place new orders.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CopyRelationshipCard({
  item,
  onUpdate,
  onUnfollow,
}: {
  item: CopyFollowingItem;
  onUpdate: (traderId: number, copyRatio: number, isEnabled: boolean) => Promise<void>;
  onUnfollow: (traderId: number) => Promise<void>;
}) {
  const [ratio, setRatio] = useState(String(Math.round(item.copyRatio * 100)));
  const [enabled, setEnabled] = useState(item.isEnabled);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    try {
      const ratioValue = Math.min(100, Math.max(1, Number(ratio) || 50)) / 100;
      await onUpdate(item.traderId, ratioValue, enabled);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="border-b border-white/10 p-5 last:border-0">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-300">
            <Copy className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">{item.traderName}</h2>
          <p className="mt-1 text-sm text-slate-500">@{item.traderUsername}</p>
          <p className="mt-3 text-xs text-slate-500">Following since {formatDate(item.createdAt)}</p>
        </div>
        <span className={enabled ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300" : "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-400"}>
          {enabled ? "Enabled" : "Paused"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[160px_1fr_auto_auto] md:items-end">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Copy ratio</span>
          <div className="premium-input mt-2 flex items-center px-3">
            <input
              value={ratio}
              onChange={(event) => setRatio(event.target.value)}
              inputMode="numeric"
              className="w-full bg-transparent py-2.5 text-sm font-semibold text-white outline-none"
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
        </label>
        <button
          type="button"
          onClick={() => setEnabled((value) => !value)}
          className="secondary-button justify-center px-4 py-3"
        >
          <Pause className="h-4 w-4" />
          {enabled ? "Pause" : "Enable"}
        </button>
        <button type="button" onClick={save} disabled={isSaving} className="premium-button justify-center px-4 py-3 disabled:opacity-50">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving" : "Save"}
        </button>
        <button type="button" onClick={() => onUnfollow(item.traderId)} className="secondary-button justify-center px-4 py-3 text-rose-200">
          <Trash2 className="h-4 w-4" />
          Unfollow
        </button>
      </div>
    </article>
  );
}

function ActivityRow({ trade }: { trade: CopyActivityTrade }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 text-sm font-semibold text-white">{trade.marketQuestion}</p>
        <span className={trade.side === "YES" ? "text-sm font-semibold text-emerald-300" : "text-sm font-semibold text-rose-300"}>
          {trade.side}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">Copied from @{trade.originalTraderUsername} · {formatDate(trade.createdAt)}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <MiniMetric label="Amount" value={`${formatCredits(trade.amount)} cr`} />
        <MiniMetric label="Price" value={`${(trade.price * 100).toFixed(1)}%`} />
        <MiniMetric label="Shares" value={trade.shares.toFixed(2)} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 sm:flex-row sm:items-center">
      <p className="text-sm text-rose-100">{message}</p>
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
      {[1, 2].map((item) => (
        <div key={item} className="h-44 animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
