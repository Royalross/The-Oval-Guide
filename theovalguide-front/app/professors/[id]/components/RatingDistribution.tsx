"use client";

import type { ProfessorResult } from "../page";

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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Rating distribution</h3>
      <ul className="mt-3 space-y-2">
        {buckets.map((b, i) => {
          const pct = total ? (b.count / total) * 100 : 0;
          return (
            <li
              key={`${b.label}-${i}`}
              className="grid grid-cols-12 items-center gap-2"
            >
              <span className="col-span-1 text-xs tabular-nums text-muted-foreground">
                {b.label}★
              </span>
              <div className="col-span-9 h-2 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full bg-brand"
                  style={{ width: `${Math.max((b.count / max) * 100, 4)}%` }}
                  aria-hidden
                />
              </div>
              <span className="col-span-2 text-right text-xs tabular-nums text-muted-foreground">
                {formatPct(pct)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">{total} ratings</p>
    </div>
  );
}
