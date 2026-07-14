"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffLoginSchema } from "@/lib/validations";
import type { z } from "zod";
import { Eye, Loader2 } from "lucide-react";

type LoginInput = z.infer<typeof staffLoginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(staffLoginSchema) });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Неверный email или пароль.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/admin";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="bg-deep flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-center gap-2">
          <span className="bg-deep flex h-11 w-11 items-center justify-center rounded-full text-white">
            <Eye className="h-5 w-5" />
          </span>
          <span className="font-display text-deep text-2xl font-bold">Verdant</span>
        </div>
        <h1 className="font-display text-deep mt-6 text-center text-xl font-semibold">
          Вход для сотрудников
        </h1>
        <p className="text-ink/60 mt-1 text-center text-sm">Доступ только для персонала клиники</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="text-ink mb-1.5 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              {...register("email")}
              className="border-line focus:border-sage w-full rounded-lg border px-4 py-2.5 outline-none"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-ink mb-1.5 block text-sm font-semibold">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="border-line focus:border-sage w-full rounded-lg border px-4 py-2.5 outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-deep hover:bg-deep-light flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Вход...
              </>
            ) : (
              "Войти"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
