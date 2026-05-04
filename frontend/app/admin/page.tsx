"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Flag,
  Lock,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { closeMarket, getAdminStats, getMarkets, resolveMarket } from "@/lib/api";
import { formatCredits } from "@/lib/mockData";
import type { AdminStats, Market, TradeSide } from "@/lib/types";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [statsData, marketData] = await Promise.all([getAdminStats(), getMarkets()]);
      setStats(statsData);
      setMarkets(marketData);
    } catch {
      setError("Unable to load market operations. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdmin();
  }, [loadAdmin]);

  async function handleClose(marketId: number) {
    setMessage(null);
    setError(null);
    try {
      await closeMarket(marketId);
      setMessage("Market closed successfully.");
      await loadAdmin();
    } catch {
      setError("Unable to close market.");
    }
  }

  async function handleResolve(marketId: number, winningSide: TradeSide) {
    setMessage(null);
    setError(null);
    try {
      await resolveMarket(marketId, { winningSide, resolvedBy: "admin" });
      setMessage("Market resolved successfully.");
      await loadAdmin();
    } catch {
      setError("Unable to resolve market.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Market operations"
        description="Manage lifecycle states and resolve outcomes with transparent virtual payouts."
      />
      <section className="section-container space-y-6 pb-16">
        {message ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        ) : null}

        {error ? <ErrorState message={error} onRetry={loadAdmin} /> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Users" value={formatCredits(stats?.users ?? 0)} detail="Active accounts" />
          <StatCard icon={BarChart3} label="Markets" value={formatCredits(stats?.markets ?? 0)} detail={`${formatCredits(stats?.openMarkets ?? 0)} open`} />
          <StatCard icon={Trophy} label="Resolved" value={formatCredits(stats?.resolvedMarkets ?? 0)} detail="Completed outcomes" />
          <StatCard icon={CircleDollarSign} label="Volume" value={`${formatCredits(stats?.totalVolume ?? 0)}`} detail={`${formatCredits(stats?.trades ?? 0)} trades`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-card p-5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">Copy relationships</p>
            <p className="mt-2 text-3xl font-semibold text-white">{formatCredits(stats?.copyRelationships ?? 0)}</p>
          </div>
          <div className="surface-card p-5">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-slate-500">Market states</p>
            <p className="mt-2 text-sm text-slate-300">
              {formatCredits(stats?.openMarkets ?? 0)} open · {formatCredits(stats?.resolvedMarkets ?? 0)} resolved
            </p>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          {isLoading ? (
            <LoadingRows />
          ) : markets.length > 0 ? (
            markets.map((market) => (
              <MarketAdminRow
                key={market.id}
                market={market}
                onClose={handleClose}
                onResolve={handleResolve}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="font-semibold text-white">No markets available</p>
              <p className="mt-2 text-sm text-slate-400">Markets will appear here when they are available.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function MarketAdminRow({
  market,
  onClose,
  onResolve,
}: {
  market: Market;
  onClose: (marketId: number) => Promise<void>;
  onResolve: (marketId: number, winningSide: TradeSide) => Promise<void>;
}) {
  const [isWorking, setIsWorking] = useState(false);

  async function run(action: () => Promise<void>) {
    setIsWorking(true);
    try {
      await action();
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <article className="border-b border-white/10 p-5 last:border-0">
      <div className="grid gap-5 xl:grid-cols-[1fr_360px] xl:items-center">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              {market.category}
            </span>
            <StatusBadge market={market} />
            {market.winningSide ? (
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                {market.winningSide} won
              </span>
            ) : null}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-white">{market.question}</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
            <Metric label="YES" value={`${(market.yesPrice * 100).toFixed(1)}%`} />
            <Metric label="NO" value={`${(market.noPrice * 100).toFixed(1)}%`} />
            <Metric label="Volume" value={`${formatCredits(market.totalVolume)} cr`} />
            <Metric label="Status" value={statusLabel(market.status)} />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => run(() => onClose(market.id))}
            disabled={isWorking || market.status !== "OPEN"}
            className="secondary-button justify-center px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Lock className="h-4 w-4" />
            Close
          </button>
          <button
            type="button"
            onClick={() => run(() => onResolve(market.id, "YES"))}
            disabled={isWorking || market.status === "RESOLVED"}
            className="premium-button justify-center px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Flag className="h-4 w-4" />
            YES
          </button>
          <button
            type="button"
            onClick={() => run(() => onResolve(market.id, "NO"))}
            disabled={isWorking || market.status === "RESOLVED"}
            className="secondary-button justify-center px-4 py-2 text-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Flag className="h-4 w-4" />
            NO
          </button>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ market }: { market: Market }) {
  const className =
    market.status === "OPEN"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : market.status === "CLOSED"
        ? "border-amber/20 bg-amber/10 text-amber"
        : "border-white/10 bg-white/[0.04] text-slate-400";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>
      {statusLabel(market.status)}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
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
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}

function statusLabel(status: Market["status"]) {
  if (status === "OPEN") return "Open";
  if (status === "CLOSED") return "Closed";
  return "Resolved";
}
