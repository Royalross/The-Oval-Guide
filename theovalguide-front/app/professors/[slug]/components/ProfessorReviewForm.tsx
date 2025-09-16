"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as React from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MIN_CHARS = 2;

const SearchClassHit = z.object({
  kind: z.literal("class"),
  id: z.string(), // code, e.g. "CS 2201"
  title: z.string(), // "CS 2201 — Data Structures"
  subtitle: z.string(), // "Computer Science — Ohio State University"
  difficulty: z.number().nullish(),
});
type SearchClassHit = z.infer<typeof SearchClassHit>;

const FormSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
  tags: z.string().optional(),

  classChoice: z.object({
    mode: z.enum(["pick", "other"]),
    pickedCode: z.string().optional(),
    otherCode: z.string().optional(),
    otherTitle: z.string().optional(),
    otherDepartment: z.string().optional(),
    otherUniversity: z.string().optional(),
  }),
});
export type FormValues = z.infer<typeof FormSchema>;

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function ProfessorReviewForm({
  professorSlug,
  onCreated,
}: {
  professorSlug: string;
  onCreated?: () => void;
}) {
  // resolver explicitly typed for RHF
  const typedResolver: Resolver<FormValues> = zodResolver(FormSchema) as Resolver<FormValues>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: typedResolver,
    defaultValues: {
      rating: 5,
      difficulty: undefined,
      comment: "",
      tags: "",
      classChoice: { mode: "pick", pickedCode: "" },
    },
  });

  const [msg, setMsg] = React.useState<string | null>(null);
  const [searchQ, setSearchQ] = React.useState("");
  const [results, setResults] = React.useState<SearchClassHit[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const debouncedQ = useDebounced(searchQ, 300);
  const api = process.env.NEXT_PUBLIC_API_URL!;

  React.useEffect(() => {
    const q = debouncedQ.trim();
    if (!api || q.length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        setLoading(true);
        const url = new URL("/api/search", api);
        url.searchParams.set("q", q);
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { items: unknown[] };

        const hits: SearchClassHit[] = [];
        for (const it of Array.isArray(json.items) ? json.items : []) {
          const parsed = SearchClassHit.safeParse(it);
          if (parsed.success) hits.push(parsed.data);
        }
        setResults(hits);
        setOpen(true);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setResults([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedQ, api]);

  const pickClass = (code: string) => {
    setValue("classChoice", { mode: "pick", pickedCode: code });
    setSearchQ(code);
    setOpen(false);
  };

  const mode = watch("classChoice.mode");
  const pickedCode = watch("classChoice.pickedCode") ?? "";

  // ✅ Strongly type your submit handler
  const onSubmit: SubmitHandler<FormValues> = async (v) => {
    setMsg(null);

    const tags =
      v.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

    const base = {
      rating: v.rating,
      difficulty: v.difficulty,
      comment: v.comment,
      tags,
      professorSlug,
    };

    if (v.classChoice.mode === "pick" && v.classChoice.pickedCode) {
      await postReview({
        ...base,
        classCode: v.classChoice.pickedCode,
      });
      return;
    }

    const oc = v.classChoice.otherCode?.trim();
    if (!oc) {
      setMsg("Please enter a class code (e.g., CS 2201).");
      return;
    }
    await postReview({
      ...base,
      classCode: oc,
      createIfMissing: true,
      classTitle: v.classChoice.otherTitle?.trim() || undefined,
      department: v.classChoice.otherDepartment?.trim() || undefined,
      university: v.classChoice.otherUniversity?.trim() || undefined,
    });
  };

  async function postReview(payload: any) {
    try {
      await axios.post(`${api}/api/reviews`, payload, { withCredentials: true });
      setMsg("Thanks! Your review was submitted.");
      reset({
        rating: 5,
        difficulty: undefined,
        comment: "",
        tags: "",
        classChoice: { mode: "pick", pickedCode: "" },
      });
      setSearchQ("");
      setResults([]);
      setOpen(false);
      onCreated?.();
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.detail ||
        e?.message ||
        "Failed to submit review";
      setMsg(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Class picker */}
      <div className="space-y-2">
        <Label>Class you took with this professor</Label>

        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="pick"
              checked={mode === "pick"}
              onChange={() => {
                setValue("classChoice.mode", "pick");
                setOpen(false);
              }}
            />
            Pick from list
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="other"
              checked={mode === "other"}
              onChange={() => {
                setValue("classChoice.mode", "other");
                setResults([]);
                setOpen(false);
              }}
            />
            Other (add new)
          </label>
        </div>

        {mode === "pick" ? (
          <div className="relative">
            <Input
              placeholder="Search classes (e.g., CS 2201)…"
              value={searchQ}
              onChange={(e) => {
                setSearchQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => results.length && setOpen(true)}
            />
            {open && (
              <div className="border-border bg-card absolute z-20 mt-1 w-full rounded-md border shadow-md">
                {loading ? (
                  <div className="text-muted-foreground px-3 py-2 text-sm">Searching…</div>
                ) : results.length === 0 ? (
                  <div className="text-muted-foreground px-3 py-2 text-sm">
                    No classes found. Choose “Other” to add it.
                  </div>
                ) : (
                  <ul className="max-h-72 overflow-auto py-1">
                    {results.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => pickClass(r.id)}
                          className="hover:bg-muted/70 block w-full px-3 py-2 text-left text-sm"
                        >
                          <div className="font-medium">{r.title}</div>
                          <div className="text-muted-foreground text-xs">{r.subtitle}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {pickedCode && (
              <p className="text-muted-foreground mt-1 text-xs">
                Selected: <span className="font-medium">{pickedCode}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="otherCode" className="text-xs">
                Class code
              </Label>
              <Input
                id="otherCode"
                placeholder="e.g., CS 2201"
                {...register("classChoice.otherCode")}
              />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="otherTitle" className="text-xs">
                Title (optional)
              </Label>
              <Input
                id="otherTitle"
                placeholder="e.g., Data Structures"
                {...register("classChoice.otherTitle")}
              />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="otherDepartment" className="text-xs">
                Department (optional)
              </Label>
              <Input
                id="otherDepartment"
                placeholder="e.g., Computer Science"
                {...register("classChoice.otherDepartment")}
              />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="otherUniversity" className="text-xs">
                University (optional)
              </Label>
              <Input
                id="otherUniversity"
                placeholder="e.g., Ohio State University"
                {...register("classChoice.otherUniversity")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Ratings/comments */}
      <div>
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          {...register("rating", { valueAsNumber: true })}
        />
        {errors.rating && <p className="text-sm text-red-500">{errors.rating.message as string}</p>}
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty (1–5) — optional</Label>
        <Input
          id="difficulty"
          type="number"
          min={1}
          max={5}
          {...register("difficulty", { valueAsNumber: true })}
        />
        {errors.difficulty && (
          <p className="text-sm text-red-500">{errors.difficulty.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" rows={4} {...register("comment")} />
        {errors.comment && (
          <p className="text-sm text-red-500">{errors.comment.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" placeholder="CARING, TEST HEAVY" {...register("tags")} />
      </div>

      {msg && <p className="text-sm">{msg}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
