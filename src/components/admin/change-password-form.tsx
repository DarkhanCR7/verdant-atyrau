"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/lib/validations";
import type { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

type FormInput = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(values: FormInput) {
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/admin/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Не удалось сменить пароль");
      return;
    }
    setSuccess(true);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="currentPassword" className="text-ink mb-1.5 block text-sm font-semibold">
          Текущий пароль
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword")}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="newPassword" className="text-ink mb-1.5 block text-sm font-semibold">
          Новый пароль
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-ink mb-1.5 block text-sm font-semibold">
          Повторите новый пароль
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="bg-sage-light/25 text-deep flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
          <CheckCircle2 className="text-sage h-4 w-4" /> Пароль успешно изменён.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-deep hover:bg-deep-light flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Сохранить пароль
      </button>
    </form>
  );
}
