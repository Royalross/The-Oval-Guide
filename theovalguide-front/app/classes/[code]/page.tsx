import { notFound } from "next/navigation";
import { z } from "zod";

import { joinUrl } from "@/lib/url";

import ResultsClient from "./results-client";

const BucketSchema = z.object({ label: z.string(), count: z.number() });
const ProfessorSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  overall: z.number().nullish(),
});
const TagSchema = z.object({ id: z.string(), label: z.string() });
const AdviceSchema = z.object({
  id: z.string(),
  author: z.string(),
  date: z.string(),
  text: z.string(),
  upvotes: z.number().default(0),
});
const NotesPreviewSchema = z.object({
  count: z.number(),
  samples: z.array(z.object({ id: z.string(), title: z.string() })),
});

const ClassResultSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  department: z.string(),
  university: z.string(),
  difficulty: z.number().nullish(),
  totalRatings: z.number(),
  gradeBuckets: z.array(BucketSchema).default([]),
  difficultyBuckets: z.array(BucketSchema).default([]),
  professors: z.array(ProfessorSchema).default([]),
  tags: z.array(TagSchema).default([]),
  summary: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  advices: z.array(AdviceSchema).default([]),
  notes: z.array(z.string()).default([]),
  notesPreview: NotesPreviewSchema.default({ count: 0, samples: [] }),
});
export type ClassResult = z.infer<typeof ClassResultSchema>;

type Params = { params: Promise<{ code: string }> };

function normalizeClassCode(s: string) {
  // "cs2201" / "CS2201" / "CS 2201" -> "CS 2201"
  const t = decodeURIComponent(s).trim();
  const withSpace = t.replace(/^([a-zA-Z]+)\s*([0-9].*)$/, "$1 $2");
  return withSpace.toUpperCase();
}

async function fetchClass(api: string, code: string) {
  const url = joinUrl(api, `/api/classes/${encodeURIComponent(code)}`);

  return await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
}

export default async function Page({ params }: Params) {
  const { code: raw } = await params;
  if (!raw || raw === "undefined") notFound();

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  // 1st attempt: as-is
  let res = await fetchClass(api, raw);

  // If 404, try normalized (e.g., add space)
  if (res.status === 404) {
    const normalized = normalizeClassCode(raw);
    res = await fetchClass(api, normalized);
  }

  if (res.status === 404) notFound();

  if (!res.ok) {
    // Try to log backend error body for help debugging
    try {
      const text = await res.text();
      console.error("Class API error:", res.status, text);
    } catch {}
    // Render an error page instead of crashing
    return (
      <div className="bg-background text-foreground min-h-[100svh]">
        <main className="container-responsive py-10">
          <h1 className="text-xl font-semibold">We couldn’t load this class</h1>
          <p className="text-muted-foreground mt-2">
            The server returned {res.status}. Please try again in a moment.
          </p>
        </main>
      </div>
    );
  }

  const json = await res.json();
  const parsed = ClassResultSchema.safeParse(json);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    return (
      <div className="bg-background text-foreground min-h-[100svh]">
        <main className="container-responsive py-10">
          <h1 className="text-xl font-semibold">We couldn’t load this class</h1>
          <p className="text-muted-foreground mt-2">API payload did not match expected schema.</p>
        </main>
      </div>
    );
  }

  return <ResultsClient initial={parsed.data} />;
}
