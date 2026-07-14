import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";

export async function POST() {
  const session = await auth();
  if (session) {
    await signOut({ redirect: false });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("__Host-verdant.session-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  });
  response.cookies.set("verdant.session-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
  });
  return response;
}
