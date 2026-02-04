"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, User, Shield, UserCheck, Settings, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const { signIn, user, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Check if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      redirectByRole(user.role)
    }
  }, [user, authLoading])

  const redirectByRole = (role: string) => {
    switch (role) {
      case "system-admin":
        router.push("/system-admin/dashboard")
        break
      case "admin":
        router.push("/admin/dashboard")
        break
      case "registrar":
        router.push("/registrar/dashboard")
        break
      case "reviewer":
        router.push("/reviewer/dashboard")
        break
      default:
        router.push("/dashboard")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)

    // Trigger login with demo credentials
    setTimeout(() => {
      const form = document.querySelector("form") as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  const demoAccounts = [
    {
      email: "sysadmin@demo.com",
      password: "demo123",
      role: language === "en" ? "System Administrator" : "مدير النظام",
      icon: Crown,
      description: language === "en" ? "Full system access" : "صلاحية كاملة للنظام",
      color: "text-purple-600",
    },
    {
      email: "admin@demo.com",
      password: "demo123",
      role: language === "en" ? "Administrator" : "مدير عام",
      icon: Settings,
      description: language === "en" ? "Content & user management" : "إدارة المحتوى والمستخدمين",
      color: "text-blue-600",
    },
    {
      email: "registrar@demo.com",
      password: "demo123",
      role: language === "en" ? "Registrar" : "مسؤول التسجيل",
      icon: UserCheck,
      description: language === "en" ? "Registration management" : "إدارة التسجيلات",
      color: "text-green-600",
    },
    {
      email: "reviewer@demo.com",
      password: "demo123",
      role: language === "en" ? "Reviewer" : "مراجع",
      icon: Shield,
      description: language === "en" ? "Application review" : "مراجعة الطلبات",
      color: "text-orange-600",
    },
    {
      email: "user@demo.com",
      password: "demo123",
      role: language === "en" ? "User" : "مستخدم",
      icon: User,
      description: language === "en" ? "Submit applications" : "تقديم الطلبات",
      color: "text-gray-600",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {language === "en" ? "Sign In" : "تسجيل الدخول"}
            </CardTitle>
            <CardDescription className="text-center">
              {language === "en" ? "Enter your credentials to access your account" : "أدخل بياناتك للوصول إلى حسابك"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{language === "en" ? "Email" : "البريد الإلكتروني"}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={language === "en" ? "Enter your email" : "أدخل بريدك الإلكتروني"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{language === "en" ? "Password" : "كلمة المرور"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={language === "en" ? "Enter your password" : "أدخل كلمة المرور"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === "en" ? "Signing in..." : "جاري تسجيل الدخول..."}
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    {language === "en" ? "Sign In" : "تسجيل الدخول"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              {language === "en" ? "Don't have an account?" : "ليس لديك حساب؟"}{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => router.push("/register")}>
                {language === "en" ? "Sign up" : "إنشاء حساب"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Demo Accounts */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {language === "en" ? "Demo Accounts" : "الحسابات التجريبية"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Click on any account below to test different user roles"
                : "انقر على أي حساب أدناه لتجربة أدوار المستخدمين المختلفة"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => {
              const IconComponent = account.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-muted/50 bg-transparent"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse w-full">
                    <IconComponent className={`h-5 w-5 ${account.color}`} />
                    <div className="flex-1 text-left rtl:text-right">
                      <div className="font-medium">{account.role}</div>
                      <div className="text-sm text-muted-foreground">{account.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{account.email} • demo123</div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
