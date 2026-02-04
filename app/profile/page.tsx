"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Loader2 } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function ProfilePage() {
  const { t, language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Profile form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    specialization: "",
    experience: "",
    education: "",
  })

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else {
        setIsLoading(false)
        // Load profile data from user object in AuthContext
        setFormData({
          firstName: user.full_name?.split(" ")[0] || "",
          lastName: user.full_name?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: "", // These might not be in the initial user object
          nationality: "",
          address: "",
          city: "",
          country: "",
          bio: "",
          specialization: "",
          experience: "",
          education: "",
        })
      }
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // This would be an API call to update the profile
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: t("language") === "en" ? "Profile Updated" : "تم تحديث الملف الشخصي",
        description:
          t("language") === "en" ? "Your profile has been updated successfully" : "تم تحديث ملفك الشخصي بنجاح",
      })
    } catch (error) {
      toast({
        title: t("language") === "en" ? "Error" : "خطأ",
        description: t("language") === "en" ? "Failed to update profile" : "فشل في تحديث الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {t("language") === "en" ? "Loading profile..." : "جاري تحميل الملف الشخصي..."}
        </p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "Profile Settings" : "إعدادات الملف الشخصي"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Manage your personal information and preferences"
              : "إدارة معلوماتك الشخصية وتفضيلاتك"}
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-green hover:opacity-90">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {t("language") === "en" ? "Save Changes" : "حفظ التغييرات"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Profile Picture" : "صورة الملف الشخصي"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {formData.firstName.charAt(0)}
                  {formData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Upload Photo" : "رفع صورة"}
              </Button>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {user?.role === "admin"
                    ? t("language") === "en"
                      ? "Administrator"
                      : "مدير"
                    : user?.role === "reviewer"
                      ? t("language") === "en"
                        ? "Reviewer"
                        : "مراجع"
                      : user?.role === "registrar"
                        ? t("language") === "en"
                          ? "Registrar"
                          : "مسجل"
                        : t("language") === "en"
                          ? "User"
                          : "مستخدم"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "Member since 2022" : "عضو منذ 2022"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">
                {t("language") === "en" ? "Personal Info" : "المعلومات الشخصية"}
              </TabsTrigger>
              <TabsTrigger value="professional">{t("language") === "en" ? "Professional" : "المهنية"}</TabsTrigger>
              <TabsTrigger value="security">{t("language") === "en" ? "Security" : "الأمان"}</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Personal Information" : "المعلومات الشخصية"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en" ? "Update your personal details" : "تحديث تفاصيلك الشخصية"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("language") === "en" ? "First Name" : "الاسم الأول"}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("language") === "en" ? "Last Name" : "اسم العائلة"}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("language") === "en" ? "Email Address" : "عنوان البريد الإلكتروني"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("language") === "en" ? "Phone Number" : "رقم الهاتف"}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">{t("language") === "en" ? "Date of Birth" : "تاريخ الميلاد"}</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">{t("language") === "en" ? "Nationality" : "الجنسية"}</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleInputChange("nationality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("language") === "en" ? "Select nationality" : "اختر الجنسية"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudi">{t("language") === "en" ? "Saudi Arabian" : "سعودي"}</SelectItem>
                        <SelectItem value="egyptian">{t("language") === "en" ? "Egyptian" : "مصري"}</SelectItem>
                        <SelectItem value="jordanian">{t("language") === "en" ? "Jordanian" : "أردني"}</SelectItem>
                        <SelectItem value="other">{t("language") === "en" ? "Other" : "أخرى"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t("language") === "en" ? "Address" : "العنوان"}</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("language") === "en" ? "City" : "المدينة"}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t("language") === "en" ? "Country" : "البلد"}</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Professional Information" : "المعلومات المهنية"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en" ? "Update your professional details" : "تحديث تفاصيلك المهنية"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">{t("language") === "en" ? "Specialization" : "التخصص"}</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleInputChange("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("language") === "en" ? "Select specialization" : "اختر التخصص"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="irrigation">
                          {t("language") === "en" ? "Irrigation Engineering" : "هندسة الري"}
                        </SelectItem>
                        <SelectItem value="soil">{t("language") === "en" ? "Soil Science" : "علوم التربة"}</SelectItem>
                        <SelectItem value="crops">
                          {t("language") === "en" ? "Crop Production" : "إنتاج المحاصيل"}
                        </SelectItem>
                        <SelectItem value="machinery">
                          {t("language") === "en" ? "Agricultural Machinery" : "الآلات الزراعية"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">
                      {t("language") === "en" ? "Years of Experience" : "سنوات الخبرة"}
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("language") === "en" ? "Select experience" : "اختر الخبرة"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">{t("language") === "en" ? "0-2 years" : "0-2 سنوات"}</SelectItem>
                        <SelectItem value="3-5">{t("language") === "en" ? "3-5 years" : "3-5 سنوات"}</SelectItem>
                        <SelectItem value="6-10">{t("language") === "en" ? "6-10 years" : "6-10 سنوات"}</SelectItem>
                        <SelectItem value="10+">{t("language") === "en" ? "10+ years" : "10+ سنوات"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">{t("language") === "en" ? "Education Level" : "المستوى التعليمي"}</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("language") === "en" ? "Select education" : "اختر التعليم"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">
                          {t("language") === "en" ? "Bachelor's Degree" : "بكالوريوس"}
                        </SelectItem>
                        <SelectItem value="master">{t("language") === "en" ? "Master's Degree" : "ماجستير"}</SelectItem>
                        <SelectItem value="phd">{t("language") === "en" ? "PhD" : "دكتوراه"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t("language") === "en" ? "Professional Bio" : "السيرة المهنية"}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      placeholder={
                        t("language") === "en"
                          ? "Tell us about your professional background..."
                          : "أخبرنا عن خلفيتك المهنية..."
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Security Settings" : "إعدادات الأمان"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en" ? "Manage your account security" : "إدارة أمان حسابك"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">
                      {t("language") === "en" ? "Current Password" : "كلمة المرور الحالية"}
                    </Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      {t("language") === "en" ? "New Password" : "كلمة المرور الجديدة"}
                    </Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      {t("language") === "en" ? "Confirm New Password" : "تأكيد كلمة المرور الجديدة"}
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="outline" className="w-full">
                    {t("language") === "en" ? "Update Password" : "تحديث كلمة المرور"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
