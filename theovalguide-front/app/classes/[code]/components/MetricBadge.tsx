"use client";

import { fmt1, isFiniteNumber } from "./ui-helpers";

export default function MetricBadge({ value }: { value: number | null | undefined }) {
  const text = fmt1(value);
  const muted = !isFiniteNumber(value);
  return (
    <div
      className={`grid h-16 w-16 place-items-center rounded-xl ${muted ? "bg-muted text-muted-foreground" : "bg-brand text-[var(--brand-contrast)]"}`}
    >
      <span className="text-xl font-bold">{text}</span>
    </div>
  );
}
