"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Award, FileCheck, UserCheck, BarChart3, CheckCircle2, Clock, AlertCircle, Plus, Eye } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  if (isLoading || authLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {t("language") === "en" ? "Loading dashboard..." : "جاري تحميل لوحة التحكم..."}
        </p>
      </div>
    )
  }

  // Redirect based on user role
  if (user?.role === "admin" || user?.role === "system-admin") {
    router.push("/admin/dashboard")
    return null
  }

  if (user?.role === "reviewer") {
    router.push("/reviewer/dashboard")
    return null
  }

  if (user?.role === "registrar") {
    router.push("/registrar/dashboard")
    return null
  }

  if (user?.role === "registrant") {
    router.push("/registrant/dashboard")
    return null
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("language") === "en" ? "Welcome back!" : "مرحباً بعودتك!"}</h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Here's an overview of your agricultural engineering certification journey"
              : "إليك نظرة عامة على رحلة شهادة الهندسة الزراعية الخاصة بك"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("language") === "en" ? "Applications" : "الطلبات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileCheck className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">3</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {t("language") === "en" ? "Active" : "نشط"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t("language") === "en" ? "Certifications" : "الشهادات"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">2</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {t("language") === "en" ? "Earned" : "مكتسبة"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("language") === "en" ? "Experience" : "الخبرة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-primary mr-2" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <span className="text-sm text-muted-foreground">{t("language") === "en" ? "Years" : "سنوات"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t("language") === "en" ? "Profile" : "الملف الشخصي"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-primary mr-2" />
                <span className="text-sm font-medium">85%</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                {t("language") === "en" ? "Complete" : "مكتمل"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Recent Applications" : "الطلبات الأخيرة"}</CardTitle>
            <CardDescription>
              {t("language") === "en" ? "Your latest certification applications" : "أحدث طلبات الشهادات الخاصة بك"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {i === 1
                          ? t("language") === "en"
                            ? "Expert Level Certification"
                            : "شهادة مستوى خبير"
                          : i === 2
                            ? t("language") === "en"
                              ? "Water Management Specialty"
                              : "تخصص إدارة المياه"
                            : t("language") === "en"
                              ? "Sustainable Agriculture"
                              : "الزراعة المستدامة"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? t("language") === "en"
                            ? "Submitted 2 days ago"
                            : "تم التقديم منذ يومين"
                          : i === 2
                            ? t("language") === "en"
                              ? "Under review"
                              : "قيد المراجعة"
                            : t("language") === "en"
                              ? "Approved"
                              : "تمت الموافقة"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {i === 1 ? (
                      <Badge
                        variant="outline"
                        className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "New" : "جديد"}
                      </Badge>
                    ) : i === 2 ? (
                      <Badge
                        variant="outline"
                        className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Pending" : "قيد الانتظار"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Approved" : "تمت الموافقة"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Quick Actions" : "الإجراءات السريعة"}</CardTitle>
            <CardDescription>
              {t("language") === "en" ? "Common tasks and shortcuts" : "المهام الشائعة والاختصارات"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/application/new")}
              className="w-full justify-start bg-gradient-green hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "New Application" : "طلب جديد"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/profile")} className="w-full justify-start">
              <UserCheck className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "Update Profile" : "تحديث الملف الشخصي"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/certification")} className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "View Certifications" : "عرض الشهادات"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/notifications")} className="w-full justify-start">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "Notifications" : "الإشعارات"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Certification Progress" : "تقدم الشهادة"}</CardTitle>
          <CardDescription>
            {t("language") === "en" ? "Your journey through certification levels" : "رحلتك عبر مستويات الشهادة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{t("language") === "en" ? "Entry Level" : "مستوى المبتدئ"}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Completed in 2022" : "مكتمل في 2022"}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {t("language") === "en" ? "Completed" : "مكتمل"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{t("language") === "en" ? "Intermediate" : "متوسط"}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Completed in 2023" : "مكتمل في 2023"}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {t("language") === "en" ? "Completed" : "مكتمل"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">{t("language") === "en" ? "Advanced" : "متقدم"}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "In progress" : "قيد التقدم"}
                  </p>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                {t("language") === "en" ? "In Progress" : "قيد التقدم"}
              </Badge>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Award className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium">{t("language") === "en" ? "Expert" : "خبير"}</p>
                  <p className="text-sm text-muted-foreground">{t("language") === "en" ? "Not started" : "لم يبدأ"}</p>
                </div>
              </div>
              <Badge variant="outline">{t("language") === "en" ? "Locked" : "مقفل"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
