import { NextResponse } from "next/server";
import { COOKIE_NAME, createSessionToken, getSecret, getAdminPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password || body.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
  }
  const token = await createSessionToken(getSecret());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
