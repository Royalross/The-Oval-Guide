"use client";

import { useState } from "react";

import StickyNav from "@/components/nav/StickyNav";

import AdviceList from "./components/AdviceList";
import ClassHeader from "./components/ClassHeader";
import DistributionCard from "./components/DistributionCard";
import NotesCta from "./components/NotesCta";
import ProfessorsList from "./components/ProfessorsList";
import ReviewCta from "./components/ReviewCta";
import SummaryCard from "./components/SummaryCard";
import TagPills from "./components/TagPills";

import type { Bucket } from "./components/DistributionCard";
import type { ClassResult } from "./page";

export default function ResultsClient({ initial }: { initial: ClassResult }) {
  const [data, setData] = useState<ClassResult>(initial);

  const refreshSummary = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (!api || !data.code) return;

      const res = await fetch(`${api}/api/classes/${encodeURIComponent(data.code)}/summary`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const json: unknown = await res.json();
        const summary =
          json && typeof json === "object" && "summary" in json && true
            ? (json as { summary: string }).summary
            : data.summary;

        setData((prev) => ({ ...prev, summary }));
      }
    } catch {
      // ignore
    }
  };

  const totalFor = (b?: Bucket[]) => (b ?? []).reduce((s, x) => s + x.count, 0);

  return (
    <div className="bg-background text-foreground min-h-[100svh]">
      <StickyNav />

      <main className="container-responsive grid gap-4 py-6 md:gap-6 md:py-8">
        {/* Header section */}
        <section className="grid gap-4 md:grid-cols-12">
          <div className="space-y-4 md:col-span-8">
            <ClassHeader
              code={data.code}
              title={data.title}
              dept={data.department}
              uni={data.university}
              difficulty={data.difficulty}
            />
            <SummaryCard text={data.summary} onRefresh={refreshSummary} />
          </div>

          <aside className="space-y-4 md:col-span-4">
            {/* NEW: Write a review CTA */}
            <ReviewCta code={data.code} />

            {data.gradeBuckets?.length ? (
              <DistributionCard
                title="Grade distribution"
                total={totalFor(data.gradeBuckets)}
                buckets={data.gradeBuckets}
              />
            ) : null}

            {data.difficultyBuckets?.length ? (
              <DistributionCard
                title="Difficulty distribution"
                total={totalFor(data.difficultyBuckets)}
                buckets={data.difficultyBuckets}
              />
            ) : null}

            <TagPills tags={data.tags} />
            <NotesCta hasNotes={Boolean(data.notes?.length)} />
          </aside>
        </section>

        {/* Body */}
        <section className="grid gap-3 md:grid-cols-12">
          <div className="space-y-3 md:col-span-8">
            <ProfessorsList profs={data.professors} />
            <AdviceList advices={data.advices} />
          </div>

          {/* Right rail helper card */}
          <div className="md:col-span-4">
            <div className="space-y-4 md:sticky md:top-20">
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <h3 className="text-sm font-semibold">About this page</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  This is a pre-auth view. Advice and notes appear here for signed-in users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
