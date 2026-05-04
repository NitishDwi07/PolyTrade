"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CircleDollarSign, RefreshCw, TrendingUp, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { getPortfolio } from "@/lib/api";
import { formatCredits, formatPercent } from "@/lib/format";
import type { PortfolioPosition, PortfolioResponse } from "@/lib/types";
import { resolveUserId } from "@/lib/user";
import { useAuthStore } from "@/store/authStore";

export default function PortfolioPage() {
  const user = useAuthStore((state) => state.user);
  const userId = resolveUserId(user);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getPortfolio(userId);
      setPortfolio(data);
    } catch {
      setError("Unable to load portfolio. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  const stats = useMemo(() => {
    const positions = portfolio?.positions ?? [];
    const totalInvested = positions.reduce((sum, position) => sum + position.investedAmount, 0);
    const estimatedValue = positions.reduce((sum, position) => sum + position.estimatedValue, 0);
    const openPnl = positions.reduce((sum, position) => sum + position.openPnl, 0);

    return {
      totalInvested,
      estimatedValue,
      openPnl,
    };
  }, [portfolio]);

  const openPositions = portfolio?.positions.filter((position) => !position.settled) ?? [];
  const settledPositions = portfolio?.positions.filter((position) => position.settled) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Track positions and portfolio PnL"
        description="Monitor open positions, exposure, and performance across your virtual market activity."
      />
      <section className="section-container pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={WalletCards} label="Wallet balance" value={`${formatCredits(portfolio?.balance ?? 0)}`} detail="Available credits" />
          <StatCard icon={CircleDollarSign} label="Total invested" value={`${formatCredits(stats.totalInvested)}`} detail="Across all positions" />
          <StatCard icon={BarChart3} label="Estimated value" value={`${formatCredits(stats.estimatedValue)}`} detail="Marked to current prices" />
          <StatCard
            icon={TrendingUp}
            label="Open PnL"
            value={`${stats.openPnl >= 0 ? "+" : ""}${formatCredits(stats.openPnl)}`}
            detail="Unsettled positions"
          />
        </div>

        <div className="mt-6 glass-panel overflow-hidden">
          {isLoading ? (
            <LoadingRows />
          ) : error ? (
            <ErrorState message={error} onRetry={loadPortfolio} />
          ) : openPositions.length > 0 ? (
            openPositions.map((position) => <PositionRow key={`${position.marketId}-${position.side}`} position={position} />)
          ) : (
            <EmptyState title="No open positions" description="Place a trade from any open market to start building your portfolio." />
          )}
        </div>

        {!isLoading && !error && settledPositions.length > 0 ? (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-white">Settled positions</h2>
            <div className="glass-panel overflow-hidden">
              {settledPositions.map((position) => (
                <PositionRow key={`${position.marketId}-${position.side}-settled`} position={position} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

function PositionRow({ position }: { position: PortfolioPosition }) {
  const positive = position.openPnl >= 0;

  return (
    <div className="border-b border-white/10 p-5 last:border-0">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className={position.side === "YES" ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300" : "rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300"}>
              {position.side}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
              {position.settled ? "Settled" : "Open"}
            </span>
          </div>
          <p className="mt-3 text-base font-semibold text-white">{position.marketQuestion}</p>
        </div>
        <div className="text-left lg:text-right">
          <p className={positive ? "text-lg font-semibold text-emerald-300" : "text-lg font-semibold text-rose-300"}>
            {positive ? "+" : ""}
            {formatCredits(position.openPnl)} cr
          </p>
          <p className="mt-1 text-xs text-slate-500">Open PnL</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Shares" value={position.shares.toFixed(2)} />
        <Metric label="Average price" value={formatPercent(position.averagePrice)} />
        <Metric label="Invested" value={`${formatCredits(position.investedAmount)} cr`} />
        <Metric label="Current price" value={formatPercent(position.currentPrice)} />
        <Metric label="Est. value" value={`${formatCredits(position.estimatedValue)} cr`} />
        <Metric label="Payout" value={position.payout === null ? "-" : `${formatCredits(position.payout)} cr`} />
      </div>
    </div>
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
    <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
      <p className="text-sm text-slate-300">{message}</p>
      <button type="button" onClick={onRetry} className="secondary-button self-start px-4 py-2 sm:self-auto">
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-1 p-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}
