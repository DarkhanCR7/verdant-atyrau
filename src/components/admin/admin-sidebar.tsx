"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Stethoscope, ListTree, Settings } from "lucide-react";

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, exact: true },
  { href: "/admin/appointments", label: "Записи", icon: CalendarClock },
  { href: "/admin/doctors", label: "Врачи", icon: Stethoscope, adminOnly: true },
  { href: "/admin/services", label: "Услуги", icon: ListTree, adminOnly: true },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar({ role }: { role: "ADMIN" | "STAFF" }) {
  const pathname = usePathname();

  return (
    <aside className="border-line hidden w-60 shrink-0 border-r bg-white md:block">
      <div className="p-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="border-deep relative inline-block h-7 w-7 rounded-full border-2">
            <span className="bg-sage absolute inset-1.5 rounded-full" />
          </span>
          <span className="font-display text-deep text-lg font-bold">Verdant</span>
        </Link>
        <p className="text-ink/40 mt-1 text-xs">Панель сотрудника</p>
      </div>
      <nav className="space-y-1 px-3">
        {links
          .filter((l) => !l.adminOnly || role === "ADMIN")
          .map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-deep text-white" : "text-ink/70 hover:bg-sage-light/25"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
