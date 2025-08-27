"use client";

import StarRow from "./StarRow";

import type { ProfessorResult } from "../page";

export default function ReviewItem({ review }: { review: ProfessorResult["reviews"][number] }) {
  return (
    <article className="border-border bg-card rounded-xl border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StarRow rating={review.rating} />
          <span className="text-muted-foreground text-xs">{review.course}</span>
        </div>
        <span className="text-muted-foreground text-xs">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6">{review.comment}</p>
      {review.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t, i) => (
            <span key={i} className="bg-muted/60 rounded-full px-2 py-0.5 text-[11px]">
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <div className="text-muted-foreground mt-3 text-xs">by {review.author}</div>
    </article>
  );
}
