import Link from "next/link";
import { CalendarDays, Clock3, Hourglass } from "lucide-react";
import { getDashboardStats, getTodayAppointments } from "@/server/appointments";
import { StatusBadge } from "@/components/admin/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, today] = await Promise.all([getDashboardStats(), getTodayAppointments()]);

  return (
    <div>
      <h1 className="font-display text-deep text-2xl font-bold">Обзор</h1>
      <p className="text-ink/60 mt-1 text-sm">
        Сегодня,{" "}
        {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border-line rounded-2xl border bg-white p-5">
          <div className="text-sage flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-medium">Сегодня записей</span>
          </div>
          <p className="font-data text-deep mt-2 text-3xl font-bold">{stats.today}</p>
        </div>
        <div className="border-line rounded-2xl border bg-white p-5">
          <div className="text-terracotta flex items-center gap-2">
            <Hourglass className="h-5 w-5" />
            <span className="text-sm font-medium">Ожидают подтверждения</span>
          </div>
          <p className="font-data text-deep mt-2 text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="border-line rounded-2xl border bg-white p-5">
          <div className="text-deep flex items-center gap-2">
            <Clock3 className="h-5 w-5" />
            <span className="text-sm font-medium">На этой неделе</span>
          </div>
          <p className="font-data text-deep mt-2 text-3xl font-bold">{stats.thisWeek}</p>
        </div>
      </div>

      <div className="border-line mt-8 rounded-2xl border bg-white">
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-deep text-lg font-semibold">Записи на сегодня</h2>
          <Link
            href="/admin/appointments"
            className="text-deep hover:text-sage text-sm font-semibold"
          >
            Все записи →
          </Link>
        </div>
        {today.rows.length === 0 ? (
          <p className="text-ink/50 px-5 py-10 text-center text-sm">На сегодня записей пока нет.</p>
        ) : (
          <div className="divide-line divide-y">
            {today.rows.map(({ appointment, doctor, service }) => (
              <div
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="text-deep font-medium">{appointment.patientName}</p>
                  <p className="text-ink/60 text-sm">
                    {service?.name ?? "—"} {doctor ? `· ${doctor.fullName}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-data text-ink/70 text-sm">
                    {appointment.appointmentTime.slice(0, 5)}
                  </span>
                  <StatusBadge status={appointment.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
