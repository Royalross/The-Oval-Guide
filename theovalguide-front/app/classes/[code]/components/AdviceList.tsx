"use client";

import Link from "next/link";

import type { ClassResult } from "../page";

type Advice = NonNullable<ClassResult["advices"]>[number];

export default function AdviceList({ advices }: { advices?: ClassResult["advices"] }) {
  if (!advices?.length) {
    return (
      <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Advice from Students</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to see and post advice for this course.
        </p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/auth/sign-in"
            className="border-border bg-card hover:bg-muted/70 rounded-md border px-3 py-1.5 text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="bg-brand hover:bg-brand-darker rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--brand-contrast)]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Advice from Students</h3>
      <div className="mt-3 space-y-3">
        {advices.map((a: Advice) => (
          <article key={a.id} className="border-border bg-card rounded-md border p-3">
            <p className="text-sm">{a.text}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              by {a.author} • {new Date(a.date).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
