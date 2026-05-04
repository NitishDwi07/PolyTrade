import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="surface-card p-5 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-300">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}
