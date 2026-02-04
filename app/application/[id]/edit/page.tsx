"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Award,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  User,
  Save,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoForm } from "@/components/application/personal-info-form"
import { EducationForm } from "@/components/application/education-form"
import { ExperienceForm } from "@/components/application/experience-form"
import { DocumentsForm } from "@/components/application/documents-form"
import { ReviewForm } from "@/components/application/review-form"
import { ProfessionalCertificationsForm } from "@/components/application/professional-certifications-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for existing application
const mockApplicationData = {
  personal: {
    fullName: "أحمد محمد علي",
    nationalId: "1234567890",
    birthDate: "1985-05-15",
    address: "شارع الملك فهد، الرياض",
    city: "الرياض",
    country: "saudi_arabia",
    postalCode: "12345",
    phoneNumber: "+966501234567",
    email: "ahmed@example.com",
  },
  education: [
    {
      id: "edu1",
      degree: "bachelor",
      field: "الهندسة الزراعية",
      institution: "جامعة الملك سعود",
      country: "saudi_arabia",
      startYear: "2003",
      endYear: "2007",
      inProgress: false,
    },
  ],
  experience: [
    {
      id: "exp1",
      position: "مهندس زراعي",
      company: "وزارة البيئة والمياه والزراعة",
      location: "الرياض، السعودية",
      startDate: "2007-06",
      endDate: "2015-12",
      currentlyWorking: false,
      description: "العمل على مشاريع الري والتنمية الزراعية",
    },
  ],
  documents: [
    {
      id: "doc1",
      type: "degree",
      name: "شهادة البكالوريوس.pdf",
      file: null,
      uploadDate: "2023-11-15T10:30:00Z",
    },
  ],
  certifications: [],
}

export default function EditApplicationPage({ params }) {
  const { id } = params
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(mockApplicationData)
  const [originalData, setOriginalData] = useState(mockApplicationData)

  const steps = [
    {
      id: "personal",
      title: t("language") === "en" ? "Personal Info" : "المعلومات الشخصية",
      description: t("language") === "en" ? "Basic personal information" : "المعلومات الشخصية الأساسية",
      icon: User,
    },
    {
      id: "education",
      title: t("language") === "en" ? "Education" : "التعليم",
      description: t("language") === "en" ? "Educational background" : "الخلفية التعليمية",
      icon: GraduationCap,
    },
    {
      id: "experience",
      title: t("language") === "en" ? "Experience" : "الخبرة",
      description: t("language") === "en" ? "Work experience" : "الخبرة العملية",
      icon: Briefcase,
    },
    {
      id: "documents",
      title: t("language") === "en" ? "Documents" : "المستندات",
      description: t("language") === "en" ? "Supporting documents" : "المستندات الداعمة",
      icon: FileText,
    },
    {
      id: "certifications",
      title: t("language") === "en" ? "Certifications" : "الشهادات المهنية",
      description: t("language") === "en" ? "Professional certifications" : "الشهادات المهنية",
      icon: Award,
    },
    {
      id: "review",
      title: t("language") === "en" ? "Review" : "المراجعة",
      description: t("language") === "en" ? "Review your changes" : "مراجعة التغييرات",
      icon: CheckCircle,
    },
  ]

  // Check if user is logged in and owns the application
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // In a real app, fetch application from API and verify ownership
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [router, user, id])

  const updateFormData = (step: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // This would be an API call in a real app
      console.log("Saving application changes:", formData)

      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      toast({
        title: t("language") === "en" ? "Application Updated" : "تم تحديث الطلب",
        description: t("language") === "en" ? "Your application has been updated successfully" : "تم تحديث طلبك بنجاح",
      })

      // Redirect to application details page
      router.push(`/application/${id}`)
    } catch (error) {
      toast({
        title: t("language") === "en" ? "Update Failed" : "فشل التحديث",
        description:
          t("language") === "en" ? "There was an error updating your application" : "حدث خطأ أثناء تحديث طلبك",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/application/${id}`)} className="mr-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("language") === "en" ? "Back to Application" : "العودة إلى الطلب"}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("language") === "en" ? "Edit Application" : "تعديل الطلب"}</h1>
          <p className="text-muted-foreground">
            {t("language") === "en" ? "Update your application information" : "تحديث معلومات طلبك"}
          </p>
        </div>
      </div>

      {hasChanges() && (
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
          <AlertDescription className="text-blue-800 dark:text-blue-300">
            {t("language") === "en"
              ? "You have unsaved changes. Make sure to save your progress."
              : "لديك تغييرات غير محفوظة. تأكد من حفظ تقدمك."}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            {t("language") === "en" ? "Step" : "الخطوة"} {currentStep + 1} {t("language") === "en" ? "of" : "من"}{" "}
            {steps.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      <div className="flex mb-6 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index !== steps.length - 1 ? "mr-2" : ""} ${t("language") === "ar" ? "rtl:ml-2 rtl:mr-0" : ""}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer ${
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-gradient-green text-white"
                    : "bg-secondary text-secondary-foreground"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`ml-2 text-sm cursor-pointer ${
                index === currentStep ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              {step.title}
            </span>
            {index !== steps.length - 1 && <div className="w-8 h-px bg-border mx-2"></div>}
          </div>
        ))}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <PersonalInfoForm data={formData.personal} updateData={(data) => updateFormData("personal", data)} />
          )}
          {currentStep === 1 && (
            <EducationForm data={formData.education} updateData={(data) => updateFormData("education", data)} />
          )}
          {currentStep === 2 && (
            <ExperienceForm data={formData.experience} updateData={(data) => updateFormData("experience", data)} />
          )}
          {currentStep === 3 && (
            <DocumentsForm data={formData.documents} updateData={(data) => updateFormData("documents", data)} />
          )}
          {currentStep === 4 && (
            <ProfessionalCertificationsForm
              data={formData.certifications}
              updateData={(data) => updateFormData("certifications", data)}
            />
          )}
          {currentStep === 5 && <ReviewForm formData={formData} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Previous" : "السابق"}
          </Button>
          <div className="flex gap-2">
            {hasChanges() && (
              <Button onClick={handleSave} disabled={isSaving} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? t("language") === "en"
                    ? "Saving..."
                    : "جاري الحفظ..."
                  : t("language") === "en"
                    ? "Save Changes"
                    : "حفظ التغييرات"}
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-gradient-green hover:opacity-90">
                {t("language") === "en" ? "Next" : "التالي"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-green hover:opacity-90">
                <Save className="mr-2 h-4 w-4" />
                {isSaving
                  ? t("language") === "en"
                    ? "Saving..."
                    : "جاري الحفظ..."
                  : t("language") === "en"
                    ? "Save Application"
                    : "حفظ الطلب"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
