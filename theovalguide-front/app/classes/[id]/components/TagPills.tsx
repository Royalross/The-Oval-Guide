"use client";

import type { ClassResult } from "../page";

export default function TagPills({ tags }: { tags: ClassResult["tags"] }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Common tags</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.id}
            className="border-border bg-card hover:bg-muted/70 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
