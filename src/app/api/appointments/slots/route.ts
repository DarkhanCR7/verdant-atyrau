import { NextResponse } from "next/server";
import { z } from "zod";
import { getTakenSlots } from "@/server/appointments";

const querySchema = z.object({
  doctorId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    doctorId: searchParams.get("doctorId"),
    date: searchParams.get("date"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные параметры" }, { status: 400 });
  }

  const taken = await getTakenSlots(parsed.data.doctorId, parsed.data.date);
  return NextResponse.json({ taken });
}
