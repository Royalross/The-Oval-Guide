"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import type { SearchItem } from "@/lib/search-types";
import { SearchResponseSchema } from "@/lib/search-types";

import { cx } from "@/app/classes/[code]/components/ui-helpers";

/* ----------------------------- small utils ----------------------------- */
function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
function looksLikeClassCode(s: string) {
  return /^[a-zA-Z]+\s*\d+/.test(s.trim());
}
function normalizeClassCode(s: string) {
  const t = s.trim();
  const withSpace = t.replace(/^([a-zA-Z]+)\s*([0-9].*)$/, "$1 $2");
  return withSpace.toUpperCase();
}
function safeEncodeSegment(id: string) {
  let raw = id;
  try {
    const maybeDecoded = decodeURIComponent(id);
    if (maybeDecoded !== id) raw = maybeDecoded;
  } catch {
    // keep raw
  }
  return encodeURIComponent(raw);
}

/* ----------------------------- SearchBox ----------------------------- */
/** Matches the *old* visual: left SVG icon, big rounded input (px-12 py-3 pr-32 text-base),
 *  right pill button inside the input.
 *
 *  You can still override outer wrappers with `className`, but the input/button look stays classic.
 */
export default function SearchBox({
  className,
  minChars = 3,
  debounceMs = 400,
}: {
  className?: string;
  minChars?: number;
  debounceMs?: number;
}) {
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL!;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const abortRef = useRef<AbortController | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const debouncedQ = useDebounced(q, debounceMs);

  // close popover on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // fetch on type
  useEffect(() => {
    if (!api) return;
    const query = debouncedQ.trim();
    if (query.length < minChars) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    // cancel previous
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        const url = new URL("/api/search", api);
        url.searchParams.set("q", query);
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const parsed = SearchResponseSchema.safeParse(json);
        if (parsed.success) {
          setItems(parsed.data.items);
          setOpen(true);
          setActiveIndex(parsed.data.items.length ? 0 : -1);
        } else {
          setItems([]);
          setOpen(false);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setItems([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQ, api, minChars]);

  const navigateTo = (it: SearchItem) => {
    const encoded = safeEncodeSegment(it.id);
    const href = it.kind === "professor" ? `/professors/${encoded}` : `/classes/${encoded}`;
    router.push(href);
  };

  const submitOrGo = () => {
    const query = q.trim();
    if (items[0]) {
      navigateTo(items[0]);
      setOpen(false);
      return;
    }
    if (looksLikeClassCode(query)) {
      router.push(`/classes/${safeEncodeSegment(normalizeClassCode(query))}`);
    } else if (query.length >= minChars) {
      router.push(`/search?q=${safeEncodeSegment(query)}`);
    }
    setOpen(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open || !items.length) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitOrGo();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[activeIndex] ?? items[0];
      if (it) {
        navigateTo(it);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={cx("relative", className)} ref={wrapRef}>
      {/* ---- OLD LOOK INPUT WRAPPER ---- */}
      <div className="relative">
        {/* left search icon (same as old) */}
        <svg
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>

        {/* input (exact old spacings: px-12 py-3 pr-32 text-base) */}
        <input
          id="nav-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => items.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search professors or classes…"
          autoComplete="off"
          spellCheck={false}
          className={cx(
            "border-border bg-card text-foreground ring-brand placeholder:text-muted-foreground",
            "w-full rounded-full border px-12 py-3 pr-32 text-base shadow-sm",
            "focus:border-[var(--brand)] focus:ring-1 focus:outline-none",
          )}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="nav-search-listbox"
        />

        {/* right submit button (same size/placement) */}
        <button
          type="button"
          onClick={submitOrGo}
          className="hover:bg-brand-darker ring-brand absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-medium text-[var(--brand-contrast)] focus:ring-2 focus:outline-none"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {/* ---- DROPDOWN ---- */}
      {open && (items.length > 0 || q.trim().length >= minChars) && (
        <div
          role="listbox"
          id="nav-search-listbox"
          className="border-border bg-card absolute right-0 left-0 mt-2 max-h-[70vh] overflow-auto rounded-xl border p-1 shadow-lg"
        >
          {items.length === 0 ? (
            <div className="text-muted-foreground px-3 py-2 text-sm">
              {loading ? "Searching…" : "No results"}
            </div>
          ) : (
            items.map((it, idx) => {
              const encoded = safeEncodeSegment(it.id);
              const href =
                it.kind === "professor" ? `/professors/${encoded}` : `/classes/${encoded}`;
              return (
                <Link
                  key={`${it.kind}-${it.id}`}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "border-border hover:bg-muted/70 focus:bg-muted/70 block rounded-lg border p-3 transition outline-none",
                    idx === activeIndex && "bg-muted/70",
                  )}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{it.title}</div>
                      <div className="text-muted-foreground truncate text-xs">{it.subtitle}</div>
                    </div>
                    {it.kind === "professor" && typeof it.overall === "number" ? (
                      <div className="bg-brand grid h-9 w-9 place-items-center rounded-md text-xs font-bold text-[var(--brand-contrast)]">
                        {it.overall.toFixed(1)}
                      </div>
                    ) : it.kind === "class" && typeof it.difficulty === "number" ? (
                      <div className="text-right">
                        <div className="text-muted-foreground text-[10px]">Difficulty</div>
                        <div className="text-xs font-semibold">{it.difficulty.toFixed(1)}/5</div>
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
