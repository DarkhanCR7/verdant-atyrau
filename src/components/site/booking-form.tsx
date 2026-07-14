"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentInputSchema, type AppointmentInput } from "@/lib/validations";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
}

interface Service {
  id: string;
  name: string;
  category: string;
  priceKzt: number;
}

function nextBusinessDays(count: number): string[] {
  const dates: string[] = [];
  const d = new Date();
  while (dates.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) {
      // skip Sundays (clinic closed)
      dates.push(d.toISOString().slice(0, 10));
    }
  }
  return dates;
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export function BookingForm({ doctors, services }: { doctors: Doctor[]; services: Service[] }) {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const dateOptions = useMemo(() => nextBusinessDays(14), []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentInputSchema),
    defaultValues: { appointmentDate: dateOptions[0] },
  });

  const selectedDoctorId = watch("doctorId");
  const selectedDate = watch("appointmentDate");

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setTakenSlots([]);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/appointments/slots?doctorId=${selectedDoctorId}&date=${selectedDate}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => setTakenSlots(data.taken ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, [selectedDoctorId, selectedDate]);

  async function onSubmit(values: AppointmentInput) {
    setSubmitState("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Не удалось создать запись");
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
      reset({ appointmentDate: dateOptions[0] });
    } catch {
      setServerError("Ошибка сети. Проверьте подключение и попробуйте снова.");
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div className="border-sage/30 bg-sage-light/20 rounded-2xl border p-8 text-center">
        <CheckCircle2 className="text-sage mx-auto h-12 w-12" />
        <h3 className="font-display text-deep mt-4 text-2xl font-semibold">Заявка отправлена</h3>
        <p className="text-ink/70 mt-2">
          Мы свяжемся с вами по телефону для подтверждения записи. Если у вас срочный вопрос —
          позвоните нам напрямую.
        </p>
        <button
          type="button"
          onClick={() => setSubmitState("idle")}
          className="border-deep text-deep hover:bg-deep mt-5 rounded-full border px-5 py-2 text-sm font-semibold hover:text-white"
        >
          Записать ещё одного пациента
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users via CSS, bots will fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Оставьте это поле пустым</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="patientName" className="text-ink mb-1.5 block text-sm font-semibold">
            Ваше имя *
          </label>
          <input
            id="patientName"
            type="text"
            autoComplete="name"
            {...register("patientName")}
            className="border-line text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
            aria-invalid={!!errors.patientName}
            aria-describedby={errors.patientName ? "patientName-error" : undefined}
          />
          {errors.patientName && (
            <p id="patientName-error" className="mt-1 text-sm text-red-600">
              {errors.patientName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="text-ink mb-1.5 block text-sm font-semibold">
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+7 777 123 45 67"
            autoComplete="tel"
            {...register("phone")}
            className="border-line font-data text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-ink mb-1.5 block text-sm font-semibold">
          Email (необязательно)
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="border-line text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className="text-ink mb-1.5 block text-sm font-semibold">
            Услуга *
          </label>
          <select
            id="serviceId"
            {...register("serviceId")}
            className="border-line text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Выберите услугу
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.priceKzt.toLocaleString("ru-RU")} ₸
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="doctorId" className="text-ink mb-1.5 block text-sm font-semibold">
            Врач (по желанию)
          </label>
          <select
            id="doctorId"
            {...register("doctorId")}
            className="border-line text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
            defaultValue=""
          >
            <option value="">Любой свободный врач</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName} — {d.specialization}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="appointmentDate" className="text-ink mb-1.5 block text-sm font-semibold">
            Дата *
          </label>
          <select
            id="appointmentDate"
            {...register("appointmentDate")}
            className="border-line font-data text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
          >
            {dateOptions.map((d) => (
              <option key={d} value={d}>
                {new Date(d + "T00:00:00").toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                })}
              </option>
            ))}
          </select>
          {errors.appointmentDate && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="appointmentTime" className="text-ink mb-1.5 block text-sm font-semibold">
            Время *
          </label>
          <select
            id="appointmentTime"
            {...register("appointmentTime")}
            className="border-line font-data text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Выберите время
            </option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t} disabled={takenSlots.includes(t)}>
                {t} {takenSlots.includes(t) ? "(занято)" : ""}
              </option>
            ))}
          </select>
          {errors.appointmentTime && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="text-ink mb-1.5 block text-sm font-semibold">
          Комментарий (необязательно)
        </label>
        <textarea
          id="comment"
          rows={3}
          {...register("comment")}
          className="border-line text-ink focus:border-sage w-full rounded-lg border bg-white px-4 py-2.5 outline-none"
          placeholder="Опишите жалобу или пожелания к записи"
        />
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || submitState === "loading"}
        className="bg-deep hover:bg-deep-light flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition disabled:opacity-60"
      >
        {isSubmitting || submitState === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Отправка...
          </>
        ) : (
          "Записаться на приём"
        )}
      </button>
      <p className="text-ink/50 text-center text-xs">
        Отправляя форму, вы соглашаетесь на обработку персональных данных для целей записи на приём.
      </p>
    </form>
  );
}
