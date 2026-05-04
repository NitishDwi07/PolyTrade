import { BarChart3, CircleDollarSign, Users } from "lucide-react";
import { MarketsFeed } from "@/components/MarketsFeed";
import { formatCredits, markets } from "@/lib/mockData";

export default function MarketsPage() {
  const totalVolume = markets.reduce((sum, market) => sum + market.totalVolume, 0);
  const openMarkets = markets.filter((market) => market.status !== "Resolved").length;
  const activeTraders = markets.reduce((sum, market) => sum + market.participants, 0);

  return (
    <>
      <section className="section-container pb-8 pt-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow">Markets</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              A cleaner feed for trading outcome probabilities.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-400">
              Search markets, filter by category, and open a focused order ticket for
              virtual-credit YES/NO trades.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <FeedStat icon={CircleDollarSign} label="Volume" value={formatCredits(totalVolume)} />
            <FeedStat icon={BarChart3} label="Open" value={String(openMarkets)} />
            <FeedStat icon={Users} label="Traders" value={formatCredits(activeTraders)} />
          </div>
        </div>
      </section>

      <MarketsFeed markets={markets} />
    </>
  );
}

function FeedStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-card p-4">
      <Icon className="h-4 w-4 text-cyan-300" />
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
