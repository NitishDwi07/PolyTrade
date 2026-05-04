"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { placeTrade } from "@/lib/api";
import { formatCredits, formatPercent } from "@/lib/format";
import type { Market, TradeSide } from "@/lib/types";
import { resolveUserId } from "@/lib/user";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";

type TradingPanelProps = {
  market: Market;
  onTradeSuccess?: () => void;
};

const quickAmounts = [50, 100, 250, 500];

export function TradingPanel({ market, onTradeSuccess }: TradingPanelProps) {
  const [side, setSide] = useState<TradeSide>("YES");
  const [amount, setAmount] = useState("100");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const balance = useWalletStore((state) => state.balance);
  const setBalance = useWalletStore((state) => state.setBalance);

  const numericAmount = Number(amount) || 0;
  const selectedPrice = side === "YES" ? market.yesPrice : market.noPrice;
  const estimates = useMemo(() => {
    const shares = selectedPrice > 0 ? numericAmount / selectedPrice : 0;
    return {
      shares,
      payout: shares,
      remaining: Math.max(0, balance - numericAmount),
    };
  }, [balance, numericAmount, selectedPrice]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    if (!isAuthenticated) {
      setError("Please log in to place a trade.");
      return;
    }

    if (market.status !== "OPEN") {
      setError("Trading is disabled for this market.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await placeTrade({
        userId: resolveUserId(user),
        marketId: market.id,
        side,
        amount: numericAmount,
      });
      setBalance(result.newBalance);
      setSuccess(
        result.copySummary && result.copySummary.executed > 0
          ? `Trade placed. Copied to ${result.copySummary.executed} followers.`
          : "Trade placed successfully.",
      );
      onTradeSuccess?.();
    } catch (tradeError) {
      setError(tradeError instanceof Error ? tradeError.message : "Unable to place trade.");
    } finally {
      setIsSubmitting(false);
    }
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
                  setSuccess(null);
                  setError(null);
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
                setSuccess(null);
                setError(null);
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
                  setSuccess(null);
                  setError(null);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-300 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm">
          <SummaryRow label="Price" value={formatPercent(selectedPrice)} />
          <SummaryRow label="Estimated shares" value={estimates.shares.toFixed(2)} />
          <SummaryRow label="Max payout" value={`${estimates.payout.toFixed(2)} cr`} />
          <SummaryRow label="Remaining balance" value={`${formatCredits(estimates.remaining)} cr`} />
        </div>

        {isAuthenticated ? (
          <button
            type="submit"
            disabled={isSubmitting || market.status !== "OPEN"}
            className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Placing..." : market.status === "OPEN" ? "Place Trade" : "Market Closed"}
          </button>
        ) : (
          <Link href="/login" className="premium-button w-full justify-center">
            Log in to trade
          </Link>
        )}

        {success ? (
          <div className="flex items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
            {error}
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
