"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutFromAdmin } from "@/lib/admin-logout";

export function AdminTopbar({ name, role }: { name: string; role: "ADMIN" | "STAFF" }) {
  const router = useRouter();

  return (
    <header className="border-line flex items-center justify-between border-b bg-white px-6 py-4">
      <div>
        <p className="text-deep text-sm font-semibold">{name}</p>
        <p className="text-ink/50 text-xs">{role === "ADMIN" ? "Администратор" : "Сотрудник"}</p>
      </div>
      <button
        type="button"
        onClick={() => logoutFromAdmin(router)}
        className="border-line text-ink/70 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition hover:border-red-300 hover:text-red-600"
      >
        <LogOut className="h-4 w-4" /> Выйти
      </button>
    </header>
  );
}
