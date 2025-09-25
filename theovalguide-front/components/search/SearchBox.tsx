"use client";

import React, { useEffect, useRef, useState } from "react";

type SearchItem = {
  kind: "professor" | "class";
  id: string;
  title: string;
  subtitle: string;
  overall?: number | null;
  difficulty?: number | null;
};

/**
 * A simple utility for conditionally joining class names together.
 * Replaces the external 'cx' utility.
 */
const cx = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(" ");

/**
 * A custom hook that delays updating a value until a specified amount of time has passed.
 * This is essential for preventing API calls on every keystroke in a search input.
 * @param value The value to debounce.
 * @param ms The delay in milliseconds.
 */
function useDebounced<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay.
    const timer = setTimeout(() => setDebouncedValue(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);

  return debouncedValue;
}

/**
 * Checks if a string looks like a course code (e.g., "CS 101", "MATH241").
 * Uses a regular expression to match letters followed by optional space and then numbers.
 */
function looksLikeClassCode(s: string): boolean {
  return /^[a-zA-Z]+\s*\d+/.test(s.trim());
}

/**
 * Normalizes a class code string to a consistent format (e.g., "cs101" -> "CS 101").
 */
function normalizeClassCode(s: string): string {
  const trimmed = s.trim();
  // Inserts a space between the department code and the course number if missing.
  const withSpace = trimmed.replace(/^([a-zA-Z]+)\s*([0-9].*)$/, "$1 $2");
  return withSpace.toUpperCase();
}

/**
 * Safely encodes a string segment for use in a URL, handling cases where it might already be encoded.
 */
function safeEncodeSegment(id: string): string {
  let raw = id;
  // Try to decode the segment first. If it succeeds and is different, it means the string
  // was already encoded, so we use the decoded version to prevent double-encoding.
  try {
    const maybeDecoded = decodeURIComponent(id);
    if (maybeDecoded !== id) raw = maybeDecoded;
  } catch {
    // If decoding fails, it's not a valid URI component, so we use the raw string.
  }
  return encodeURIComponent(raw);
}

/**
 * A client-side component providing a real-time search input with a dropdown of results.
 * It includes debouncing, keyboard navigation, and aborts stale requests.
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
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debouncedQuery = useDebounced(query, debounceMs);
  const abortControllerRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Effect to fetch search results when the debounced query changes.
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (trimmedQuery.length < minChars) {
      setItems([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    // Cancel any previous, ongoing fetch request to prevent race conditions.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const url = new URL("/api/search", apiBaseUrl);
        url.searchParams.set("q", trimmedQuery);
        const res = await fetch(url.toString(), {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const json = await res.json();

        if (json && Array.isArray(json.items)) {
          setItems(json.items);
          setIsOpen(true);
          setActiveIndex(json.items.length ? 0 : -1);
        } else {
          setItems([]);
          setIsOpen(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setItems([]);
          setIsOpen(false);
          console.error("Search fetch error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, apiBaseUrl, minChars]);

  /**
   * Navigates to the detail page for a given search item using standard browser navigation.
   */
  const navigateToItem = (item: SearchItem) => {
    const encodedId = safeEncodeSegment(item.id);

    window.location.href =
      item.kind === "professor" ? `/professors/${encodedId}` : `/classes/${encodedId}`;
  };

  /**
   * Handles form submission via Enter key or button click.
   * Navigates to the first result, a specific class page, or a general search page.
   */
  const handleSubmit = () => {
    const trimmedQuery = query.trim();
    // If there's an active search result, navigate to it.
    if (items[activeIndex]) {
      navigateToItem(items[activeIndex]);
    }
    // Otherwise, check if the query looks like a class code.
    else if (looksLikeClassCode(trimmedQuery)) {
      window.location.href = `/classes/${safeEncodeSegment(normalizeClassCode(trimmedQuery))}`;
    }
    // Finally, fall back to a general search page.
    else if (trimmedQuery.length >= minChars) {
      window.location.href = `/search?q=${safeEncodeSegment(trimmedQuery)}`;
    }
    setIsOpen(false);
  };

  /**
   * Handles keyboard navigation within the search input.
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Handle Enter key for submission when dropdown is closed.
    if (!isOpen || !items.length) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
        e.preventDefault();
        if (items[activeIndex]) {
          navigateToItem(items[activeIndex]);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={cx("relative", className)} ref={wrapperRef}>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>

        <input
          id="nav-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => items.length && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search professors or classes…"
          autoComplete="off"
          spellCheck={false}
          className="border-border bg-card text-foreground ring-brand placeholder:text-muted-foreground w-full rounded-full border px-12 py-3 pr-32 text-base shadow-sm focus:border-[var(--brand)] focus:ring-1 focus:outline-none"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="nav-search-listbox"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="hover:bg-brand-darker ring-brand absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-medium text-[var(--brand-contrast)] focus:ring-2 focus:outline-none"
        >
          {isLoading ? "Searching…" : "Search"}
        </button>
      </div>

      {/* --- Dropdown Results --- */}
      {isOpen && (
        <div
          role="listbox"
          id="nav-search-listbox"
          className="border-border bg-card absolute right-0 left-0 mt-2 max-h-[70vh] overflow-auto rounded-xl border p-1 shadow-lg"
        >
          {items.length > 0 ? (
            items.map((item, idx) => (
              <SearchResultItem
                key={`${item.kind}-${item.id}`}
                item={item}
                isActive={idx === activeIndex}
                onClick={() => setIsOpen(false)}
                onMouseEnter={() => setActiveIndex(idx)}
              />
            ))
          ) : (
            <div className="text-muted-foreground px-3 py-2 text-sm">
              {isLoading ? "Searching…" : "No results"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultItem({
  item,
  isActive,
  onClick,
  onMouseEnter,
}: {
  item: SearchItem;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  const encodedId = safeEncodeSegment(item.id);
  const href = item.kind === "professor" ? `/professors/${encodedId}` : `/classes/${encodedId}`;

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={isActive}
      className={cx(
        "border-border hover:bg-muted/70 focus:bg-muted/70 block rounded-lg border p-3 transition outline-none",
        isActive && "bg-muted/70",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side: Title and Subtitle */}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{item.title}</div>
          <div className="text-muted-foreground truncate text-xs">{item.subtitle}</div>
        </div>

        {/* Right side: Professor rating or Class difficulty */}
        {item.kind === "professor" && typeof item.overall === "number" ? (
          <div className="bg-brand grid h-9 w-9 place-items-center rounded-md text-xs font-bold text-[var(--brand-contrast)]">
            {item.overall.toFixed(1)}
          </div>
        ) : item.kind === "class" && typeof item.difficulty === "number" ? (
          <div className="text-right">
            <div className="text-muted-foreground text-[10px]">Difficulty</div>
            <div className="text-xs font-semibold">{item.difficulty.toFixed(1)}/5</div>
          </div>
        ) : null}
      </div>
    </a>
  );
}
