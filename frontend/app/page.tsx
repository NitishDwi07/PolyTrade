import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Copy,
  LineChart,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
  WalletCards,
} from "lucide-react";
import { formatCredits, markets, traders } from "@/lib/mockData";

const problemCards = [
  {
    title: "Pricing feels complex",
    description: "Probability, volume, and conviction should be easy to understand at a glance.",
  },
  {
    title: "New users lack guidance",
    description: "Beginners need a clear path before placing their first independent trade.",
  },
  {
    title: "Good traders are hard to discover",
    description: "Trader performance should be visible before users decide who to follow.",
  },
];

const steps = [
  "Find a trader",
  "Set your copy ratio",
  "Mirror future trades automatically",
];

const features = [
  {
    title: "YES/NO markets",
    description: "Trade on clear binary outcomes with live probability movement.",
    icon: BarChart3,
  },
  {
    title: "Copy trading",
    description: "Follow skilled traders and mirror their positions automatically.",
    icon: SlidersHorizontal,
  },
  {
    title: "Trader leaderboard",
    description: "Discover top performers ranked by PnL, win rate, and followers.",
    icon: Trophy,
  },
  {
    title: "Virtual wallet",
    description: "Practice with credits while tracking every debit, trade, and payout.",
    icon: WalletCards,
  },
  {
    title: "Portfolio tracking",
    description: "Monitor open positions, exposure, and realized outcomes in one place.",
    icon: LineChart,
  },
  {
    title: "Admin resolution",
    description: "Markets can be closed and resolved with transparent virtual payouts.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  const market = markets[1];

  return (
    <div>
      <section className="section-container grid gap-12 py-16 lg:grid-cols-[1fr_0.92fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Prediction markets, simplified</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
            Copy top traders in{" "}
            <span className="gradient-text">prediction markets.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Discover high-performing traders, follow their market moves, and automatically
            mirror trades with virtual credits.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/markets" className="premium-button">
              Start trading
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/leaderboard" className="secondary-button">
              View leaderboard
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value="1,000" label="starter credits" />
            <HeroStat value={String(markets.length)} label="YES/NO markets" />
            <HeroStat value="Live" label="copy controls" />
            <HeroStat value="Real-time" label="portfolio tracking" />
          </div>
        </div>

        <HeroPreview market={market} />
      </section>

      <section className="section-container py-10">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">The challenge</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Prediction markets are powerful, but hard to start.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {problemCards.map((card) => (
            <article key={card.title} className="surface-card p-6">
              <h2 className="text-lg font-semibold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container py-14">
        <div className="glass-panel p-6 sm:p-8">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">Solution</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              PolyTrade turns expert activity into an onboarding path.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <span className="text-sm font-semibold text-cyan-300">0{index + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container pb-20 pt-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Features</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Built for simple, confident market participation.
            </h2>
          </div>
          <Link href="/markets" className="secondary-button">
            Explore markets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="surface-card p-5">
                <Icon className="h-5 w-5 text-cyan-300" />
                <h3 className="mt-4 text-base font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function HeroPreview({ market }: { market: (typeof markets)[number] }) {
  return (
    <div className="glass-panel p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Live market</p>
          <h2 className="mt-2 text-2xl font-semibold leading-8 text-white">{market.question}</h2>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Open
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <PreviewBar label="YES" value={market.yesPrice} tone="yes" />
        <PreviewBar label="NO" value={market.noPrice} tone="no" />
      </div>

      <div className="soft-divider my-6" />

      <div className="grid gap-3 sm:grid-cols-3">
        <PreviewMetric label="Wallet" value="1,000" />
        <PreviewMetric label="Volume" value={formatCredits(market.totalVolume)} />
        <PreviewMetric label="Traders" value={formatCredits(market.participants)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">{traders[0].name}</p>
            <p className="mt-1 text-xs text-slate-500">Copied YES trade at {traders[0].copyRatio}</p>
          </div>
          <span className="text-sm font-semibold text-emerald-300">{traders[0].pnl}</span>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.13em] text-slate-500">{label}</p>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function PreviewBar({
  label,
  value,
  tone,
}: {
  label: "YES" | "NO";
  value: number;
  tone: "yes" | "no";
}) {
  const fill = tone === "yes" ? "from-emerald-400 to-cyan-300" : "from-rose-400 to-violet-300";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${fill}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
