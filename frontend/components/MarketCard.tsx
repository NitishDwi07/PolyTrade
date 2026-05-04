import Link from "next/link";
import { ArrowRight, Clock3, Layers3 } from "lucide-react";
import { formatCredits, formatDateTime, formatPercent, statusLabel } from "@/lib/format";
import type { Market } from "@/lib/types";

type MarketCardProps = {
  market: Market;
};

const statusClasses = {
  OPEN: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  CLOSED: "border-amber/20 bg-amber/10 text-amber",
  RESOLVED: "border-white/10 bg-white/[0.04] text-slate-400",
};

export function MarketCard({ market }: MarketCardProps) {
  const yesPercent = toPercent(market.yesPrice);
  const noPercent = toPercent(market.noPrice);

  return (
    <article className="surface-card flex h-full min-h-[390px] flex-col p-5 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
          {market.category}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[market.status]}`}>
          {statusLabel(market.status)}
        </span>
      </div>

      <Link href={`/markets/${market.id}`} className="mt-5 block">
        <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-white transition duration-200 hover:text-cyan-200">
          {market.question}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{market.description}</p>
      </Link>

      <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <ProbabilityBar label="YES" value={yesPercent} tone="yes" />
        <ProbabilityBar label="NO" value={noPercent} tone="no" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <FooterMetric label="Volume" value={formatCredits(market.totalVolume)} />
        <FooterMetric label="Category" value={market.category} icon />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Clock3 className="h-3.5 w-3.5" />
        {formatDateTime(market.closesAt) ?? "No close time set"}
      </div>

      <Link href={`/markets/${market.id}`} className="secondary-button mt-auto w-full py-2.5">
        {market.status === "OPEN" ? "Trade now" : "View market"}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function ProbabilityBar({
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
        <span className="font-semibold text-white">{formatPercent(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${fill}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function FooterMetric({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 flex items-center gap-1 font-semibold text-white">
        {icon ? <Layers3 className="h-3.5 w-3.5 text-slate-500" /> : null}
        {value}
      </p>
    </div>
  );
}

function toPercent(value: number) {
  return value <= 1 ? value * 100 : value;
}
