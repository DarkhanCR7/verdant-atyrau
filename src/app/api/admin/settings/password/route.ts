import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/require-staff";
import { changePasswordSchema } from "@/lib/validations";
import { changeOwnPassword, WrongPasswordError } from "@/server/staff";
import { logAudit } from "@/server/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function PATCH(req: Request) {
  const { session, response } = await requireStaff();
  if (response) return response;

  // Throttle password-change attempts to slow down credential guessing.
  const rl = checkRateLimit(`password-change:${session!.user.id}`, {
    windowMs: 5 * 60_000,
    max: 10,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    await changeOwnPassword(session!.user.id, parsed.data.currentPassword, parsed.data.newPassword);
  } catch (err) {
    if (err instanceof WrongPasswordError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Failed to change password:", err);
    return NextResponse.json({ error: "Не удалось сменить пароль" }, { status: 500 });
  }

  await logAudit({
    staffUserId: session!.user.id,
    action: "CHANGE_PASSWORD",
    entityType: "staff_user",
    entityId: session!.user.id,
  });

  return NextResponse.json({ success: true });
}
