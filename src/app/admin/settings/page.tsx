import { auth } from "@/auth";
import { listStaff } from "@/server/staff";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { StaffManager } from "@/components/admin/staff-manager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";
  const staff = isAdmin ? await listStaff() : [];

  return (
    <div>
      <h1 className="font-display text-deep text-2xl font-bold">Настройки</h1>
      <p className="text-ink/60 mt-1 text-sm">Пароль аккаунта и управление сотрудниками.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border-line h-fit rounded-2xl border bg-white p-6">
          <h2 className="font-display text-deep text-lg font-semibold">Сменить пароль</h2>
          <p className="text-ink/60 mt-1 text-sm">
            Рекомендуем сменить пароль сразу после первого входа, особенно если использовался
            стандартный пароль из инструкции по установке.
          </p>
          <div className="mt-5">
            <ChangePasswordForm />
          </div>
        </div>

        {isAdmin && (
          <div className="border-line h-fit rounded-2xl border bg-white p-6">
            <h2 className="font-display text-deep text-lg font-semibold">Сотрудники</h2>
            <p className="text-ink/60 mt-1 text-sm">
              Добавляйте аккаунты для персонала клиники — без обращения к разработчику.
            </p>
            <div className="mt-5">
              <StaffManager initialStaff={staff} currentUserId={session!.user.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
