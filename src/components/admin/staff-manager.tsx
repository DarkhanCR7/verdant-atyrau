"use client";

import { useState } from "react";
import { Plus, Loader2, UserX, UserCheck } from "lucide-react";

interface Staff {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "STAFF";
  isActive: boolean;
}

const emptyForm = { fullName: "", email: "", password: "", role: "STAFF" as "ADMIN" | "STAFF" };

export function StaffManager({
  initialStaff,
  currentUserId,
}: {
  initialStaff: Staff[];
  currentUserId: string;
}) {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addStaff(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Не удалось добавить сотрудника");
    } else {
      setStaff((s) => [...s, data.staff]);
      setForm(emptyForm);
    }
    setSubmitting(false);
  }

  async function toggleActive(member: Staff) {
    const res = await fetch(`/api/admin/staff/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !member.isActive }),
    });
    if (res.ok) {
      const data = await res.json();
      setStaff((s) => s.map((x) => (x.id === member.id ? data.staff : x)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="divide-line border-line divide-y rounded-xl border">
        {staff.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-deep text-sm font-medium">
                {s.fullName}{" "}
                {s.id === currentUserId && <span className="text-ink/40 text-xs">(вы)</span>}
              </p>
              <p className="text-ink/50 text-xs">
                {s.email} · {s.role === "ADMIN" ? "Администратор" : "Сотрудник"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  s.isActive ? "bg-sage/15 text-sage" : "bg-ink/10 text-ink/50"
                }`}
              >
                {s.isActive ? "Активен" : "Отключён"}
              </span>
              {s.id !== currentUserId && (
                <button
                  type="button"
                  onClick={() => toggleActive(s)}
                  className="text-ink/60 flex items-center gap-1 text-xs font-medium hover:text-red-600"
                  title={s.isActive ? "Отключить доступ" : "Включить доступ"}
                >
                  {s.isActive ? (
                    <UserX className="h-3.5 w-3.5" />
                  ) : (
                    <UserCheck className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={addStaff} className="border-line space-y-3 rounded-xl border p-4">
        <h3 className="text-deep flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Добавить сотрудника
        </h3>
        <input
          required
          placeholder="Имя"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <input
          required
          type="email"
          placeholder="Email (логин)"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <input
          required
          type="password"
          placeholder="Временный пароль (мин. 8 символов, буквы + цифры)"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "STAFF" }))}
          className="border-line focus:border-sage w-full rounded-lg border px-3 py-2 text-sm outline-none"
        >
          <option value="STAFF">Сотрудник (видит только записи)</option>
          <option value="ADMIN">Администратор (полный доступ)</option>
        </select>
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
