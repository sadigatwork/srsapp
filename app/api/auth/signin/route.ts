import { NextRequest, NextResponse } from "next/server";
import { signIn, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 },
      );
    }

    const { user, token, error } = await signIn(email, password);

    if (error || !user || !token) {
      return NextResponse.json(
        { error: error || "فشل تسجيل الدخول" },
        { status: 401 },
      );
    }

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Sign in API error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
