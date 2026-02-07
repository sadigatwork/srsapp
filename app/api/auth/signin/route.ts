import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // ✅ تحقق أولاً
    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 },
      );
    }

    // ✅ تسجيل الدخول
    const { user, token, error } = await signIn(email, password);

    if (error || !token || !user) {
      return NextResponse.json(
        { error: error ?? "بيانات الدخول غير صحيحة" },
        { status: 401 },
      );
    }

    // ✅ ضبط الكوكي
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // ✅ لا تنسَ الرد
    return NextResponse.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sign-in error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
