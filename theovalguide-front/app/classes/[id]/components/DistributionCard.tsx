"use client";

import { formatPct } from "./ui-helpers";

export type Bucket = { label: string; count: number };

export default function DistributionCard({
  title,
  total,
  buckets,
}: {
  title: string;
  total: number;
  buckets: Bucket[];
}) {
  const safeTotal = total > 0 ? total : 0;
  const max = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {buckets.map((b, i) => {
          const pct = safeTotal ? (b.count / safeTotal) * 100 : 0;
          return (
            <li key={`${b.label}-${i}`} className="grid grid-cols-12 items-center gap-2">
              <span className="text-muted-foreground col-span-1 text-xs tabular-nums">
                {b.label}
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
      <p className="text-muted-foreground mt-3 text-xs">{safeTotal} ratings</p>
    </div>
  );
}
