import type { MarketStatus, TradeSide } from "@/lib/types";

export function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  const percent = value <= 1 ? value * 100 : value;
  return `${percent.toFixed(digits)}%`;
}

export function formatDateTime(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function statusLabel(status: MarketStatus) {
  if (status === "OPEN") return "Open";
  if (status === "CLOSED") return "Closed";
  return "Resolved";
}

export function sideTone(side: TradeSide) {
  return side === "YES" ? "text-emerald-300" : "text-rose-300";
}
