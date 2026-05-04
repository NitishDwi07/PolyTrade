"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CircleDollarSign, RefreshCw, Tags } from "lucide-react";
import { MarketsFeed } from "@/components/MarketsFeed";
import { getMarkets } from "@/lib/api";
import { formatCredits } from "@/lib/format";
import { markets as mockMarkets } from "@/lib/mockData";
import type { Market } from "@/lib/types";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMarkets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMarkets();
      setMarkets(data);
    } catch {
      setMarkets(toBackendMarkets(mockMarkets));
      setError("Unable to load markets. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarkets();
  }, [loadMarkets]);

  const stats = useMemo(() => {
    const totalVolume = markets.reduce((sum, market) => sum + market.totalVolume, 0);
    const openMarkets = markets.filter((market) => market.status === "OPEN").length;
    const categories = new Set(markets.map((market) => market.category)).size;

    return { totalVolume, openMarkets, categories };
  }, [markets]);

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
            <FeedStat icon={CircleDollarSign} label="Volume" value={formatCredits(stats.totalVolume)} />
            <FeedStat icon={BarChart3} label="Open" value={String(stats.openMarkets)} />
            <FeedStat icon={Tags} label="Categories" value={String(stats.categories)} />
          </div>
        </div>
      </section>

      <section className="section-container pb-2">
        {isLoading ? (
          <div className="glass-panel p-5 text-sm text-slate-300">Loading markets...</div>
        ) : error ? (
          <div className="glass-panel flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-300">{error}</p>
            <button type="button" onClick={loadMarkets} className="secondary-button self-start px-4 py-2 sm:self-auto">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : null}
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

function toBackendMarkets(markets: typeof mockMarkets): Market[] {
  return markets.map((market, index) => ({
    id: index + 1,
    question: market.question,
    description: market.description,
    category: market.category,
    status: market.status === "Resolved" ? "RESOLVED" : "OPEN",
    yesVolume: market.yesVolume,
    noVolume: market.noVolume,
    totalVolume: market.totalVolume,
    yesPrice: market.yesPrice / 100,
    noPrice: market.noPrice / 100,
    closesAt: null,
    winningSide: null,
    resolvedAt: null,
  }));
}
