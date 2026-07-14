import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-staff";
import { createStaffSchema } from "@/lib/validations";
import { createStaffAccount, listStaff, EmailTakenError } from "@/server/staff";
import { logAudit } from "@/server/audit";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const staff = await listStaff();
  return NextResponse.json({ staff });
}

export async function POST(req: Request) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  const parsed = createStaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const staff = await createStaffAccount(parsed.data);
    await logAudit({
      staffUserId: session!.user.id,
      action: "CREATE",
      entityType: "staff_user",
      entityId: staff!.id,
    });
    return NextResponse.json({ staff }, { status: 201 });
  } catch (err) {
    if (err instanceof EmailTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Failed to create staff account:", err);
    return NextResponse.json({ error: "Не удалось создать аккаунт" }, { status: 500 });
  }
}
