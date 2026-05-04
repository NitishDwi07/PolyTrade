import { PageHeader } from "@/components/PageHeader";
import { portfolioPositions } from "@/lib/mockData";

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Track positions and portfolio PnL"
        description="Monitor open positions, exposure, and performance across your virtual market activity."
      />
      <section className="section-container pb-16">
        <div className="glass-panel overflow-hidden">
          {portfolioPositions.map((position) => (
            <div
              key={position.id}
              className="grid gap-3 border-b border-white/10 p-5 last:border-0 md:grid-cols-[1fr_100px_120px_100px]"
            >
              <p className="font-semibold text-white">{position.market}</p>
              <p className="text-sm text-slate-300">{position.side}</p>
              <p className="text-sm text-slate-300">{position.exposure} credits</p>
              <p className="text-sm font-semibold text-cyan-300">{position.pnl}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
