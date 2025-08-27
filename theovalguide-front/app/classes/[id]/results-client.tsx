"use client";

import { useState } from "react";
import type { ClassResult } from "./page";

import StickyNav from "./components/StickyNav";
import ClassHeader from "./components/ClassHeader";
import SummaryCard from "./components/SummaryCard";
import DistributionCard, { Bucket } from "./components/DistributionCard";
import TagPills from "./components/TagPills";
import ProfessorsList from "./components/ProfessorsList";
import AdviceList from "./components/AdviceList";
import NotesCta from "./components/NotesCta";

export default function ResultsClient({ initial }: { initial: ClassResult }) {
  const [data, setData] = useState<ClassResult>(initial);

  const refreshSummary = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (!api) return;
      const res = await fetch(
        `${api}/classes/${encodeURIComponent(data.id)}/summary`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (res.ok) {
        const json: unknown = await res.json();
        const summary =
          json &&
          typeof json === "object" &&
          "summary" in json &&
          typeof (json as { summary?: string }).summary === "string"
            ? (json as { summary: string }).summary
            : data.summary;

        setData((prev) => ({ ...prev, summary }));
      }
    } catch {
      // ignore for now
    }
  };

  const totalFor = (b?: Bucket[]) => (b ?? []).reduce((s, x) => s + x.count, 0);

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <StickyNav />

      <main className="container-responsive py-6 md:py-8 grid gap-6 md:gap-8">
        {/* Header section */}
        <section className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8 space-y-4">
            <ClassHeader
              code={data.code}
              title={data.title}
              dept={data.department}
              uni={data.university}
              difficulty={data.difficulty}
            />
            <SummaryCard text={data.summary} onRefresh={refreshSummary} />
          </div>

          <aside className="md:col-span-4 space-y-4">
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
          </aside>
        </section>

        {/* Body */}
        <section className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8 space-y-4">
            <ProfessorsList profs={data.professors} />
            <AdviceList advices={data.advices} />
          </div>

          {/* Right rail */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-20 space-y-4">
              <NotesCta hasNotes={Boolean(data.notes?.length)} />
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h3 className="text-sm font-semibold">About this page</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is a preauth view. Advice and notes appear here for
                  signed-in users.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
