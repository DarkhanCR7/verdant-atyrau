import { NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/require-staff";
import { doctorInputSchema } from "@/lib/validations";
import { createDoctor, listAllDoctors } from "@/server/catalog";
import { logAudit } from "@/server/audit";

export async function GET() {
  const { response } = await requireStaff();
  if (response) return response;
  const rows = await listAllDoctors();
  return NextResponse.json({ doctors: rows });
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

  const parsed = doctorInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const doctor = await createDoctor(parsed.data);
  await logAudit({
    staffUserId: session!.user.id,
    action: "CREATE",
    entityType: "doctor",
    entityId: doctor.id,
  });

  return NextResponse.json({ doctor }, { status: 201 });
}
