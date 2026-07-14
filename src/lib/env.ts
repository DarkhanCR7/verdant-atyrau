import { z } from "zod";

/**
 * Validates process.env at startup so misconfiguration fails fast and loudly
 * instead of causing obscure runtime errors later.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgres", {
    message: "DATABASE_URL must be a postgres connection string",
  }),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(5),
  IP_HASH_SALT: z.string().min(8).default("verdant-default-salt-change-me"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables. Check .env against .env.example.");
  }
  cached = parsed.data;
  return cached;
}
