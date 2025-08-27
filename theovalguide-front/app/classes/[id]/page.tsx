// app/classes/[id]/page.tsx
import { notFound } from "next/navigation";
import { z } from "zod";
import ResultsClient from "./results-client";

/* ------------------ Zod schema for API payload ------------------ */
const ProfessorSchema = z.object({
  id: z.string(),
  name: z.string(),
  overall: z.number().optional(),
});

const TagSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const AdviceSchema = z.object({
  id: z.string(),
  author: z.string(),
  date: z.string(), // ISO
  text: z.string(),
});

const BucketSchema = z.object({
  label: z.string(), // e.g., "A", "B", "C", "D", "F" or "5".."1"
  count: z.number(), // integer
});

const ClassResultSchema = z.object({
  id: z.string(),
  code: z.string(), // e.g., "CS 2201"
  title: z.string(), // e.g., "Data Structures"
  department: z.string(),
  university: z.string(),
  difficulty: z.number(), // 1..5
  totalRatings: z.number().default(0),

  // Distributions
  gradeBuckets: z.array(BucketSchema).optional(), // e.g., A/B/C/D/F
  difficultyBuckets: z.array(BucketSchema).optional(), // "5".."1"

  professors: z.array(ProfessorSchema),
  tags: z.array(TagSchema).default([]),

  summary: z.string().default(""),
  advices: z.array(AdviceSchema).optional(),
  notes: z.array(z.string()).optional(),
});

export type ClassResult = z.infer<typeof ClassResultSchema>;

type Params = { params: { id: string } };

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export default async function Page({ params }: Params) {
  const base = getBaseUrl();

  /* ------------------------------------------------------------------
   * OPTION 1 (default for now): point to local mock route
   * → /app/api/classes/[id]/route.ts
   * Comment this out when backend is live.
   * ------------------------------------------------------------------ */
  const url = `${base}/api/classes/${encodeURIComponent(params.id)}`;

  /* ------------------------------------------------------------------
   * OPTION 2: real backend API call (uncomment when backend is up)
   * Make sure NEXT_PUBLIC_API_URL is set in your .env.local file, e.g.:
   * NEXT_PUBLIC_API_URL="http://localhost:4000"  or prod URL
   *
   * const url = `${process.env.NEXT_PUBLIC_API_URL}/classes/${encodeURIComponent(params.id)}`;
   * ------------------------------------------------------------------ */

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load class: ${res.status}`);

  const json = await res.json();
  const parsed = ClassResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error("API payload did not match expected schema");
  }

  return <ResultsClient initial={parsed.data} />;
}
