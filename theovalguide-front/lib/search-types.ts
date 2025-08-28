import { z } from "zod";

export const ProfessorHit = z.object({
  kind: z.literal("professor"),
  id: z.string(), // slug
  title: z.string(),
  subtitle: z.string(),
  overall: z.number().nullish(),
});

export const ClassHit = z.object({
  kind: z.literal("class"),
  id: z.string(), // code (e.g., "CS 2201")
  title: z.string(),
  subtitle: z.string(),
  difficulty: z.number().nullish(),
});

export const SearchItemSchema = z.union([ProfessorHit, ClassHit]);
export type SearchItem = z.infer<typeof SearchItemSchema>;

export const SearchResponseSchema = z.object({ items: z.array(SearchItemSchema) });
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
