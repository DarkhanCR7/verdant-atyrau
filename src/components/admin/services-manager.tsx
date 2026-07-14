"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  priceKzt: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  priceKzt: 0,
  durationMinutes: 30,
  category: "Диагностика",
};

export function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, isActive: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Не удалось добавить услугу");
    } else {
      setServices((s) => [...s, data.service]);
      setForm(emptyForm);
    }
    setSubmitting(false);
  }

  async function toggleActive(service: Service) {
    const res = await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !service.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setServices((s) => s.map((x) => (x.id === service.id ? data.service : x)));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="border-line overflow-hidden rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-line bg-paper/60 text-ink/50 border-b text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="text-deep px-4 py-3 font-medium">{s.name}</td>
                <td className="text-ink/70 px-4 py-3">{s.category}</td>
                <td className="font-data px-4 py-3">{s.priceKzt.toLocaleString("ru-RU")} ₸</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.isActive ? "bg-sage/15 text-sage" : "bg-ink/10 text-ink/50"
                    }`}
                  >
                    {s.isActive ? "Активна" : "Скрыта"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(s)}
                    className="text-ink/60 flex items-center gap-1 text-xs font-medium hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {s.isActive ? "Скрыть" : "Показать"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={addService}
        className="border-line h-fit space-y-3 rounded-2xl border bg-white p-5"
      >
        <h2 className="font-display text-deep flex items-center gap-2 text-base font-semibold">
          <Plus className="h-4 w-4" /> Добавить услугу
        </h2>
        <input
          required
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <input
          required
          placeholder="Категория"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <div className="flex gap-2">
          <input
            required
            type="number"
            min={0}
            placeholder="Цена (KZT)"
            value={form.priceKzt}
            onChange={(e) => setForm((f) => ({ ...f, priceKzt: Number(e.target.value) }))}
            className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
          />
          <input
            required
            type="number"
            min={5}
            placeholder="Мин."
            value={form.durationMinutes}
            onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
            className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>
        <textarea
          placeholder="Описание (необязательно)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
