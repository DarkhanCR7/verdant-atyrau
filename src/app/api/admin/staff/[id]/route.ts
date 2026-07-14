import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/require-staff";
import { setStaffActive } from "@/server/staff";
import { logAudit } from "@/server/audit";

const paramsSchema = z.object({ id: z.string().uuid() });
const bodySchema = z.object({ isActive: z.boolean() });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const resolvedParams = await params;
  const paramsParsed = paramsSchema.safeParse(resolvedParams);
  if (!paramsParsed.success)
    return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });

  if (paramsParsed.data.id === session!.user.id) {
    return NextResponse.json(
      { error: "Нельзя деактивировать собственный аккаунт" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные" }, { status: 422 });

  const staff = await setStaffActive(paramsParsed.data.id, parsed.data.isActive);

  await logAudit({
    staffUserId: session!.user.id,
    action: parsed.data.isActive ? "ACTIVATE" : "DEACTIVATE",
    entityType: "staff_user",
    entityId: paramsParsed.data.id,
  });

  return NextResponse.json({ staff });
}
