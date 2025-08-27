"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cx } from "./ui-helpers";
import LogoMark from "@/components/brand/logo-mark";

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cx(
        "sticky top-0 z-40 transition-all duration-300",
        "bg-card/70 backdrop-blur",
        scrolled && "shadow-sm",
      )}
      role="navigation"
      aria-label="Primary"
    >
      <div className="container-responsive h-14 flex items-center gap-3">
        {/* Left: Brand icon  */}
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span className="font-semibold tracking-tight">
            The <span className="text-brand">Oval</span> Guide
          </span>
        </Link>

        {/* Center: Search */}
        <form
          className="mx-3 hidden md:block grow"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative">
            <input
              type="search"
              placeholder="Search professors, courses…"
              className="
                w-full rounded-full
                bg-card text-foreground border border-border
                placeholder:text-muted-foreground
                pl-11 pr-28 py-2.5 text-sm shadow-sm
                focus:outline-none focus:ring-1 ring-brand focus:border-[var(--brand)]
              "
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔎
            </span>
            <button
              type="submit"
              className="
                absolute right-1.5 top-1/2 -translate-y-1/2
                rounded-full px-4 py-1.5 text-sm font-medium
                bg-brand hover:bg-brand-darker text-[var(--brand-contrast)]
                focus:outline-none focus:ring-2 ring-brand
              "
            >
              Search
            </button>
          </div>
        </form>

        {/* Right: Sign in/sign out buttons */}
        <nav className="ml-auto flex items-center gap-2">
          <Link
            href="/auth/sign-in"
            className="px-3 py-1.5 rounded-md border border-border bg-card hover:bg-muted/70 focus:outline-none focus:ring-2 ring-brand text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-3 py-1.5 rounded-md bg-brand hover:bg-brand-darker text-[var(--brand-contrast)] focus:outline-none focus:ring-2 ring-brand text-sm font-semibold"
          >
            Sign up
          </Link>
        </nav>
      </div>

      {/* Mobile friendly search */}
      <div className="md:hidden border-t border-border">
        <div className="container-responsive py-2">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input
                type="search"
                placeholder="Search professors, courses…"
                className="
                  w-full rounded-full
                  bg-card text-foreground border border-border
                  placeholder:text-muted-foreground
                  pl-11 pr-24 py-2 text-sm
                  focus:outline-none focus:ring-1 ring-brand focus:border-[var(--brand)]
                "
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                🔎
              </span>
              <button
                type="submit"
                className="
                  absolute right-1 top-1/2 -translate-y-1/2
                  rounded-full px-3 py-1 text-xs font-medium
                  bg-brand hover:bg-brand-darker text-[var(--brand-contrast)]
                  focus:outline-none focus:ring-2 ring-brand
                "
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
