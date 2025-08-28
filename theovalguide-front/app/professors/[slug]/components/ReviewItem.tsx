"use client";

import type { ProfessorResult } from "@/app/professors/[slug]/schema";

import StarRow from "./StarRow";

export default function ReviewItem({ review }: { review: ProfessorResult["reviews"][number] }) {
  const rating = typeof review.rating === "number" ? review.rating : 0;
  const course = review.course ?? "";
  const author = review.author ?? "Anonymous";
  const dateStr = new Date(review.date).toLocaleDateString();
  const comment = review.comment ?? "";

  return (
    <article className="border-border bg-card rounded-xl border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <StarRow rating={rating} />
          {course ? <span className="text-muted-foreground truncate text-xs">{course}</span> : null}
        </div>
        <span className="text-muted-foreground text-xs">{dateStr}</span>
      </div>

      {comment && <p className="mt-2 text-sm leading-6 whitespace-pre-wrap">{comment}</p>}

      {Array.isArray(review.tags) && review.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((t, i) => (
            <span key={i} className="bg-muted/60 rounded-full px-2 py-0.5 text-[11px]">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="text-muted-foreground mt-3 text-xs">by {author}</div>
    </article>
  );
}
