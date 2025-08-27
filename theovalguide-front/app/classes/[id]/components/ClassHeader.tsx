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
    <div className="border-border bg-card flex items-center gap-5 rounded-2xl border p-6 shadow-sm">
      <MetricBadge value={difficulty} />
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold md:text-2xl">
          {code} • {title}
        </h1>
        <p className="text-muted-foreground truncate text-sm">
          {dept} • {uni}
        </p>
        <div className="mt-1">
          <StarRow rating={difficulty} />
        </div>
      </div>
    </div>
  );
}
