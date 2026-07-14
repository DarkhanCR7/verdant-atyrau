import { NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/require-staff";
import { serviceInputSchema } from "@/lib/validations";
import { createService, listAllServices } from "@/server/catalog";
import { logAudit } from "@/server/audit";

export async function GET() {
  const { response } = await requireStaff();
  if (response) return response;
  const rows = await listAllServices();
  return NextResponse.json({ services: rows });
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

  const parsed = serviceInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const service = await createService(parsed.data);
  await logAudit({
    staffUserId: session!.user.id,
    action: "CREATE",
    entityType: "service",
    entityId: service.id,
  });

  return NextResponse.json({ service }, { status: 201 });
}
