"use client";

export default function SummaryCard({ text, onRefresh }: { text: string; onRefresh?: () => void }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">AI Summary of Student Feedback</h3>
        <button
          type="button"
          onClick={onRefresh}
          className="border-border bg-card hover:bg-muted/70 ring-brand rounded-md border px-3 py-1.5 text-xs focus:ring-2 focus:outline-none"
        >
          Refresh
        </button>
      </div>
      <p className="text-foreground mt-3 text-sm leading-6">{text}</p>
      <p className="text-muted-foreground mt-2 text-xs">
        This summary is generated from student reviews and may contain inaccuracies.
      </p>
    </div>
  );
}
