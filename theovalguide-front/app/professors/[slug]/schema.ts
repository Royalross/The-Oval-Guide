import { z } from "zod";

export const BucketSchema = z.object({
  label: z.string(),
  count: z.number().int().nonnegative(),
});

export const TagSchema = z.object({
  id: z.string(),
  label: z.string(),
});

/** Matches ReviewItemDto  */
export const ReviewSchema = z.object({
  id: z.string(),
  author: z.string().nullable().optional(), // username or null
  course: z.string().nullable().optional(), // class code
  date: z.string(), // ISO-ish string
  rating: z.number().min(1).max(5).optional(), // allow missing for safety
  comment: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(), // ["TEST HEAVY", "MEAN"]
});

export const ProfessorResultSchema = z.object({
  id: z.string().optional(),
  slug: z.string(), // ensure we carry slug to client
  name: z.string(),
  department: z.string(),
  university: z.string(),
  overall: z.number().nullable().optional(),
  summary: z.string().nullable().optional(),
  buckets: z.array(BucketSchema).default([]),
  tags: z.array(TagSchema).default([]),
  reviews: z.array(ReviewSchema).default([]),
});

export type ProfessorResult = z.infer<typeof ProfessorResultSchema>;
