"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export type UserRole = "user" | "reviewer" | "admin" | "registrar" | "system-admin"

export type User = {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  is_active: boolean
}

export type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const redirectByRole = useCallback((role: UserRole) => {
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
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: data.error || "حدث خطأ غير متوقع",
          variant: "destructive",
        })
        return { error: data.error }
      }

      setUser(data.user)
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك، ${data.user.full_name}`,
      })

      redirectByRole(data.user.role)
      return { error: null }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      })
      return { error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: data.error || "حدث خطأ غير متوقع",
          variant: "destructive",
        })
        return { error: data.error }
      }

      setUser(data.user)
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في النظام",
      })

      router.push("/dashboard")
      return { error: null }
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      })
      return { error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      router.push("/")
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً",
      })
    } catch (error: any) {
      console.error("Sign out error:", error)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: "خطأ في التحديث",
          description: result.error || "حدث خطأ غير متوقع",
          variant: "destructive",
        })
        return { error: result.error }
      }

      setUser((prev) => (prev ? { ...prev, ...data } : null))
      toast({
        title: "تم التحديث بنجاح",
        description: "تم حفظ التغييرات",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive",
      })
      return { error: error.message }
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
