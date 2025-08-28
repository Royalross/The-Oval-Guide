"use client";

import type { ProfessorResult } from "@/app/professors/[slug]/schema";

function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

export default function RatingDistribution({
  total,
  buckets,
}: {
  total: number;
  buckets: ProfessorResult["buckets"];
}) {
  const max = Math.max(...buckets.map((b) => b.count), 1);
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Rating distribution</h3>
      <ul className="mt-3 space-y-2">
        {buckets.map((b, i) => {
          const pct = total ? (b.count / total) * 100 : 0;
          return (
            <li key={`${b.label}-${i}`} className="grid grid-cols-12 items-center gap-2">
              <span className="text-muted-foreground col-span-1 text-xs tabular-nums">
                {b.label}★
              </span>
              <div className="bg-muted/60 col-span-9 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-brand h-full"
                  style={{ width: `${Math.max((b.count / max) * 100, 4)}%` }}
                  aria-hidden
                />
              </div>
              <span className="text-muted-foreground col-span-2 text-right text-xs tabular-nums">
                {formatPct(pct)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground mt-3 text-xs">{total} ratings</p>
    </div>
  );
}
