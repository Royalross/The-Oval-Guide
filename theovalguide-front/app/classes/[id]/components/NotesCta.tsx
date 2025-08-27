"use client";

import Link from "next/link";

export default function NotesCta({ hasNotes }: { hasNotes: boolean }) {
  if (!hasNotes) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Shared Notes</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view and upload notes for this course.
        </p>
        <div className="mt-3">
          <Link
            href="/auth/sign-in"
            className="px-3 py-1.5 rounded-md bg-brand hover:bg-brand-darker text-[var(--brand-contrast)] text-sm font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }
  return null;
}
