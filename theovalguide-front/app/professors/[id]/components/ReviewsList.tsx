"use client";

import ReviewItem from "./ReviewItem";

import type { ProfessorResult } from "../page";

export default function ReviewsList({ reviews }: { reviews: ProfessorResult["reviews"] }) {
  return (
    <section aria-label="Student reviews" className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button className="border-border bg-card hover:bg-muted/70 ring-brand rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none">
          Previous
        </button>
        <button className="bg-brand hover:bg-brand-darker ring-brand rounded-md px-3 py-1.5 text-sm text-[var(--brand-contrast)] focus:ring-2 focus:outline-none">
          Next
        </button>
      </div>
    </section>
  );
}
