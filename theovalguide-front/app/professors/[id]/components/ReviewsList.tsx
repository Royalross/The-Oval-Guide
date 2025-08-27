"use client";

import type { ProfessorResult } from "../page";
import ReviewItem from "./ReviewItem";

export default function ReviewsList({
  reviews,
}: {
  reviews: ProfessorResult["reviews"];
}) {
  return (
    <section aria-label="Student reviews" className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button className="px-3 py-1.5 text-sm rounded-md border border-border bg-card hover:bg-muted/70 focus:outline-none focus:ring-2 ring-brand">
          Previous
        </button>
        <button className="px-3 py-1.5 text-sm rounded-md bg-brand hover:bg-brand-darker text-[var(--brand-contrast)] focus:outline-none focus:ring-2 ring-brand">
          Next
        </button>
      </div>
    </section>
  );
}
