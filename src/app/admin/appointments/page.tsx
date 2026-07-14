import { listAllDoctors } from "@/server/catalog";
import { AppointmentsTable } from "@/components/admin/appointments-table";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const doctors = await listAllDoctors();

  return (
    <div>
      <h1 className="font-display text-deep text-2xl font-bold">Записи пациентов</h1>
      <p className="text-ink/60 mt-1 text-sm">
        Кто, к какому врачу и на какое время записан — с возможностью менять статус.
      </p>
      <div className="mt-6">
        <AppointmentsTable doctors={doctors} />
      </div>
    </div>
  );
}
