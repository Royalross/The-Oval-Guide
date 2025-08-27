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

// Zod schema
const signInSchema = z.object({
  login: z.string().min(1, "Enter your email or username").max(254, "Too long"),
  password: z.string().min(1, "Enter your password"),
});
type SignInValues = z.infer<typeof signInSchema>;

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
      if (Array.isArray(body.errors) && typeof body.errors[0] === "string") return body.errors[0];
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

// Optional success payload; otherwise rely on 2xx
const LoginResponseSchema = z.object({ ok: z.boolean().optional() });

export function SignInForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { login: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: SignInValues) => {
    setSubmitError(null);
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not defined");

      const res = await axios.post(
        `${apiUrl}/auth/login`,
        { login: values.login, password: values.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // HttpOnly cookie set by backend
        },
      );

      const maybeOk = LoginResponseSchema.safeParse(res.data);
      if (
        res.status >= 200 &&
        res.status < 300 &&
        (maybeOk.success ? (maybeOk.data.ok ?? true) : true)
      ) {
        router.push("/dashboard");
        return;
      }
      throw new Error("Unexpected login response");
    } catch (err: unknown) {
      const fallback = "Invalid email/username or password";
      setSubmitError(getErrorMessage(err) || fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-card text-foreground rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <fieldset className="flex flex-col gap-6" disabled={isLoading}>
              {/* Login */}
              <div className="grid gap-2">
                <Label htmlFor="login">Email or Username</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Email or username"
                  aria-invalid={!!errors.login}
                  className="bg-card text-foreground border-border placeholder:text-muted-foreground ring-brand border focus:border-[var(--brand)] focus:ring-1"
                  {...register("login")}
                />
                {errors.login && <p className="text-sm text-red-500">{errors.login.message}</p>}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forget-password"
                    className="ml-auto inline-block text-sm underline underline-offset-4"
                  >
                    Forgot your password?
                  </Link>
                </div>
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

              {submitError && (
                <p className="text-sm text-red-500" role="alert" aria-live="polite">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                className="bg-brand hover:bg-brand-darker w-full text-[var(--brand-contrast)]"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </fieldset>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
