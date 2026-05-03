import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { traders } from "@/lib/mockData";

export default function LeaderboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title="Discover traders worth following"
        description="Compare trader performance by PnL, win rate, followers, and preferred copy ratio."
      />
      <section className="section-container pb-16">
        <div className="glass-panel overflow-hidden">
          {traders.map((trader, index) => (
            <div
              key={trader.id}
              className="grid gap-4 border-b border-white/10 p-5 last:border-0 md:grid-cols-[80px_1fr_repeat(4,120px)] md:items-center"
            >
              <div className="flex items-center gap-2 text-cyan-300">
                <Trophy className="h-5 w-5" />
                <span className="font-bold">#{index + 1}</span>
              </div>
              <p className="font-semibold text-white">{trader.name}</p>
              <p className="text-sm text-slate-300">PnL {trader.pnl}</p>
              <p className="text-sm text-slate-300">Win {trader.winRate}</p>
              <p className="text-sm text-slate-300">{trader.followers} followers</p>
              <p className="text-sm text-slate-300">Copy {trader.copyRatio}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
