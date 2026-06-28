import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken, getSecret } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token, getSecret());

  const isLoginPage = pathname === "/admin/login";
  const isAuthApi =
    pathname.startsWith("/api/admin/login") || pathname.startsWith("/api/admin/logout");

  // Giriş yapılmışken /admin/login -> /admin
  if (isLoginPage && ok) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Admin sayfaları (login hariç) korumalı
  if (pathname.startsWith("/admin") && !isLoginPage && !ok) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Admin API'leri (login/logout hariç) korumalı
  if (pathname.startsWith("/api/admin/") && !isAuthApi && !ok) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
