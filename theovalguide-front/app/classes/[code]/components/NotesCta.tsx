"use client";

import Link from "next/link";

export default function NotesCta({ hasNotes }: { hasNotes: boolean }) {
  if (!hasNotes) {
    return (
      <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
        <h3 className="text-sm font-semibold">Shared Notes</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to view and upload notes for this course.
        </p>
        <div className="mt-3">
          <Link
            href="/auth/sign-in"
            className="bg-brand hover:bg-brand-darker rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--brand-contrast)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }
  return null;
}
