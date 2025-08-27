"use client";

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
  overall: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-5">
      <div className="grid place-items-center h-16 w-16 rounded-xl bg-brand text-[var(--brand-contrast)]">
        <span className="text-xl font-bold">{overall.toFixed(1)}</span>
      </div>
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold truncate">{name}</h1>
        <p className="text-sm text-muted-foreground truncate">
          {dept} • {uni}
        </p>
        <div className="mt-1">
          <StarRow rating={overall} />
        </div>
      </div>
    </div>
  );
}
