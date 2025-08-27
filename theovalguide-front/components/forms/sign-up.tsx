"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

/* ---------- Zod schema ---------- */
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(32, "Username must be at most 32 characters")
      .regex(/^[a-zA-Z0-9._-]+$/, "Only letters, numbers, dots, underscores, and hyphens"),
    email: z.string().email("Enter a valid email address"),
    schoolEmail: z
      .string()
      .email("Enter a valid school email")
      .refine((v) => v.endsWith(".edu"), "School email must end with .edu"),
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

type SignUpValues = z.infer<typeof signUpSchema>;

/* ---------- mini typesafe error helper ---------- */
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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      schoolEmail: "",
      password: "",
      repeatPassword: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: SignUpValues) => {
    setSubmitError(null);
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

      // Send schoolEmail for verification; backend should not persist it
      await axios.post(
        `${apiUrl}/auth/register`,
        {
          username: values.username,
          email: values.email,
          schoolEmail: values.schoolEmail,
          password: values.password,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      router.push("/auth/sign-in");
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card text-foreground rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset className="flex flex-col gap-6" disabled={isLoading}>
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your username"
                  aria-invalid={!!errors.username}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* School Email (sent for verification, not persisted) */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="schoolEmail">School Email</Label>
                  <span className="text-muted-foreground ml-auto inline-block text-sm">
                    Used to verify — not stored
                  </span>
                </div>
                <Input
                  id="schoolEmail"
                  type="email"
                  placeholder="name@osu.edu"
                  aria-invalid={!!errors.schoolEmail}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("schoolEmail")}
                />
                {errors.schoolEmail && (
                  <p className="text-sm text-red-500">{errors.schoolEmail.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Repeat Password */}
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repeat Password</Label>
                <Input
                  id="repeatPassword"
                  type="password"
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
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>

              <Button type="button" variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </fieldset>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
