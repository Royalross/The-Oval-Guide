import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";

import ResultsClient from "./results-client";

// Zod schemas
const RatingBucketSchema = z.object({ label: z.string(), count: z.number() });
const TagSchema = z.object({ id: z.string(), label: z.string() });
const ReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  course: z.string(),
  date: z.string(),
  rating: z.number(),
  comment: z.string(),
  tags: z.array(z.string()).optional(),
});
const ProfessorResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  university: z.string(),
  overall: z.number(),
  totalRatings: z.number(),
  buckets: z.array(RatingBucketSchema),
  tags: z.array(TagSchema),
  summary: z.string(),
  reviews: z.array(ReviewSchema),
});
export type ProfessorResult = z.infer<typeof ProfessorResultSchema>;
type Params = { params: Promise<{ id: string }> };

async function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  // from incoming request must await
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function Page({ params }: Params) {
  // MOCK: keep this while backend is not ready
  const base = getBaseUrl();
  const { id } = await params;
  const url = new URL(`/api/professors/${encodeURIComponent(id)}`, await base).toString();

  // uncomment this when backend is live, remove the mock block above
  // const api = process.env.NEXT_PUBLIC_API_URL;
  // if (!api) throw new Error("NEXT_PUBLIC_API_URL is not defined");
  // const url = `${api}/professors/${encodeURIComponent(params.id)}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    // If backend uses cookie/session  which is the plan auth:
    // credentials: "include",
  });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load professor: ${res.status}`);

  const json = await res.json();
  const parsed = ProfessorResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error("API payload did not match expected schema");
  }

  return <ResultsClient initial={parsed.data} />;
}
