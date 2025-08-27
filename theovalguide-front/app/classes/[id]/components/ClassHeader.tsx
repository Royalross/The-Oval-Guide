"use client";

import MetricBadge from "./MetricBadge";
import StarRow from "./StarRow";

export default function ClassHeader({
  code,
  title,
  dept,
  uni,
  difficulty,
}: {
  code: string;
  title: string;
  dept: string;
  uni: string;
  difficulty: number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-5">
      <MetricBadge value={difficulty} />
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold truncate">
          {code} • {title}
        </h1>
        <p className="text-sm text-muted-foreground truncate">
          {dept} • {uni}
        </p>
        <div className="mt-1">
          <StarRow rating={difficulty} />
        </div>
      </div>
    </div>
  );
}
