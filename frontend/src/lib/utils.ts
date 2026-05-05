import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HalalStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function halalStatusLabel(status: HalalStatus): string {
  const map: Record<HalalStatus, string> = {
    halal: "Halal",
    borderline: "Borderline",
    monitor: "Monitor",
    "not-halal": "Not Halal",
    unknown: "Unknown",
  };
  return map[status];
}

export function halalStatusColors(status: HalalStatus): { bg: string; text: string } {
  const map: Record<HalalStatus, { bg: string; text: string }> = {
    halal: { bg: "bg-green-100", text: "text-green-700" },
    borderline: { bg: "bg-amber-100", text: "text-amber-700" },
    monitor: { bg: "bg-orange-100", text: "text-orange-700" },
    "not-halal": { bg: "bg-red-100", text: "text-red-700" },
    unknown: { bg: "bg-gray-100", text: "text-gray-600" },
  };
  return map[status];
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
