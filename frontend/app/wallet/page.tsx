"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Clock3, RefreshCw, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getUserTrades, getWallet } from "@/lib/api";
import { formatCredits, formatDateTime, formatPercent } from "@/lib/format";
import type { UserTrade, WalletResponse, WalletTransaction } from "@/lib/types";
import { resolveUserId } from "@/lib/user";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";

export default function WalletPage() {
  const user = useAuthStore((state) => state.user);
  const setBalance = useWalletStore((state) => state.setBalance);
  const userId = resolveUserId(user);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [trades, setTrades] = useState<UserTrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [walletData, tradeData] = await Promise.all([getWallet(userId), getUserTrades(userId, 8)]);
      setWallet(walletData);
      setTrades(tradeData.trades);
      setBalance(walletData.balance);
    } catch {
      setError("Unable to load wallet. Please make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  }, [setBalance, userId]);

  useEffect(() => {
    void loadWallet();
  }, [loadWallet]);

  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Virtual credits and ledger history"
        description="Track available credits, reserved exposure, and every virtual debit or payout."
      />
      <section className="section-container grid gap-6 pb-16 lg:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <WalletCards className="h-8 w-8 text-cyan-300" />
            <p className="mt-5 text-sm text-slate-400">Available balance</p>
            <p className="mt-1 text-4xl font-black text-white">
              {isLoading ? "..." : `${formatCredits(wallet?.balance ?? 0)} credits`}
            </p>
            <p className="mt-3 text-sm text-slate-300">Credits update after every trade and payout.</p>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-lg font-semibold text-white">Recent trades</h2>
            <div className="mt-4 space-y-3">
              {trades.length === 0 ? (
                <p className="text-sm text-slate-400">No trades yet.</p>
              ) : (
                trades.map((trade) => <TradeRow key={trade.id} trade={trade} />)
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          {isLoading ? (
            <LoadingRows />
          ) : error ? (
            <ErrorState message={error} onRetry={loadWallet} />
          ) : wallet && wallet.transactions.length > 0 ? (
            wallet.transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="p-6 text-sm text-slate-400">No wallet activity yet.</div>
          )}
        </div>
      </section>
    </>
  );
}

function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const positive = transaction.amount >= 0;
  const Icon = positive ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="grid gap-3 border-b border-white/10 p-5 last:border-0 md:grid-cols-[1fr_140px_120px] md:items-center">
      <div>
        <p className="font-semibold text-white">{transaction.description || transactionLabel(transaction.type)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5" />
          {formatDateTime(transaction.createdAt)}
        </p>
      </div>
      <p className="text-sm text-slate-300">{transactionLabel(transaction.type)}</p>
      <p className={`flex items-center gap-1 text-sm font-semibold ${positive ? "text-emerald-300" : "text-rose-300"}`}>
        <Icon className="h-4 w-4" />
        {positive ? "+" : "-"}
        {formatCredits(Math.abs(transaction.amount))}
      </p>
    </div>
  );
}

function TradeRow({ trade }: { trade: UserTrade }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 text-sm font-medium text-white">{trade.marketQuestion}</p>
        <span className={trade.side === "YES" ? "text-sm font-semibold text-emerald-300" : "text-sm font-semibold text-rose-300"}>
          {trade.side}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span>{formatCredits(trade.amount)} credits</span>
        <span>{formatPercent(trade.price)}</span>
        <span>{trade.shares.toFixed(2)} shares</span>
        {trade.isCopied ? <span className="text-cyan-300">Copied</span> : null}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
      <p className="text-sm text-slate-300">{message}</p>
      <button type="button" onClick={onRetry} className="secondary-button self-start px-4 py-2 sm:self-auto">
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-1 p-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" />
      ))}
    </div>
  );
}

function transactionLabel(type: string) {
  const labels: Record<string, string> = {
    STARTER_CREDIT: "Starter credit",
    TRADE_DEBIT: "Trade",
    PAYOUT: "Payout",
    REFUND: "Refund",
    CREDIT: "Credit",
    DEBIT: "Debit",
  };

  return labels[type] ?? "Activity";
}
