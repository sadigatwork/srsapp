import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        // { error: "غير مصرح" },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      authenticated: true,
      user: session.user, })
  } catch (error: any) {
    console.error("Get user API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
