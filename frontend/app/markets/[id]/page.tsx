"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Clock3, Copy, RefreshCw, Trophy, WalletCards } from "lucide-react";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { TradingPanel } from "@/components/TradingPanel";
import { getMarket, getMarketTrades } from "@/lib/api";
import { formatCredits } from "@/lib/mockData";
import type { Market, MarketTrade } from "@/lib/types";

const statusClasses = {
  OPEN: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  CLOSED: "border-amber/20 bg-amber/10 text-amber",
  RESOLVED: "border-white/10 bg-white/[0.04] text-slate-400",
};

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const [market, setMarket] = useState<Market | null>(null);
  const [trades, setTrades] = useState<MarketTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const loadMarket = useCallback(async () => {
    if (!params.id) return;

    setIsLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const [marketData, tradeData] = await Promise.all([
        getMarket(params.id),
        getMarketTrades(params.id, 25),
      ]);
      setMarket(marketData);
      setTrades(tradeData.trades);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "";
      if (message.toLowerCase().includes("not found")) {
        setNotFound(true);
      } else {
        setError("Unable to load this market. Please make sure the server is running.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void loadMarket();
  }, [loadMarket]);

  const chartData = useMemo(() => (market ? probabilityData(market, trades) : []), [market, trades]);

  if (isLoading) {
    return (
      <div className="section-container pb-20 pt-10">
        <div className="glass-panel p-8 text-sm text-slate-300">Loading market...</div>
      </div>
    );
  }

  if (notFound || !market) {
    return (
      <div className="section-container pb-20 pt-10">
        <div className="glass-panel p-8">
          <p className="text-lg font-semibold text-white">Market not found</p>
          <p className="mt-2 text-sm text-slate-400">This market may have been removed or is unavailable.</p>
        </div>
      </div>
    );
  }

  const yesPercent = toPercent(market.yesPrice);
  const noPercent = toPercent(market.noPrice);

  return (
    <div className="section-container pb-20 pt-10">
      {error ? (
        <div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-rose-100">{error}</p>
          <button type="button" onClick={loadMarket} className="secondary-button self-start px-4 py-2 sm:self-auto">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : null}

      <section className="glass-panel p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge>{market.category}</Badge>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[market.status]}`}>
            {statusLabel(market.status)}
          </span>
          {market.winningSide ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
              <Trophy className="h-3.5 w-3.5" />
              {market.winningSide} resolved
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDate(market.closesAt) ?? "No close time set"}
          </span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {market.question}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{market.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeaderMetric label="YES" value={`${yesPercent.toFixed(1)}%`} tone="yes" />
            <HeaderMetric label="NO" value={`${noPercent.toFixed(1)}%`} tone="no" />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard icon={WalletCards} label="Total volume" value={`${formatCredits(market.totalVolume)} cr`} />
            <MetricCard icon={Copy} label="Recent trades" value={formatCredits(trades.length)} />
          </div>

          <div className="surface-card p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">Probability</h2>
              <p className="mt-1 text-sm text-slate-500">YES probability movement from recent market activity.</p>
            </div>
            <ProbabilityChart data={chartData} />
          </div>

          <RecentTrades trades={trades} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <TradingPanel market={market} onTradeSuccess={loadMarket} />
          <PositionSummary />
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
      {children}
    </span>
  );
}

function HeaderMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "yes" | "no";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={tone === "yes" ? "mt-1 text-lg font-semibold text-emerald-300" : "mt-1 text-lg font-semibold text-rose-300"}>
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof WalletCards;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-card p-5">
      <Icon className="h-5 w-5 text-cyan-300" />
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function PositionSummary() {
  return (
    <div className="surface-card p-5">
      <h2 className="text-lg font-semibold text-white">Your position</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Trades placed here will appear in your portfolio as the account view rolls forward.
      </p>
    </div>
  );
}

function RecentTrades({ trades }: { trades: MarketTrade[] }) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <p className="mt-1 text-sm text-slate-500">Latest manual and copied trades.</p>
      </div>
      <div className="space-y-2">
        {trades.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
            No trades yet.
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade.id}
              className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm sm:grid-cols-[1fr_64px_96px_72px] sm:items-center"
            >
              <div>
                <p className="font-medium text-white">{trade.name || trade.username || `User #${trade.userId}`}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  {formatDateTime(trade.createdAt)}
                  {trade.isCopied ? (
                    <span className="inline-flex items-center gap-1 text-cyan-300">
                      <Copy className="h-3 w-3" />
                      copied
                    </span>
                  ) : null}
                </p>
              </div>
              <p className={trade.side === "YES" ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}>
                {trade.side}
              </p>
              <p className="text-slate-300">{formatCredits(trade.amount)} cr</p>
              <p className="text-slate-400">{toPercent(trade.price).toFixed(1)}%</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function toPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}

function statusLabel(status: Market["status"]) {
  if (status === "OPEN") return "Open";
  if (status === "CLOSED") return "Closed";
  return "Resolved";
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function probabilityData(market: Market, trades: MarketTrade[]) {
  const current = toPercent(market.yesPrice);
  const history = trades
    .slice(0, 5)
    .reverse()
    .map((trade, index) => {
      const pressure = trade.side === "YES" ? index + 1 : -(index + 1);
      const yes = Math.max(1, Math.min(99, current - pressure));
      return {
        time: formatDateTime(trade.createdAt),
        yes,
        no: 100 - yes,
      };
    });

  return [
    ...history,
    {
      time: "Now",
      yes: current,
      no: 100 - current,
    },
  ];
}
