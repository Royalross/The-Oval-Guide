// app/api/classes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

function mockClass(id: string) {
  return {
    id,
    code: "CS 2201",
    title: "Data Structures",
    department: "Computer Science",
    university: "Ohio State University",
    credits: 3,
    // Public (preauth) fields:
    difficulty: 3.6, // 1-5
    totalRatings: 212,
    tags: [
      { id: "heavy-workload", label: "HEAVY WORKLOAD" },
      { id: "project-based", label: "PROJECT BASED" },
      { id: "mathy", label: "MATH HEAVY" },
    ],
    summary:
      "Concept-focused with weekly labs. Projects emphasize correctness and asymptotic reasoning. Exams stress algorithmic thinking over memorization.",
    ratingBuckets: [
      { label: "5", count: 84 },
      { label: "4", count: 72 },
      { label: "3", count: 37 },
      { label: "2", count: 13 },
      { label: "1", count: 6 },
    ],
    // Professors known from review data (public)
    professors: [
      { id: "harper", name: "Dr. Jordan Harper", overall: 4.3 },
      { id: "garcia", name: "Prof. Alicia Garcia", overall: 4.0 },
    ],
    // Advice is public and can be browsed by anyone
    advice: [
      {
        id: "a1",
        author: "CS Junior",
        date: "2025-02-12",
        upvotes: 23,
        text: "Start projects early—autograders are strict on edge cases. Practice writing proofs for asymptotic bounds.",
      },
      {
        id: "a2",
        author: "Transfer Student",
        date: "2024-10-04",
        upvotes: 11,
        text: "Lecture slides are good, but the exercises in recitation make the concepts click. Go to office hours.",
      },
    ],
    // Notes are gated for auth users — show only a teaser in preauth
    notesPreview: {
      count: 5, // total notes available if signed in
      samples: [
        { id: "n1", title: "Midterm 1 Review Outline (Spring 2025)" },
        { id: "n2", title: "Heap & Priority Queue Cheatsheet" },
      ],
    },
  };
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }, // Next 15: params is a Promise
) {
  const { id } = await context.params; // await it

  // 👉 When backend is ready, swap to your real API:
  // const api = process.env.NEXT_PUBLIC_API_URL!;
  // const res = await fetch(`${api}/classes/${encodeURIComponent(id)}`, { cache: "no-store", headers: { Accept: "application/json" }});
  // return NextResponse.json(await res.json(), { status: res.status });

  const data = mockClass(id);
  return NextResponse.json(data, { status: 200 });
}

/*
NOTE:
If your page schema expects fields like `gradeBuckets` / `difficultyBuckets`
and `advices` instead of `ratingBuckets` / `advice`, rename the mock fields here
to match your Zod schema to avoid validation errors.
*/
