"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const forgotSchema = z.object({
  email: z.email("Enter a valid email address"),
});
type ForgotValues = z.infer<typeof forgotSchema>;

// Error helper
type ApiErrorBody = {
  detail?: string;
  message?: string;
  error?: string;
  errors?: string[];
};

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const body = data as ApiErrorBody;
      if (body.detail) return body.detail;
      if (body.message) return body.message;
      if (body.error) return body.error;
      if (Array.isArray(body.errors) && typeof body.errors[0] === "string") {
        return body.errors[0];
      }
    }
    return err.message ?? "Request failed";
  }
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/* -------------------- Component -------------------- */
export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: ForgotValues) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

      await axios.post(
        `${apiUrl}/auth/forgot-password`,
        { email: values.email },
        {
          headers: { "Content-Type": "application/json" },
          // pre-auth endpoint; cookies not required here
        },
      );

      setSuccess(true);
      reset();
    } catch (err: unknown) {
      const fallback = "Unable to send reset email";
      setSubmitError(getErrorMessage(err) || fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="rounded-2xl shadow-sm bg-card text-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If an account exists for that address, you&apos;ll receive a link
              to reset your password. Be sure to check your spam folder.
            </p>
            <div className="mt-4">
              <Link
                href="/auth/sign-in"
                className="text-sm underline underline-offset-4"
              >
                Return to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl shadow-sm bg-card text-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <fieldset className="flex flex-col gap-6" disabled={isLoading}>
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    aria-invalid={!!errors.email}
                    className="
                      bg-card text-foreground border border-border
                      placeholder:text-muted-foreground
                      focus:ring-1 ring-brand focus:border-[var(--brand)]
                    "
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p
                    className="text-sm text-red-500"
                    role="alert"
                    aria-live="polite"
                  >
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-darker text-[var(--brand-contrast)]"
                >
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </fieldset>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
