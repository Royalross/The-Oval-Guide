"use client";

import { useState } from "react";

import { ClassReviewForm } from "@/components/forms/reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ReviewCta({ code }: { code: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Add your review</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Share your experience to help other students decide.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="shrink-0">
              Write a review
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Write a review for {code}</DialogTitle>
            </DialogHeader>

            <ClassReviewForm code={code} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
