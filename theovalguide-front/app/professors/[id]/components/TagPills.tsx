"use client";

import type { ProfessorResult } from "../page";

export default function TagPills({ tags }: { tags: ProfessorResult["tags"] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Common tags</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium hover:bg-muted/70"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
