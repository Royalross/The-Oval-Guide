"use client";

import { fmt1, isFiniteNumber } from "@/app/classes/[code]/components/ui-helpers";

import StarRow from "./StarRow";

export default function OverallScore({
  name,
  dept,
  uni,
  overall,
}: {
  name: string;
  dept: string;
  uni: string;
  overall: number | null;
}) {
  const displayScore = fmt1(overall);
  const hasRating = isFiniteNumber(overall);
  const badgeLabel = hasRating
    ? `Overall rating ${displayScore} out of 5`
    : "Overall rating not available";

  return (
    <div className="border-border bg-card flex items-center gap-5 rounded-2xl border p-6 shadow-sm">
      <div
        className="bg-brand grid h-16 w-16 place-items-center rounded-xl text-[var(--brand-contrast)]"
        aria-label={badgeLabel}
      >
        <span className="text-xl font-bold" aria-hidden="true">
          {displayScore}
        </span>
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold md:text-2xl">{name}</h1>
        <p className="text-muted-foreground truncate text-sm">
          {dept} • {uni}
        </p>
        <div className="mt-1">
          <StarRow rating={overall} />
        </div>
      </div>
    </div>
  );
}
