import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Skip problematic routes during build
  if (process.env.NODE_ENV === "production" && request.nextUrl.pathname === "/fellowship/apply") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/fellowship/apply"],
}
