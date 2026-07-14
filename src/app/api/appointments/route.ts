import { NextResponse } from "next/server";
import { appointmentInputSchema } from "@/lib/validations";
import { createAppointment, SlotTakenError } from "@/server/appointments";
import { getClientIp, hashIp } from "@/lib/request-ip";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const env = getEnv();
  const ip = await getClientIp();
  const ipHash = hashIp(ip);

  // Rate limit by IP to prevent booking-form abuse / spam flooding.
  const rl = checkRateLimit(`appointment:${ipHash}`, {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже или позвоните нам напрямую." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  // Honeypot: check before schema validation so bots that fill every field get a
  // convincing fake "success" instead of a 422 that would tip them off.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as { website?: unknown }).website
  ) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const parsed = appointmentInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Проверьте правильность заполнения формы",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  try {
    const appointment = await createAppointment(parsed.data, ipHash);
    return NextResponse.json({ success: true, id: appointment.id }, { status: 201 });
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("Failed to create appointment:", err);
    return NextResponse.json(
      { error: "Не удалось создать запись. Попробуйте ещё раз или позвоните нам." },
      { status: 500 },
    );
  }
}
