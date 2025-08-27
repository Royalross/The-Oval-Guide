"use client";

import Link from "next/link";
import StarRow from "./StarRow";
import type { ClassResult } from "../page";

export default function ProfessorsList({
  profs,
}: {
  profs: ClassResult["professors"];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold">
        Professors who taught this class
      </h3>
      <ul className="mt-3 space-y-2">
        {profs.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-card p-3 hover:bg-muted/70"
          >
            <div className="min-w-0">
              <Link
                href={`/professors/${p.id}`}
                className="font-medium hover:underline"
              >
                {p.name}
              </Link>
              {typeof p.overall === "number" && (
                <p className="text-xs text-muted-foreground">
                  Overall: {p.overall.toFixed(1)}/5
                </p>
              )}
            </div>
            {typeof p.overall === "number" && <StarRow rating={p.overall} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
