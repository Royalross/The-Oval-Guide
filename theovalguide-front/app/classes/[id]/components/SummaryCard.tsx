"use client";

export default function SummaryCard({
  text,
  onRefresh,
}: {
  text: string;
  onRefresh?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">AI Summary of This Course</h3>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted/70 focus:outline-none focus:ring-2 ring-brand"
        >
          Refresh
        </button>
      </div>
      <p className="mt-3 text-sm leading-6 text-foreground">{text}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Summary is generated from student reviews and may contain inaccuracies.
      </p>
    </div>
  );
}
