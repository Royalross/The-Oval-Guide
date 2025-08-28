"use client";

import type { ProfessorResult } from "@/app/professors/[slug]/schema";

import ReviewItem from "./ReviewItem";

export default function ReviewsList({ reviews }: { reviews: ProfessorResult["reviews"] }) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <section aria-label="Student reviews">
        <div className="border-border bg-card text-muted-foreground rounded-2xl border p-4 text-sm">
          No reviews yet.
        </div>
      </section>
    );
  }

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
