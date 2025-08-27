"use client";

import * as React from "react";

type Props = {
  className?: string;
  title?: string;
};

export default function LogoWordmark({
  className,
  title = "The Oval Guide",
}: Props) {
  return (
    <div className={className}>
      {/* The “O” mark */}
      <svg
        role="img"
        aria-label={title}
        viewBox="0 0 160 120"
        className="mx-auto h-16 w-auto sm:h-20"
      >
        <defs>
          {/* Colors adapt in dark mode by using currentColor for the outline */}
          <linearGradient id="o-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#b71c1c" />
            <stop offset="1" stopColor="#d32f2f" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
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

      {/* Wordmark (text) */}
      <div className="mt-3 text-center leading-tight">
        <span className="block text-2xl font-semibold tracking-tight sm:text-3xl">
          <span className="text-foreground/90">The</span>{" "}
          <span className="text-brand">Oval</span>{" "}
          <span className="text-foreground/90">Guide</span>
        </span>
      </div>
    </div>
  );
}
