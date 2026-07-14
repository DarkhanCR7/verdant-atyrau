"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";

interface Doctor {
  id: string;
  fullName: string;
}

interface AppointmentRow {
  appointment: {
    id: string;
    patientName: string;
    phone: string;
    email: string | null;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
    comment: string | null;
  };
  doctor: { id: string; fullName: string } | null;
  service: { id: string; name: string; priceKzt: number } | null;
}

const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "PENDING", label: "Ожидает" },
  { value: "CONFIRMED", label: "Подтверждено" },
  { value: "CANCELLED", label: "Отменено" },
  { value: "COMPLETED", label: "Завершено" },
  { value: "NO_SHOW", label: "Не пришёл" },
];

const NEXT_STATUS: Record<string, { value: string; label: string }[]> = {
  PENDING: [
    { value: "CONFIRMED", label: "Подтвердить" },
    { value: "CANCELLED", label: "Отменить" },
  ],
  CONFIRMED: [
    { value: "COMPLETED", label: "Отметить завершённым" },
    { value: "NO_SHOW", label: "Пациент не пришёл" },
    { value: "CANCELLED", label: "Отменить" },
  ],
  CANCELLED: [{ value: "PENDING", label: "Восстановить" }],
  COMPLETED: [],
  NO_SHOW: [{ value: "PENDING", label: "Восстановить" }],
};

export function AppointmentsTable({ doctors }: { doctors: Doctor[] }) {
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const pageSize = 15;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (status) params.set("status", status);
    if (doctorId) params.set("doctorId", doctorId);
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    const res = await fetch(`/api/admin/appointments?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setRows(data.rows);
      setTotal(data.total);
    }
    setLoading(false);
  }, [date, status, doctorId, search, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-filter-change pattern
    load();
  }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      await load();
    }
    setUpdatingId(null);
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="border-line flex flex-wrap items-end gap-3 rounded-2xl border bg-white p-4">
        <div>
          <label className="text-ink/60 mb-1 block text-xs font-semibold">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setPage(1);
              setDate(e.target.value);
            }}
            className="border-line focus:border-sage rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-ink/60 mb-1 block text-xs font-semibold">Статус</label>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="border-line focus:border-sage rounded-lg border px-3 py-2 text-sm outline-none"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-ink/60 mb-1 block text-xs font-semibold">Врач</label>
          <select
            value={doctorId}
            onChange={(e) => {
              setPage(1);
              setDoctorId(e.target.value);
            }}
            className="border-line focus:border-sage rounded-lg border px-3 py-2 text-sm outline-none"
          >
            <option value="">Все врачи</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px] flex-1">
          <label className="text-ink/60 mb-1 block text-xs font-semibold">Поиск</label>
          <div className="relative">
            <Search className="text-ink/40 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Имя или телефон"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="border-line focus:border-sage w-full rounded-lg border py-2 pr-3 pl-9 text-sm outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          className="border-line text-ink/70 hover:border-sage hover:text-sage flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Обновить
        </button>
      </div>

      <div className="border-line mt-4 overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-line bg-paper/60 text-ink/50 border-b text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3">Пациент</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Услуга</th>
              <th className="px-4 py-3">Врач</th>
              <th className="px-4 py-3">Дата и время</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {rows.map(({ appointment, doctor, service }) => (
              <tr key={appointment.id} className="align-top">
                <td className="px-4 py-3">
                  <p className="text-deep font-medium">{appointment.patientName}</p>
                  {appointment.comment && (
                    <p
                      className="text-ink/50 mt-0.5 max-w-[220px] truncate text-xs"
                      title={appointment.comment}
                    >
                      {appointment.comment}
                    </p>
                  )}
                </td>
                <td className="font-data px-4 py-3">
                  <a href={`tel:${appointment.phone}`} className="hover:text-sage">
                    {appointment.phone}
                  </a>
                </td>
                <td className="px-4 py-3">{service?.name ?? "—"}</td>
                <td className="px-4 py-3">{doctor?.fullName ?? "Любой"}</td>
                <td className="font-data px-4 py-3">
                  {new Date(appointment.appointmentDate + "T00:00:00").toLocaleDateString("ru-RU")}{" "}
                  {appointment.appointmentTime.slice(0, 5)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={appointment.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(NEXT_STATUS[appointment.status] ?? []).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={updatingId === appointment.id}
                        onClick={() => updateStatus(appointment.id, opt.value)}
                        className="border-line text-ink/70 hover:border-sage hover:text-sage rounded-full border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-ink/50 px-4 py-10 text-center">
                  Записей не найдено по выбранным фильтрам.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-ink/60 mt-4 flex items-center justify-between text-sm">
        <span>Всего записей: {total}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border-line rounded-lg border p-2 disabled:opacity-40"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border-line rounded-lg border p-2 disabled:opacity-40"
            aria-label="Следующая страница"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
