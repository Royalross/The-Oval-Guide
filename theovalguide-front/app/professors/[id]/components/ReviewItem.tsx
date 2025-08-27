"use client";

import type { ProfessorResult } from "../page";
import StarRow from "./StarRow";

export default function ReviewItem({
  review,
}: {
  review: ProfessorResult["reviews"][number];
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StarRow rating={review.rating} />
          <span className="text-xs text-muted-foreground">{review.course}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(review.date).toLocaleDateString()}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6">{review.comment}</p>
      {review.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t, i) => (
            <span
              key={i}
              className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px]"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-3 text-xs text-muted-foreground">
        by {review.author}
      </div>
    </article>
  );
}
