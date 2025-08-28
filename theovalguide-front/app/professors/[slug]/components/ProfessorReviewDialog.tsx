"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import ProfessorReviewForm from "./ProfessorReviewForm";

export default function ProfessorReviewDialog({
  professorSlug,
  onCreated,
}: {
  professorSlug: string;
  onCreated?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand hover:bg-brand-darker text-[var(--brand-contrast)]">
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience and the class you took with this professor.
          </DialogDescription>
        </DialogHeader>

        <ProfessorReviewForm
          professorSlug={professorSlug}
          onCreated={() => {
            setOpen(false);
            onCreated?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
