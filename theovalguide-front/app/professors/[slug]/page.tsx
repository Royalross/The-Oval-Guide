import { notFound } from "next/navigation";
import { z } from "zod";

import {
  ProfessorResultSchema,
  type ProfessorResult,
  BucketSchema,
  TagSchema,
  ReviewSchema,
} from "./schema";

function normalizeProfessor(raw: any, slugFromParams: string): ProfessorResult {
  const asString = (v: unknown, fallback = "") =>
    typeof v === "string" ? v : v == null ? fallback : String(v);

  const asNumberOrNull = (v: unknown) => {
    if (v == null) return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const toIsoString = (v: unknown) => {
    // raw may already send ISO; if Instant serialized differently, still try Date()
    try {
      const d = new Date(typeof v === "string" ? v : String(v));
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const normBuckets = (() => {
    const input: unknown = raw?.buckets ?? [];
    if (!Array.isArray(input)) return [];
    const out = input
      .map((b) => ({ label: asString((b as any)?.label), count: Number((b as any)?.count ?? 0) }))
      .filter((b) => b.label && Number.isFinite(b.count) && b.count >= 0);
    const parsed = z.array(BucketSchema).safeParse(out);
    return parsed.success ? parsed.data : [];
  })();

  const normTags = (() => {
    const input: unknown = raw?.tags ?? [];
    if (!Array.isArray(input)) return [];
    const mapped = input.map((t) =>
      typeof t === "string"
        ? { id: t, label: t }
        : {
            id: asString((t as any)?.id) || asString((t as any)?.label) || "tag",
            label: asString((t as any)?.label) || asString((t as any)?.name) || "tag",
          },
    );
    const parsed = z.array(TagSchema).safeParse(mapped);
    return parsed.success ? parsed.data : [];
  })();

  const normReviews = (() => {
    // backend sends ReviewItemDto[] as raw.reviews
    const input: unknown = raw?.reviews ?? [];
    if (!Array.isArray(input)) return [];

    const mapped = input.map((r) => {
      const id = asString((r as any)?.id) || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const author = (r as any)?.author;
      const course = (r as any)?.course;
      const rating = (r as any)?.rating;
      const comment = (r as any)?.comment;
      const tags = Array.isArray((r as any)?.tags)
        ? (r as any)?.tags.filter((t: unknown) => typeof t === "string")
        : undefined;

      return {
        id,
        author: typeof author === "string" ? author : null,
        course: typeof course === "string" ? course : undefined,
        date: toIsoString((r as any)?.date),
        rating: typeof rating === "number" ? rating : undefined,
        comment: typeof comment === "string" ? comment : "",
        tags,
      };
    });

    const parsed = z.array(ReviewSchema).safeParse(mapped);
    return parsed.success ? parsed.data : [];
  })();

  return {
    id: asString(raw?.id) || undefined,
    slug: asString(raw?.slug) || slugFromParams,
    name: asString(raw?.name ?? raw?.fullName ?? raw?.title, "Unknown"),
    department: asString(raw?.department ?? raw?.dept ?? raw?.departmentName, "Unknown"),
    university: asString(raw?.university ?? raw?.uni ?? raw?.school ?? raw?.campus, "Unknown"),
    overall: asNumberOrNull(raw?.overall ?? raw?.avgRating ?? raw?.rating),
    summary: raw?.summary == null ? null : asString(raw?.summary),
    buckets: normBuckets,
    tags: normTags,
    reviews: normReviews,
  };
}

export default async function Page({
  params,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const slug = params.slug;

  if (!api || !slug) {
    return (
      <div className="container-responsive py-10">
        <h1 className="text-lg font-semibold">Professor</h1>
        <p className="text-muted-foreground mt-2">Missing configuration or slug.</p>
      </div>
    );
  }

  const url = `${api}/api/professors/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", headers: { Accept: "application/json" } });
  } catch (e) {
    console.error("Professor API fetch failed:", e);
    return (
      <div className="container-responsive py-10">
        <h1 className="text-lg font-semibold">Professor</h1>
        <p className="text-muted-foreground mt-2">Failed to load professor data.</p>
      </div>
    );
  }

  if (res.status === 404) notFound();

  if (!res.ok) {
    try {
      const text = await res.text();
      console.error("Professor API error:", res.status, text);
    } catch {}
    return (
      <div className="container-responsive py-10">
        <h1 className="text-lg font-semibold">Professor</h1>
        <p className="text-muted-foreground mt-2">
          Failed to load professor (status {res.status}).
        </p>
      </div>
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (e) {
    console.error("Professor API returned invalid JSON:", e);
    return (
      <div className="container-responsive py-10">
        <h1 className="text-lg font-semibold">Professor</h1>
        <p className="text-muted-foreground mt-2">Invalid server response.</p>
      </div>
    );
  }

  const normalized = normalizeProfessor(json, slug);
  const parsed = ProfessorResultSchema.safeParse(normalized);

  if (!parsed.success) {
    console.error(
      "Zod issues:",
      parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        code: i.code,
        message: i.message,
      })),
    );
    return (
      <div className="container-responsive py-10">
        <h1 className="text-lg font-semibold">Professor</h1>
        <p className="text-muted-foreground mt-2">
          We couldn’t interpret the data returned by the server.
        </p>
      </div>
    );
  }

  const ResultsClient = (await import("./results-client")).default;
  return <ResultsClient initial={parsed.data} />;
}
