"use client";

import { useState } from "react";
import type { ProfessorResult } from "./page";
import StickyNav from "@/app/professors/[id]/components/StickyNav";
import OverallScore from "@/app/professors/[id]/components/OverallScore";
import SummaryCard from "@/app/professors/[id]/components/SummaryCard";
import RatingDistribution from "@/app/professors/[id]/components/RatingDistribution";
import TagPills from "@/app/professors/[id]/components/TagPills";
import ReviewsList from "@/app/professors/[id]/components/ReviewsList";

export default function ResultsClient({
  initial,
}: {
  initial: ProfessorResult;
}) {
  const [data, setData] = useState(initial);

  const refreshSummary = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (!api) return;
      const res = await fetch(
        `${api}/professors/${encodeURIComponent(data.id)}/summary`,
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
        const { summary } = await res.json();
        setData((d) => ({ ...d, summary: String(summary ?? d.summary) }));
      }
    } catch {}
  };

  const total = data.buckets.reduce((s, b) => s + b.count, 0);

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <StickyNav />
      <main className="container-responsive py-6 md:py-8 grid gap-6 md:gap-8">
        <section className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8 space-y-4">
            <OverallScore
              name={data.name}
              dept={data.department}
              uni={data.university}
              overall={data.overall}
            />
            <SummaryCard text={data.summary} onRefresh={refreshSummary} />
          </div>
          <aside className="md:col-span-4 space-y-4">
            <RatingDistribution total={total} buckets={data.buckets} />
            <TagPills tags={data.tags} />
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-lg font-semibold">Student Reviews</h2>
            <ReviewsList reviews={data.reviews} />
          </div>
          <div className="md:col-span-4">
            <div className="md:sticky md:top-20 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h3 className="text-sm font-semibold">About this page</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This page tells you everything know about others experience
                  with this professor, please only share your truth
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
