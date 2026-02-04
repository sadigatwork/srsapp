import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">نظام تسجيل المهندسين الزراعيين</h1>
      <div className="flex justify-center space-x-4 rtl:space-x-reverse">
        <Link href="/register">
          <Button>تسجيل مهندس جديد</Button>
        </Link>
        <Link href="/manage-classifications">
          <Button variant="outline">إدارة التصنيفات</Button>
        </Link>
        <Link href="/manage-subscriptions">
          <Button variant="outline">إدارة الاشتراكات</Button>
        </Link>
      </div>
    </div>
  )
}

