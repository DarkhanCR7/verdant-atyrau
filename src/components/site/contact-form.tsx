"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema } from "@/lib/validations";
import type { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

type ContactInput = z.infer<typeof contactMessageSchema>;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactMessageSchema) });

  async function onSubmit(values: ContactInput) {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не удалось отправить сообщение");
        setState("error");
        return;
      }
      setState("success");
      reset();
    } catch {
      setError("Ошибка сети. Попробуйте снова.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="border-sage/30 bg-sage-light/20 rounded-2xl border p-8 text-center">
        <CheckCircle2 className="text-sage mx-auto h-10 w-10" />
        <p className="text-deep mt-3 font-semibold">
          Сообщение отправлено. Мы скоро свяжемся с вами.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-deep mt-4 text-sm font-semibold underline"
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Оставьте это поле пустым</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div>
        <label htmlFor="name" className="text-ink mb-1.5 block text-sm font-semibold">
          Имя *
        </label>
        <input
          id="name"
          {...register("name")}
          className="border-line focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="text-ink mb-1.5 block text-sm font-semibold">
          Телефон *
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+7 777 123 45 67"
          {...register("phone")}
          className="border-line font-data focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="text-ink mb-1.5 block text-sm font-semibold">
          Сообщение *
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="border-line focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-deep hover:bg-deep-light flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Отправка...
          </>
        ) : (
          "Отправить сообщение"
        )}
      </button>
    </form>
  );
}
