import { listAllDoctors } from "@/server/catalog";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DoctorsManager } from "@/components/admin/doctors-manager";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/admin");

  const doctors = await listAllDoctors();

  return (
    <div>
      <h1 className="font-display text-deep text-2xl font-bold">Врачи</h1>
      <p className="text-ink/60 mt-1 text-sm">Управление списком врачей клиники.</p>
      <div className="mt-6">
        <DoctorsManager initialDoctors={doctors} />
      </div>
    </div>
  );
}
