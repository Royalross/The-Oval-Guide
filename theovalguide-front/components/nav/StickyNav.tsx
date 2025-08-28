"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LogoMark from "@/components/brand/logo-mark";
import SearchBox from "@/components/search/SearchBox";

import { cx } from "@/app/classes/[code]/components/ui-helpers";

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
      <div className="container-responsive flex h-14 items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span className="font-semibold tracking-tight">
            The <span className="text-brand">Oval</span> Guide
          </span>
        </Link>

        <div className="mx-3 hidden grow md:block">
          <SearchBox className="py-2.5 pr-28 pl-11 text-sm" />
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <Link
            href="/auth/sign-in"
            className="border-border bg-card hover:bg-muted/70 ring-brand rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="bg-brand hover:bg-brand-darker ring-brand rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--brand-contrast)] focus:ring-2 focus:outline-none"
          >
            Sign up
          </Link>
        </nav>
      </div>

      <div className="border-border border-t md:hidden">
        <div className="container-responsive py-2">
          <SearchBox className="py-2 pr-24 pl-11 text-sm" />
        </div>
      </div>
    </header>
  );
}
