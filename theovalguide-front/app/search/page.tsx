import { z } from "zod";

const SearchItemSchema = z.object({
  kind: z.enum(["professor", "class"]),
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  overall: z.number().optional().nullable(),
  difficulty: z.number().optional().nullable(),
});
const SearchResponseSchema = z.object({
  items: z.array(SearchItemSchema),
});
export default async function Page({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q ?? "";

  if (!q.trim()) {
    return (
      <main className="container-responsive py-10">
        <p className="text-muted-foreground">No results found.</p>
      </main>
    );
  }

  try {
    const api = process.env.NEXT_PUBLIC_API_URL!;
    const url = `${api}/api/search?q=${encodeURIComponent(q)}`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.error("Search API error", res.status);
      return (
        <main className="container-responsive py-10">
          <p className="text-muted-foreground">No results found.</p>
        </main>
      );
    }

    const json = await res.json();
    const parsed = SearchResponseSchema.safeParse(json);
    if (!parsed.success || parsed.data.items.length === 0) {
      return (
        <main className="container-responsive py-10">
          <p className="text-muted-foreground">No results found.</p>
        </main>
      );
    }

    return (
      <main className="container-responsive py-10">
        <ul className="space-y-2">
          {parsed.data.items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              {item.title} <span className="text-muted-foreground">— {item.subtitle}</span>
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (err) {
    console.error("Search page error", err);
    return (
      <main className="container-responsive py-10">
        <p className="text-muted-foreground">No results found.</p>
      </main>
    );
  }
}
