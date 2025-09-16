"use client";

type SummaryCardProps = {
  text: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  error?: string | null;
};

export default function SummaryCard({
  text,
  onRefresh,
  isRefreshing = false,
  error,
}: SummaryCardProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">AI Summary of This Course</h3>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="border-border bg-card hover:bg-muted/70 ring-brand rounded-md border px-3 py-1.5 text-xs focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        ) : null}
      </div>
      <p className="text-foreground mt-3 text-sm leading-6" aria-live="polite">
        {text}
      </p>
      {error ? (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-muted-foreground mt-2 text-xs">
        Summary is generated from student reviews and may contain inaccuracies.
      </p>
    </div>
  );
}
