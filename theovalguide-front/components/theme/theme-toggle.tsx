"use client";

import { useTheme } from "next-themes";

export default function ThemeToggleFab() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const current = (theme ?? resolvedTheme) === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
      className="
        fixed z-50
        right-4 bottom-4 sm:right-6 sm:bottom-6
        grid place-items-center
        h-11 w-11 rounded-full border border-border
        bg-card/90 backdrop-blur shadow-lg
        text-foreground hover:bg-muted/70
        focus:outline-none focus:ring-2 ring-brand
      "
      style={{
        marginRight: "max(env(safe-area-inset-right), 0px)",
        marginBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
      // Prevent noisy warnings if anything still differs slightly
      suppressHydrationWarning
    >
      {/* Sun (shown when NOT dark) */}
      <svg
        className="h-5 w-5 dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.5 6.5-1.5-1.5M8 8 6.5 6.5M17.5 6.5 16 8M8 16l-1.5 1.5" />
      </svg>

      {/* Moon (shown when dark) */}
      <svg
        className="hidden h-5 w-5 dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    </button>
  );
}
