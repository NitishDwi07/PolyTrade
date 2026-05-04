import { WalletCards } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { walletTransactions } from "@/lib/mockData";

export default function WalletPage() {
  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Virtual credits and ledger history"
        description="Track available credits, reserved exposure, and every virtual debit or payout."
      />
      <section className="section-container grid gap-6 pb-16 lg:grid-cols-[360px_1fr]">
        <div className="glass-panel p-6">
          <WalletCards className="h-8 w-8 text-cyan-300" />
          <p className="mt-5 text-sm text-slate-400">Available balance</p>
          <p className="mt-1 text-4xl font-black text-white">820 credits</p>
          <p className="mt-3 text-sm text-slate-300">180 credits reserved in open positions.</p>
        </div>
        <div className="glass-panel overflow-hidden">
          {walletTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="grid gap-3 border-b border-white/10 p-5 last:border-0 md:grid-cols-[1fr_120px_100px]"
            >
              <p className="font-semibold text-white">{transaction.label}</p>
              <p className="text-sm text-slate-300">{transaction.type}</p>
              <p className="text-sm font-semibold text-cyan-300">{transaction.amount}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
