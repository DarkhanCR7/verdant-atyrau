import { createHash } from "crypto";
import { headers } from "next/headers";
import { getEnv } from "./env";

/** Extracts the caller's IP from standard proxy headers (Vercel/nginx/Docker). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/** One-way hash of the IP so we never store raw IPs at rest (privacy + PII minimization). */
export function hashIp(ip: string): string {
  const { IP_HASH_SALT } = getEnv();
  return createHash("sha256").update(`${IP_HASH_SALT}:${ip}`).digest("hex");
}
