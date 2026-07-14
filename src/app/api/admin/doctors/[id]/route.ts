import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-staff";
import { doctorInputSchema } from "@/lib/validations";
import { updateDoctor, deleteDoctor } from "@/server/catalog";
import { logAudit } from "@/server/audit";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const resolvedParams = await params;
  const paramsParsed = paramsSchema.safeParse(resolvedParams);
  if (!paramsParsed.success)
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  const parsed = doctorInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const doctor = await updateDoctor(paramsParsed.data.id, parsed.data);
  await logAudit({
    staffUserId: session!.user.id,
    action: "UPDATE",
    entityType: "doctor",
    entityId: paramsParsed.data.id,
  });

  return NextResponse.json({ doctor });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const resolvedParams = await params;
  const paramsParsed = paramsSchema.safeParse(resolvedParams);
  if (!paramsParsed.success)
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });

  const doctor = await deleteDoctor(paramsParsed.data.id);
  await logAudit({
    staffUserId: session!.user.id,
    action: "DEACTIVATE",
    entityType: "doctor",
    entityId: paramsParsed.data.id,
  });

  return NextResponse.json({ doctor });
}
