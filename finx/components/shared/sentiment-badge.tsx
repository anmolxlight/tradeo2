"use client";

import { cn } from "@/lib/utils";

export function SentimentBadge({ sentiment }: { sentiment: "Bullish" | "Bearish" | "Neutral" | string }) {
  const color = sentiment === "Bullish" ? "bg-green-500/15 text-green-600" : sentiment === "Bearish" ? "bg-red-500/15 text-red-600" : "bg-yellow-500/15 text-yellow-700";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", color)}>
      {sentiment}
    </span>
  );
}