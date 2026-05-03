"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Market } from "@/lib/mockData";
import { formatCredits } from "@/lib/mockData";
import { useWalletStore } from "@/store/walletStore";

type TradingPanelProps = {
  market: Market;
};

const quickAmounts = [50, 100, 250, 500];

export function TradingPanel({ market }: TradingPanelProps) {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("100");
  const [success, setSuccess] = useState(false);
  const balance = useWalletStore((state) => state.balance);

  const numericAmount = Number(amount) || 0;
  const selectedPrice = side === "YES" ? market.yesPrice : market.noPrice;
  const estimates = useMemo(() => {
    const shares = selectedPrice > 0 ? numericAmount / (selectedPrice / 100) : 0;
    return {
      shares,
      payout: shares,
      remaining: Math.max(0, balance - numericAmount),
    };
  }, [balance, numericAmount, selectedPrice]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(true);
  }

  return (
    <aside className="glass-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Order ticket</h2>
          <p className="mt-1 text-sm text-slate-500">Virtual credit order</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Balance</p>
          <p className="text-sm font-semibold text-white">{formatCredits(balance)} cr</p>
        </div>
      </div>

      <form className="mt-5 space-y-5" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-1">
          {(["YES", "NO"] as const).map((option) => {
            const active = side === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSide(option);
                  setSuccess(false);
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                  active
                    ? option === "YES"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-rose-400 text-slate-950"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300" htmlFor="trade-amount">
            Amount
          </label>
          <div className="premium-input mt-2 flex items-center px-4">
            <input
              id="trade-amount"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setSuccess(false);
              }}
              inputMode="decimal"
              className="w-full bg-transparent py-3.5 text-lg font-semibold text-white outline-none placeholder:text-slate-600"
              placeholder="100"
            />
            <span className="text-sm text-slate-500">credits</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(String(value));
                  setSuccess(false);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-300 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm">
          <SummaryRow label="Price" value={`${selectedPrice}%`} />
          <SummaryRow label="Estimated shares" value={estimates.shares.toFixed(2)} />
          <SummaryRow label="Max payout" value={`${estimates.payout.toFixed(2)} cr`} />
          <SummaryRow label="Remaining balance" value={`${formatCredits(estimates.remaining)} cr`} />
        </div>

        <button type="submit" className="premium-button w-full">
          Place Trade
        </button>

        {success ? (
          <div className="flex items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {side} trade prepared for {numericAmount || 0} demo credits.
            </span>
          </div>
        ) : null}

        <p className="text-xs leading-5 text-slate-500">Demo credits only. No real money.</p>
      </form>
    </aside>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2 first:pt-0 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
