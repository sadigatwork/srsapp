import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    await clearAuthCookie()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Sign out API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
