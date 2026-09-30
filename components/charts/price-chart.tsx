"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "chart.js/auto";

const Line = dynamic(() => import("react-chartjs-2").then(m => m.Line), { ssr: false });

export type PricePoint = { t: number; p: number };

export function PriceChart({ data, label }: { data: PricePoint[]; label: string }) {
  const chartData = useMemo(() => ({
    labels: data.map(d => new Date(d.t).toLocaleString()),
    datasets: [
      {
        label,
        data: data.map(d => d.p),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.25
      }
    ]
  }), [data, label]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: { legend: { display: false } },
    scales: { x: { display: true }, y: { display: true } }
  }), []);

  return (
    <div className="h-64 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}