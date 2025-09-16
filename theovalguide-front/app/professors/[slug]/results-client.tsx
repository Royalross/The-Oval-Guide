"use client";

import { useMemo, useState } from "react";

import StickyNav from "@/components/nav/StickyNav";

import OverallScore from "@/app/professors/[slug]/components/OverallScore";
import ProfessorReviewDialog from "@/app/professors/[slug]/components/ProfessorReviewDialog";
import RatingDistribution from "@/app/professors/[slug]/components/RatingDistribution";
import ReviewsList from "@/app/professors/[slug]/components/ReviewsList";
import SummaryCard from "@/app/professors/[slug]/components/SummaryCard";
import TagPills from "@/app/professors/[slug]/components/TagPills";

import type { ProfessorResult } from "./schema";

export default function ResultsClient({ initial }: { initial: ProfessorResult }) {
  const [data, setData] = useState(initial);
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Ensure we always have a string slug for calls/props
  const slugFromPath = useMemo(() => {
    if (typeof window === "undefined") return "";
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts[1] ?? "";
  }, []);
  const professorSlug: string = data.slug ?? slugFromPath ?? "";

  const refreshSummary = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL;
      if (!api || !professorSlug) {
        setSummaryError("Summary refresh is not available right now.");
        return;
      }

      setIsRefreshingSummary(true);
      setSummaryError(null);

      const res = await fetch(
        `${api}/api/professors/${encodeURIComponent(professorSlug)}/summary`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        let message = `Refresh failed with status ${res.status}.`;
        try {
          const text = await res.text();
          if (text) {
            try {
              const parsed = JSON.parse(text) as { message?: unknown };
              if (typeof parsed?.message === "string") {
                message = parsed.message;
              } else {
                message = text;
              }
            } catch {
              message = text;
            }
          }
        } catch {}
        setSummaryError(message);
        return;
      }

      const json: unknown = await res.json();
      if (
        json &&
        typeof json === "object" &&
        "summary" in json &&
        typeof (json as any).summary === "string"
      ) {
        const summary = (json as { summary: string }).summary;
        setData((d) => ({ ...d, summary }));
      } else {
        setSummaryError("The server returned an unexpected response.");
      }
    } catch (err) {
      console.error("Failed to refresh professor summary:", err);
      setSummaryError("We couldn’t refresh the summary. Please try again later.");
    } finally {
      setIsRefreshingSummary(false);
    }
  };

  const total = data.buckets.reduce((s, b) => s + b.count, 0);

  return (
    <div className="bg-background text-foreground min-h-[100svh]">
      <StickyNav />

      <main className="container-responsive grid gap-4 py-6 md:gap-6 md:py-8">
        {/* Header + summary + right rail */}
        <section className="grid gap-4 md:grid-cols-12">
          <div className="space-y-4 md:col-span-8">
            <OverallScore
              name={data.name}
              dept={data.department}
              uni={data.university}
              overall={data.overall ?? 0}
            />
            {/* text must be a string */}
            <SummaryCard
              text={data.summary ?? ""}
              onRefresh={refreshSummary}
              isRefreshing={isRefreshingSummary}
              error={summaryError}
            />
          </div>

          <aside className="space-y-4 md:col-span-4">
            {/* Review CTA */}
            <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Share your experience</h3>
                {!!professorSlug && (
                  <ProfessorReviewDialog
                    professorSlug={professorSlug}
                    onCreated={() => window.location.reload()}
                  />
                )}
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Tell us which class you took and how it went.
              </p>
            </div>

            <RatingDistribution total={total} buckets={data.buckets} />
            <TagPills tags={data.tags} />
          </aside>
        </section>

        {/* Reviews list + right rail helper card */}
        <section className="grid gap-3 md:grid-cols-12">
          <div className="space-y-3 md:col-span-8">
            <h2 className="text-lg font-semibold">Student Reviews</h2>
            <ReviewsList reviews={data.reviews} />
          </div>

          <div className="md:col-span-4">
            <div className="space-y-4 md:sticky md:top-20">
              <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
                <h3 className="text-sm font-semibold">About this page</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  This page summarizes students’ experiences with this professor. Share your honest
                  feedback to help others.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
