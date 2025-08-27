import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function UpdatePasswordFormSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* label */}
          <Skeleton className="h-10 w-full" /> {/* input */}
        </div>
        <Skeleton className="h-10 w-full rounded-full" /> {/* submit btn */}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<UpdatePasswordFormSkeleton />}>
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
