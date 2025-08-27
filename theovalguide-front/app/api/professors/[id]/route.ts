import { NextRequest, NextResponse } from "next/server";

// Same structure your page validates with Zod
function mockProfessor(id: string) {
  return {
    id,
    name: "Dr. Jordan Harper",
    department: "Computer Science",
    university: "Ohio State University",
    overall: 4.3,
    totalRatings: 128,
    buckets: [
      { label: "5", count: 62 },
      { label: "4", count: 37 },
      { label: "3", count: 18 },
      { label: "2", count: 7 },
      { label: "1", count: 4 },
    ],
    tags: [
      { id: "test-heavy", label: "TEST HEAVY" },
      { id: "caring", label: "CARING" },
      { id: "hard-grader", label: "HARD GRADER" },
      { id: "Yapper", label: "YAPP" },
    ],
    summary:
      "Students praise organization, clear slides, and helpful office hours. Tests lean conceptual over memorization and curve is modest. Workload medium-to-high near exams. A few note strict grading on late work.",
    reviews: [
      {
        id: "r1",
        author: "CS Sophomore",
        course: "CS 2201",
        date: "2025-03-11",
        rating: 5,
        comment:
          "Super clear lectures. Weekly quizzes keep you on track. Office hours are gold before exams.",
        tags: ["CARING"],
      },
      {
        id: "r2",
        author: "Anonymous",
        course: "CS 3300",
        date: "2025-02-03",
        rating: 4,
        comment:
          "Tests are tough but fair—study the concepts. Projects are a bit time-consuming.",
        tags: ["TEST HEAVY"],
      },
      {
        id: "r3",
        author: "Transfer Student",
        course: "CS 1100",
        date: "2024-11-20",
        rating: 3,
        comment:
          "Grading feels strict on deadlines. Otherwise good explanations and examples.",
        tags: ["HARD GRADER"],
      },
    ],
  };
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }, // Next 15: params is a Promise
) {
  const { id } = await context.params; // await it

  // 👉 When backend is ready, swap to your real API:
  // const api = process.env.NEXT_PUBLIC_API_URL!;
  // const res = await fetch(`${api}/professors/${encodeURIComponent(id)}`, { cache: "no-store", headers: { Accept: "application/json" }});
  // return NextResponse.json(await res.json(), { status: res.status });

  const data = mockProfessor(id);
  return NextResponse.json(data, { status: 200 });
}
