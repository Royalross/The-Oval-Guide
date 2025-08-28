"use client";

import Link from "next/link";

import StarRow from "./StarRow";

import type { ClassResult } from "../page";

export default function ProfessorsList({ profs }: { profs: ClassResult["professors"] }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <h3 className="text-sm font-semibold">Professors who taught this class</h3>
      <ul className="mt-3 space-y-2">
        {profs.map((p) => (
          <li
            key={p.id}
            className="border-border bg-card hover:bg-muted/70 flex items-center justify-between gap-2 rounded-md border p-3"
          >
            <div className="min-w-0">
              <Link href={`/professors/${p.id}`} className="font-medium hover:underline">
                {p.name}
              </Link>
              {typeof p.overall === "number" && (
                <p className="text-muted-foreground text-xs">Overall: {p.overall.toFixed(1)}/5</p>
              )}
            </div>
            {typeof p.overall === "number" && <StarRow rating={p.overall} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
