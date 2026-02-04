"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "الاسم يجب أن يكون أكثر من حرفين",
  }),
  email: z.string().email({
    message: "يرجى إدخال بريد إلكتروني صحيح",
  }),
  phoneNumber: z.string().min(10, {
    message: "رقم الهاتف يجب أن يكون على الأقل 10 أرقام",
  }),
  educationLevel: z.string({
    required_error: "يرجى اختيار المستوى التعليمي",
  }),
  university: z.string().min(2, {
    message: "يرجى إدخال اسم الجامعة",
  }),
  graduationYear: z.string().regex(/^\d{4}$/, {
    message: "يرجى إدخال سنة التخرج بصيغة صحيحة (مثال: 2023)",
  }),
  specialization: z.string().min(2, {
    message: "يرجى إدخال التخصص",
  }),
  yearsOfExperience: z.string().min(1, {
    message: "يرجى إدخال عدد سنوات الخبرة",
  }),
  trainingCertificates: z.string(),
  publishedPapers: z.string(),
})

export default function RegisterForm() {
  const [experienceLevel, setExperienceLevel] = useState("مبتدئ")
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      educationLevel: "",
      university: "",
      graduationYear: "",
      specialization: "",
      yearsOfExperience: "",
      trainingCertificates: "",
      publishedPapers: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // يمكنك هنا إرسال البيانات إلى الخادم أو معالجتها كما تريد
    console.log(values)
    // تحديث مستوى الخبرة بناءً على عدد سنوات الخبرة
    const years = parseInt(values.yearsOfExperience)
    if (years < 2) setExperienceLevel("مبتدئ")
    else if (years < 5) setExperienceLevel("متوسط")
    else if (years < 8) setExperienceLevel("متقدم")
    else if (years < 12) setExperienceLevel("خبير")
    else if (years < 16) setExperienceLevel("خبير متقدم")
    else if (years < 20) setExperienceLevel("خبير استشاري")
    else setExperienceLevel("استشاري")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">تسجيل مهندس زراعي جديد</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل الاسم الكامل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل البريد الإلكتروني" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل رقم الهاتف" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="educationLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المستوى التعليمي</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى التعليمي" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bachelor">بكالوريوس</SelectItem>
                    <SelectItem value="master">ماجستير</SelectItem>
                    <SelectItem value="phd">دكتوراه</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الجامعة</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم الجامعة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="graduationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سنة التخرج</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل سنة التخرج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التخصص</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل التخصص" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سنوات الخبرة</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل عدد سنوات الخبرة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trainingCertificates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شهادات التدريب</FormLabel>
                <FormControl>
                  <Textarea placeholder="أدخل شهادات التدريب (اختياري)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishedPapers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الأوراق العلمية المنشورة</FormLabel>
                <FormControl>
                  <Textarea placeholder="أدخل الأوراق العلمية المنشورة (اختياري)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h2 className="text-xl font-semibold mb-2">مستوى الخبرة: {experienceLevel}</h2>
          </div>
          <Button type="submit">تسجيل</Button>
        </form>
      </Form>
    </div>
  )
}

