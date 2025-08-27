"use client";

import Link from "next/link";
import type { ClassResult } from "../page";

type Advice = NonNullable<ClassResult["advices"]>[number];

export default function AdviceList({
  advices,
}: {
  advices?: ClassResult["advices"];
}) {
  if (!advices?.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Advice from Students</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to see and post advice for this course.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/auth/sign-in"
            className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted/70 text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-3 py-1.5 rounded-md bg-brand hover:bg-brand-darker text-[var(--brand-contrast)] text-sm font-semibold"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Advice from Students</h3>
      <div className="mt-3 space-y-3">
        {advices.map((a: Advice) => (
          <article
            key={a.id}
            className="rounded-md border border-border bg-card p-3"
          >
            <p className="text-sm">{a.text}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              by {a.author} • {new Date(a.date).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
