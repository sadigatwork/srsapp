import { NextRequest, NextResponse } from "next/server"
import { getServerSession, updateUserProfile } from "@/lib/auth"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { user, error } = await updateUserProfile(session.user.id, data)

    if (error || !user) {
      return NextResponse.json(
        { error: error || "فشل تحديث الملف الشخصي" },
        { status: 400 }
      )
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Update profile API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
