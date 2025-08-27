"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AxiosError } from "axios";

/* --------------------- Config --------------------- */
const MIN_CHARS = 3;
const DEBOUNCE_MS = 400;

/* ------------------ Types & Schemas --------------- */
const ProfessorHit = z.object({
  kind: z.literal("professor"),
  id: z.string(),
  title: z.string(), // e.g. "Dr. Jordan Harper"
  subtitle: z.string(), // e.g. "Computer Science • State University"
  overall: z.number().optional(),
});

const ClassHit = z.object({
  kind: z.literal("class"),
  id: z.string(),
  title: z.string(), // e.g. "CS 2201 — Data Structures"
  subtitle: z.string(), // e.g. "Computer Science • State University"
  difficulty: z.number().optional(),
});

const SearchResultSchema = z.union([ProfessorHit, ClassHit]);
type SearchResult = z.infer<typeof SearchResultSchema>;

const SearchResponseSchema = z.object({
  items: z.array(SearchResultSchema),
});
type SearchResponse = z.infer<typeof SearchResponseSchema>;

/* ------------- Form schema (Enter submit) --------- */
const searchSchema = z.object({
  input: z.string().min(MIN_CHARS, `Enter at least ${MIN_CHARS} characters`).max(100, "Too long"),
});
type SearchValues = z.infer<typeof searchSchema>;

type CanceledError = { code?: string; name?: string };

/* ----------------- Error helper ------------------- */
type ApiErrorBody = {
  detail?: string;
  message?: string;
  error?: string;
  errors?: string[];
};
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | string | undefined;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      if (data.detail) return data.detail;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (Array.isArray(data.errors) && typeof data.errors[0] === "string") {
        return data.errors[0];
      }
    }
    return err.message ?? "Request failed";
  }
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/* ------------- Fetch helper with fallback ---------- */
async function fetchSearch(q: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const tryEndpoints = [
    `${apiUrl}/auth/search`, // prefer member endpoint
    `${apiUrl}/search`, // fallback public
  ] as const;

  // Try /auth/search first; on 401/403 fall back to /search
  for (const url of tryEndpoints) {
    try {
      const res = await axios.get<SearchResponse>(url, {
        params: { q },
        withCredentials: true, // send cookies if present
        signal,
      });
      const parsed = SearchResponseSchema.safeParse(res.data);
      if (parsed.success) return parsed.data.items;
      // schema mismatch: treat as empty (or throw)
      return [];
    } catch (e) {
      const err = e as AxiosError;
      const status = err.response?.status ?? 0;
      const isAuthFail = status === 401 || status === 403;
      const isCanceled =
        axios.isCancel(err) ||
        (typeof err === "object" &&
          true &&
          ("name" in err || "code" in err) &&
          ((err as CanceledError).name === "CanceledError" ||
            (err as CanceledError).code === "ERR_CANCELED"));
      if (isCanceled) throw err; // let callers ignore canceled upstream
      if (!isAuthFail) {
        // If not an auth error and this was the fallback already, rethrow
        if (url.endsWith("/search")) throw err;
        // Otherwise, try next endpoint
      }
      // if auth fail on /auth/search, loop continues to /search
    }
  }
  return [];
}

/* --------------------- Component ------------------- */
export default function PreauthSearch() {
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);

  const lastFetchedRef = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, SearchResult[]>>(new Map());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { input: "" },
    mode: "onSubmit",
  });

  const q = watch("input");

  // Debounced live search
  useEffect(() => {
    setError(null);
    setIsTyping(true);
    const trimmed = (q ?? "").trim();

    if (trimmed.length < MIN_CHARS) {
      setIsLoading(false);
      setResults(null);
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(async () => {
      if (trimmed === lastFetchedRef.current) {
        setIsTyping(false);
        return;
      }

      const cached = cacheRef.current.get(trimmed);
      if (cached) {
        lastFetchedRef.current = trimmed;
        setResults(cached);
        setIsTyping(false);
        setIsLoading(false);
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setIsLoading(true);
        const items = await fetchSearch(trimmed, controller.signal);
        cacheRef.current.set(trimmed, items);
        lastFetchedRef.current = trimmed;
        setResults(items);
      } catch (err) {
        // ignore cancels; show other errors
        const isCanceled =
          axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError");
        if (!isCanceled) setError(getErrorMessage(err) || "Search failed");
      } finally {
        setIsTyping(false);
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [q]);

  // Explicit submit (Enter or button)
  const onSubmit = async (values: SearchValues) => {
    setError(null);
    const trimmed = values.input.trim();
    if (trimmed.length < MIN_CHARS) return;

    const cached = cacheRef.current.get(trimmed);
    if (cached) {
      lastFetchedRef.current = trimmed;
      setResults(cached);
      setValue("input", trimmed);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      const items = await fetchSearch(trimmed, controller.signal);
      cacheRef.current.set(trimmed, items);
      lastFetchedRef.current = trimmed;
      setResults(items);
      setValue("input", trimmed);
    } catch (err) {
      const isCanceled =
        axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError");
      if (!isCanceled) setError(getErrorMessage(err) || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="relative">
          {/* left search icon */}
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

          {/* input */}
          <label htmlFor="preauth-search" className="sr-only">
            Search
          </label>
          <input
            id="preauth-search"
            type="text"
            placeholder="Search professors or classes…"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!errors.input}
            className="border-border bg-card text-foreground ring-brand placeholder:text-muted-foreground w-full rounded-full border px-12 py-3 pr-32 text-base shadow-sm focus:border-[var(--brand)] focus:ring-1"
            {...register("input")}
            onChangeCapture={() => setIsTyping(true)}
          />

          {/* in-input submit button (right end) */}
          <button
            type="submit"
            className="hover:bg-brand-darker ring-brand absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-[var(--brand)] px-5 py-2 text-sm font-medium text-[var(--brand-contrast)] focus:ring-2 focus:outline-none"
          >
            {isLoading ? "Searching…" : "Search"}
          </button>
        </div>

        {errors.input && <p className="mt-2 text-xs text-red-500">{errors.input.message}</p>}
        {(isTyping || isLoading) && !errors.input && (
          <p className="text-muted-foreground mt-2 text-xs">
            {isLoading ? "Searching…" : `Type at least ${MIN_CHARS} characters`}
          </p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </form>

      {/* Results list */}
      {results && (
        <ul className="mt-5 space-y-2">
          {results.length === 0 && (
            <li className="border-border bg-card text-muted-foreground rounded-md border p-3 text-sm">
              No results
            </li>
          )}

          {results.map((item) => {
            const href =
              item.kind === "professor"
                ? `/professors/${encodeURIComponent(item.id)}`
                : `/classes/${encodeURIComponent(item.id)}`;

            return (
              <li
                key={`${item.kind}-${item.id}`}
                className="border-border bg-card hover:bg-muted/70 rounded-md border p-4 transition"
              >
                <Link href={href} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium">{item.title}</div>
                      <div className="text-muted-foreground truncate text-sm">{item.subtitle}</div>
                    </div>

                    {/* Right-side metric if available */}
                    {item.kind === "professor" && typeof item.overall === "number" ? (
                      <div className="bg-brand grid h-12 w-12 place-items-center rounded-lg text-sm font-bold text-[var(--brand-contrast)]">
                        {item.overall.toFixed(1)}
                      </div>
                    ) : item.kind === "class" && typeof item.difficulty === "number" ? (
                      <div className="text-right">
                        <div className="text-muted-foreground text-xs">Difficulty</div>
                        <div className="text-sm font-semibold">{item.difficulty.toFixed(1)}/5</div>
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
