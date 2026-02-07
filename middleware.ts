import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const roleRoutes: Record<string, UserRole[]> = {
  "/admin": ["admin", "system-admin"],
  "/registrar": ["registrar", "system-admin"],
  "/reviewer": ["reviewer", "system-admin"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pathname = request.nextUrl.pathname;

  for (const route in roleRoutes) {
    if (pathname.startsWith(route)) {
      const userRole = payload.role; // 👈 سنضيفها الآن
      if (!roleRoutes[route].includes(userRole)) {
        return NextResponse.redirect(new URL("/403", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/registrar/:path*",
    "/reviewer/:path*",
    "/fellowship/apply",
  ],
};
