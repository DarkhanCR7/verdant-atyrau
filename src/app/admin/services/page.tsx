import { listAllServices } from "@/server/catalog";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ServicesManager } from "@/components/admin/services-manager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/admin");

  const services = await listAllServices();

  return (
    <div>
      <h1 className="font-display text-deep text-2xl font-bold">Услуги</h1>
      <p className="text-ink/60 mt-1 text-sm">Управление прайс-листом клиники.</p>
      <div className="mt-6">
        <ServicesManager initialServices={services} />
      </div>
    </div>
  );
}
