import { NextRequest, NextResponse } from "next/server"
import { signUp, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    const { user, error } = await signUp(email, password, name)

    if (error || !user) {
      return NextResponse.json(
        { error: error || "فشل إنشاء الحساب" },
        { status: 400 }
      )
    }

    // Create token and set cookie
    const token = await createToken(user.id)
    await setAuthCookie(token)

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Sign up API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
