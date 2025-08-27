"use client";

export default function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div
      className="inline-flex items-center gap-1"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = !isFull && i === full && half;
        return (
          <svg
            key={i}
            className="h-4 w-4 text-brand"
            viewBox="0 0 24 24"
            fill={isFull ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isHalf ? 2 : isFull ? 0 : 2}
          >
            <path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
}
