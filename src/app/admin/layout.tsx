import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // The /admin/login page renders its own full-screen layout without the shell.
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="bg-paper flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar role={session.user.role} />
      <div className="flex-1">
        <AdminTopbar
          name={session.user.name ?? session.user.email ?? "Сотрудник"}
          role={session.user.role}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
