"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Zod schema
const schema = z.object({
  rating: z.coerce.number().int().min(1, "Min 1").max(5, "Max 5"),
  difficulty: z.coerce.number().int().min(1, "Min 1").max(5, "Max 5").optional(),
  comment: z.string().max(500, "Max 500 chars").optional(),
  tags: z.string().optional(),
});
type Values = z.infer<typeof schema>;

export function ClassReviewForm({ code }: { code: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Values>({
    // Cast resolver so RHF knows its output matches <Values>
    resolver: zodResolver(schema) as Resolver<Values>,
    defaultValues: { rating: 5, difficulty: undefined, comment: "", tags: "" },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Values> = async (v) => {
    setMsg(null);
    const api = process.env.NEXT_PUBLIC_API_URL!;
    try {
      await axios.post(
        `${api}/api/reviews`,
        {
          rating: v.rating,
          difficulty: v.difficulty,
          comment: v.comment,
          tags:
            v.tags
              ?.split(",")
              .map((t) => t.trim())
              .filter(Boolean) ?? [],
          classCode: code,
        },
        { withCredentials: true },
      );
      setMsg("Thanks! Your review was submitted.");
      reset({ rating: 5, difficulty: undefined, comment: "", tags: "" });
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          {...register("rating", { valueAsNumber: true })}
        />
        {errors.rating && <p className="text-sm text-red-500">{errors.rating.message}</p>}
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
        {errors.difficulty && <p className="text-sm text-red-500">{errors.difficulty.message}</p>}
      </div>

      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" rows={4} {...register("comment")} />
        {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" placeholder="CARING, TEST HEAVY" {...register("tags")} />
        {errors.tags && <p className="text-sm text-red-500">{errors.tags.message}</p>}
      </div>

      {msg && <p className="text-sm">{msg}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
