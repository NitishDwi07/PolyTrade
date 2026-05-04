import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Clock3, Copy, TrendingDown, TrendingUp, Users, WalletCards } from "lucide-react";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { TradingPanel } from "@/components/TradingPanel";
import { formatCredits, markets, userPositions } from "@/lib/mockData";

type MarketDetailPageProps = {
  params: {
    id: string;
  };
};

const statusClasses = {
  Open: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  "Closing Soon": "border-amber/20 bg-amber/10 text-amber",
  Resolved: "border-white/10 bg-white/[0.04] text-slate-400",
};

export default function MarketDetailPage({ params }: MarketDetailPageProps) {
  const market = markets.find((item) => item.id === params.id);

  if (!market) {
    notFound();
  }

  const trendIsPositive = market.trend >= 0;
  const TrendIcon = trendIsPositive ? TrendingUp : TrendingDown;

  return (
    <div className="section-container pb-20 pt-10">
      <section className="glass-panel p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <Badge>{market.category}</Badge>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[market.status]}`}>
            {market.status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {market.closesAt}
          </span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {market.question}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{market.description}</p>
            <p className="mt-4 text-sm text-slate-500">Created by {market.createdBy}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <HeaderMetric label="YES" value={`${market.yesPrice}%`} tone="yes" />
            <HeaderMetric label="NO" value={`${market.noPrice}%`} tone="no" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs text-slate-500">Trend</p>
              <p
                className={`mt-1 flex items-center gap-1 text-lg font-semibold ${
                  trendIsPositive ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                <TrendIcon className="h-4 w-4" />
                {trendIsPositive ? "+" : ""}
                {market.trend}%
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard icon={WalletCards} label="Total volume" value={`${formatCredits(market.totalVolume)} cr`} />
            <MetricCard icon={Users} label="Participants" value={formatCredits(market.participants)} />
          </div>

          <div className="surface-card p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">Probability</h2>
              <p className="mt-1 text-sm text-slate-500">YES probability movement from recent market activity.</p>
            </div>
            <ProbabilityChart data={market.probabilityHistory} />
          </div>

          <RecentTrades trades={market.recentTrades} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <TradingPanel market={market} />
          <PositionSummary marketId={market.id} />
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

function PositionSummary({ marketId }: { marketId: string }) {
  const position = userPositions.find((item) => item.marketId === marketId);

  return (
    <div className="surface-card p-5">
      <h2 className="text-lg font-semibold text-white">Your position</h2>
      {position ? (
        <div className="mt-4 text-sm">
          <SummaryRow label="Side" value={position.side} />
          <SummaryRow label="Shares" value={position.shares.toFixed(2)} />
          <SummaryRow label="Average price" value={`${position.avgPrice}%`} />
          <SummaryRow label="Exposure" value={`${formatCredits(position.exposure)} cr`} />
          <SummaryRow
            label="Unrealized PnL"
            value={`${position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl} cr`}
          />
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-400">No open position on this market yet.</p>
      )}
    </div>
  );
}

function RecentTrades({ trades }: { trades: NonNullable<(typeof markets)[number]["recentTrades"]> }) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Recent activity</h2>
        <p className="mt-1 text-sm text-slate-500">Latest manual and copied trades.</p>
      </div>
      <div className="space-y-2">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm sm:grid-cols-[1fr_64px_96px_64px] sm:items-center"
          >
            <div>
              <p className="font-medium text-white">{trade.trader}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                {trade.time}
                {trade.copied ? (
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
            <p className="text-slate-400">{trade.price}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
