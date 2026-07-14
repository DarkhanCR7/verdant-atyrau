import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { staffUsers } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { staffLoginSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";
import { ensureDefaultAdminUser } from "@/lib/admin-bootstrap";

const isHttps = (process.env.NEXTAUTH_URL ?? "").startsWith("https://");

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8h staff session
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(raw) {
        const parsed = staffLoginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Brute-force protection: throttle by email regardless of outcome.
        const rl = checkRateLimit(`login:${email}`, { windowMs: 5 * 60_000, max: 8 });
        if (!rl.success) return null;

        const [user] = await db
          .select()
          .from(staffUsers)
          .where(eq(staffUsers.email, email))
          .limit(1);

        const resolvedUser = user ?? (await ensureDefaultAdminUser(db, { email, password }))[0];

        if (!resolvedUser || !resolvedUser.isActive) return null;

        const valid = await verifyPassword(password, resolvedUser.passwordHash);
        if (!valid) return null;

        return {
          id: resolvedUser.id,
          email: resolvedUser.email,
          name: resolvedUser.fullName,
          role: resolvedUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: "ADMIN" | "STAFF" }).role ?? "STAFF";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "ADMIN" | "STAFF" | undefined) ?? "STAFF";
        session.user.id = (token.id as string | undefined) ?? "";
      }
      return session;
    },
  },
  cookies: {
    // The Secure flag (and __Host- prefix) only work over real HTTPS. Basing
    // this on NEXTAUTH_URL rather than NODE_ENV avoids a footgun: a
    // production deploy that isn't behind HTTPS yet would otherwise get a
    // cookie the browser silently refuses to store, making login appear to
    // "just bounce back" with no visible error.
    sessionToken: {
      name: isHttps ? "__Host-verdant.session-token" : "verdant.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isHttps,
      },
    },
  },
});
