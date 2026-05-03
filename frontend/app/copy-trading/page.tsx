import { Copy, Pause, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { traders } from "@/lib/mockData";

export default function CopyTradingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Copy Trading"
        title="Follow traders and set copy ratios"
        description="Choose skilled traders, set your preferred copy ratio, and manage active follow relationships."
      />
      <section className="section-container grid gap-5 pb-16 lg:grid-cols-3">
        {traders.map((trader) => (
          <article key={trader.id} className="surface-card p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-300">
              <Copy className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-white">{trader.name}</h2>
            <p className="mt-2 text-sm text-slate-300">
              Suggested copy ratio: {trader.copyRatio}. Adjust your exposure before following.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="premium-button px-4 py-2">
                <SlidersHorizontal className="h-4 w-4" />
                Configure
              </button>
              <button className="secondary-button px-4 py-2">
                <Pause className="h-4 w-4" />
                Pause
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
