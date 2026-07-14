"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  bio: string | null;
  isActive: boolean;
}

const emptyForm = { fullName: "", specialization: "", experienceYears: 0, bio: "" };

export function DoctorsManager({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addDoctor(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isActive: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Не удалось добавить врача");
    } else {
      setDoctors((d) => [...d, data.doctor]);
      setForm(emptyForm);
    }
    setSubmitting(false);
  }

  async function toggleActive(doctor: Doctor) {
    const res = await fetch(`/api/admin/doctors/${doctor.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !doctor.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setDoctors((ds) => ds.map((d) => (d.id === doctor.id ? data.doctor : d)));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="border-line overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-line bg-paper/60 text-ink/50 border-b text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3">Имя</th>
              <th className="px-4 py-3">Специализация</th>
              <th className="px-4 py-3">Стаж</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {doctors.map((d) => (
              <tr key={d.id}>
                <td className="text-deep px-4 py-3 font-medium">{d.fullName}</td>
                <td className="text-ink/70 px-4 py-3">{d.specialization}</td>
                <td className="font-data px-4 py-3">{d.experienceYears} лет</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      d.isActive ? "bg-sage/15 text-sage" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {d.isActive ? "Активен" : "Скрыт"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(d)}
                    className="text-ink/60 flex items-center gap-1 text-xs font-medium hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {d.isActive ? "Скрыть" : "Показать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={addDoctor}
        className="border-line h-fit space-y-3 rounded-2xl border bg-white p-5"
      >
        <h2 className="font-display text-deep flex items-center gap-2 text-base font-semibold">
          <Plus className="h-4 w-4" /> Добавить врача
        </h2>
        <input
          required
          placeholder="ФИО"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <input
          required
          placeholder="Специализация"
          value={form.specialization}
          onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <input
          required
          type="number"
          min={0}
          max={80}
          placeholder="Стаж (лет)"
          value={form.experienceYears}
          onChange={(e) => setForm((f) => ({ ...f, experienceYears: Number(e.target.value) }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <textarea
          placeholder="Краткое описание (необязательно)"
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={3}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-deep hover:bg-deep-light flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Добавить
        </button>
      </form>
    </div>
  );
}
