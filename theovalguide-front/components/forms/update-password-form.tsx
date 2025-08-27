"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

/* ---------- Schema ---------- */
const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((v) => /[A-Z]/.test(v), "Add at least one uppercase letter")
      .refine((v) => /[a-z]/.test(v), "Add at least one lowercase letter")
      .refine((v) => /[0-9]/.test(v), "Add at least one number"),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match",
  });

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

/* ---------- Error helper ---------- */
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

/* ---------- Component ---------- */
export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", repeatPassword: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: UpdatePasswordValues) => {
    setSubmitError(null);
    setIsLoading(true);
    try {
      if (!token) throw new Error("Reset token not found in URL");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

      await axios.post(
        `${apiUrl}/auth/update-password`,
        { password: values.password, token },
        {
          headers: { "Content-Type": "application/json" },
          // withCredentials optional here; include only if your backend expects cookies on this route
        },
      );

      router.push("/auth/sign-in");
    } catch (err: unknown) {
      const fallback = "Unable to update password";
      setSubmitError(getErrorMessage(err) || fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const tokenMissing = !token;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card text-foreground rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset className="flex flex-col gap-6" disabled={isLoading || tokenMissing}>
              {tokenMissing && (
                <p className="text-sm text-red-500" role="alert" aria-live="polite">
                  Reset token not found. Please use the link from your email.
                </p>
              )}

              {/* New password */}
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  aria-invalid={!!errors.password}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                <p className="text-muted-foreground text-xs">
                  At least 8 characters, with upper &amp; lower case letters and a number.
                </p>
              </div>

              {/* Repeat password */}
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repeat password</Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  placeholder="Repeat password"
                  aria-invalid={!!errors.repeatPassword}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("repeatPassword")}
                />
                {errors.repeatPassword && (
                  <p className="text-sm text-red-500">{errors.repeatPassword.message}</p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-red-500" role="alert" aria-live="polite">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                className="bg-brand hover:bg-brand-darker w-full text-[var(--brand-contrast)]"
              >
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
