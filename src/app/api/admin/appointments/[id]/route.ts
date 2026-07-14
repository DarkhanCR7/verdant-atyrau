import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/require-staff";
import { appointmentStatusUpdateSchema } from "@/lib/validations";
import { getAppointmentById, updateAppointmentStatus } from "@/server/appointments";
import { logAudit } from "@/server/audit";
import { z } from "zod";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const resolvedParams = await params;
  const paramsParsed = paramsSchema.safeParse(resolvedParams);
  if (!paramsParsed.success) {
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
  }

  const existing = await getAppointmentById(paramsParsed.data.id);
  if (!existing) {
    return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  const parsed = appointmentStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректный статус" }, { status: 422 });
  }

  const updated = await updateAppointmentStatus(paramsParsed.data.id, parsed.data.status);

  await logAudit({
    staffUserId: session!.user.id,
    action: "UPDATE_STATUS",
    entityType: "appointment",
    entityId: paramsParsed.data.id,
    details: `${existing.status} -> ${parsed.data.status}`,
  });

  return NextResponse.json({ appointment: updated });
}
