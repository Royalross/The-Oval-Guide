"use client";

import Link from "next/link";
import { z } from "zod";

import StickyNav from "@/components/nav/StickyNav";

// match backend SearchResponse
const ProfessorHit = z.object({
  kind: z.literal("professor"),
  id: z.string(), // slug
  title: z.string(),
  subtitle: z.string(),
  overall: z.number().optional().nullable(),
});
const ClassHit = z.object({
  kind: z.literal("class"),
  id: z.string(), // code
  title: z.string(),
  subtitle: z.string(),
  difficulty: z.number().optional().nullable(),
});
const SearchItemSchema = z.union([ProfessorHit, ClassHit]);
type SearchItem = z.infer<typeof SearchItemSchema>;

type Props = {
  initial: {
    q: string;
    items: unknown[];
    error?: string;
  };
};

export default function ResultsClient({ initial }: Props) {
  const { q } = initial;
  const parsedItems = SearchItemSchema.array().safeParse(initial.items);
  const items: SearchItem[] = parsedItems.success ? parsedItems.data : [];
  const error =
    initial.error ??
    (!parsedItems.success ? "Search results payload did not match expected schema." : undefined);

  if (!parsedItems.success) {
    console.error(parsedItems.error);
  }

  return (
    <div className="bg-background text-foreground min-h-[100svh]">
      <StickyNav />

      <main className="container-responsive py-6 md:py-8">
        <h1 className="mb-3 text-xl font-semibold">Search results</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          {q ? <>for “{q}”</> : "Type in the search bar to begin."}
        </p>

        {error && (
          <div className="border-border bg-card mb-6 rounded-md border p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {!items || items.length === 0 ? (
          <div className="border-border bg-card rounded-md border p-6">
            <p className="text-muted-foreground">No results{q ? <> for “{q}”</> : null}.</p>
            <ul className="text-muted-foreground mt-3 list-disc pl-5 text-sm">
              <li>Try a professor’s name (e.g., “Ada Lovelace”, “Jordan Harper”).</li>
              <li>Try a course code or title (e.g., “CS 2201”, “Algorithms”).</li>
              <li>You can also search by department or university.</li>
            </ul>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => {
              const href =
                it.kind === "professor"
                  ? `/professors/${encodeURIComponent(it.id)}`
                  : `/classes/${encodeURIComponent(it.id)}`; // code kept verbatim (spaces OK)

              return (
                <li
                  key={`${it.kind}-${it.id}`}
                  className="border-border bg-card hover:bg-muted/70 rounded-md border p-4 transition"
                >
                  <Link href={href} className="block">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-medium">{it.title}</div>
                        <div className="text-muted-foreground truncate text-sm">{it.subtitle}</div>
                      </div>

                      {it.kind === "professor" && typeof it.overall === "number" ? (
                        <div className="bg-brand grid h-10 w-10 place-items-center rounded-md text-xs font-bold text-[var(--brand-contrast)]">
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
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
