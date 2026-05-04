"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import type { Market, MarketCategory } from "@/lib/mockData";
import { marketCategories } from "@/lib/mockData";

type MarketsFeedProps = {
  markets: Market[];
};

export function MarketsFeed({ markets }: MarketsFeedProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketCategory | "All">("All");

  const filteredMarkets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return markets.filter((market) => {
      const matchesCategory = category === "All" || market.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        market.question.toLowerCase().includes(normalizedQuery) ||
        market.description.toLowerCase().includes(normalizedQuery) ||
        market.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, markets, query]);

  return (
    <section className="section-container pb-20">
      <div className="glass-panel p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block" htmlFor="market-search">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="market-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search markets"
              className="premium-input w-full py-3 pl-11 pr-4 text-sm"
            />
          </label>

          <div className="flex gap-2 overflow-x-auto">
            {(["All", ...marketCategories] as Array<MarketCategory | "All">).map((item) => {
              const active = item === category;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-2xl border px-3.5 py-2 text-sm font-medium transition duration-200 ${
                    active
                      ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 ? (
        <div className="surface-card mt-6 p-10 text-center">
          <p className="text-base font-medium text-white">No markets found</p>
          <p className="mt-2 text-sm text-slate-400">Try a different search or category filter.</p>
        </div>
      ) : null}
    </section>
  );
}
