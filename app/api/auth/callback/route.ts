import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user exists in our users table
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", data.user.id).single()

      // If user doesn't exist, create them
      if (!existingUser) {
        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || "",
          role: "user",
        })
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
