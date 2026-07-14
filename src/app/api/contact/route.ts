import { NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/validations";
import { getClientIp, hashIp } from "@/lib/request-ip";
import { checkRateLimit } from "@/lib/rate-limit";
import { getEnv } from "@/lib/env";

export async function POST(req: Request) {
  const env = getEnv();
  const ip = await getClientIp();
  const ipHash = hashIp(ip);

  const rl = checkRateLimit(`contact:${ipHash}`, {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Слишком много сообщений. Попробуйте позже." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат запроса" }, { status: 400 });
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as { website?: unknown }).website
  ) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте форму", details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // In production, wire this up to an email service (Resend/SES) or store in a `messages` table.
  console.info("[contact] new message", {
    name: parsed.data.name,
    phone: parsed.data.phone,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
