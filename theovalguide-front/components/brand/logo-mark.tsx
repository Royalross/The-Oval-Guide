"use client";

type Props = { className?: string; title?: string };

export default function LogoMark({
  className,
  title = "The Oval Guide",
}: Props) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 160 120"
      className={className}
    >
      <defs>
        <linearGradient id="o-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b71c1c" />
          <stop offset="1" stopColor="#d32f2f" />
        </linearGradient>
      </defs>
      {/* Outer ring follows currentColor */}
      <rect
        x="10"
        y="10"
        rx="36"
        ry="36"
        width="140"
        height="100"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="10"
      />
      {/* Red inner “O” */}
      <rect
        x="30"
        y="25"
        rx="26"
        ry="26"
        width="100"
        height="70"
        fill="url(#o-fill)"
      />
    </svg>
  );
}
