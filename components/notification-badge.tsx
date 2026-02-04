"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationBadge() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock notifications based on user role
  useEffect(() => {
    if (user) {
      let mockNotifications = []

      if (user.role === "registrar") {
        mockNotifications = [
          {
            id: 1,
            title: language === "en" ? "New application received" : "تم استلام طلب جديد",
            message: language === "en" ? "Ahmed Mohamed submitted a new registration" : "أحمد محمد قدم طلب تسجيل جديد",
            type: "application",
            read: false,
            timestamp: "2023-11-20T14:30:00Z",
          },
          {
            id: 2,
            title: language === "en" ? "Document verification needed" : "مطلوب التحقق من مستند",
            message: language === "en" ? "Sara Ali uploaded new documents" : "سارة علي رفعت مستندات جديدة",
            type: "document",
            read: false,
            timestamp: "2023-11-20T13:15:00Z",
          },
          {
            id: 3,
            title: language === "en" ? "License expiring soon" : "ترخيص ينتهي قريباً",
            message:
              language === "en" ? "5 licenses expire in the next 30 days" : "5 تراخيص تنتهي خلال الـ 30 يوم القادمة",
            type: "warning",
            read: true,
            timestamp: "2023-11-19T10:00:00Z",
          },
        ]
      } else if (user.role === "reviewer") {
        mockNotifications = [
          {
            id: 1,
            title: language === "en" ? "New review assignment" : "مهمة مراجعة جديدة",
            message:
              language === "en"
                ? "You have been assigned to review application #2023-001"
                : "تم تكليفك بمراجعة الطلب رقم 2023-001",
            type: "assignment",
            read: false,
            timestamp: "2023-11-20T15:00:00Z",
          },
          {
            id: 2,
            title: language === "en" ? "Review deadline approaching" : "موعد المراجعة يقترب",
            message:
              language === "en"
                ? "Application #2023-002 review due in 2 days"
                : "مراجعة الطلب رقم 2023-002 مستحقة خلال يومين",
            type: "deadline",
            read: false,
            timestamp: "2023-11-20T12:00:00Z",
          },
        ]
      } else {
        mockNotifications = [
          {
            id: 1,
            title: language === "en" ? "Document verified" : "تم التحقق من المستند",
            message:
              language === "en" ? "Your academic certificate has been verified" : "تم التحقق من شهادتك الأكاديمية",
            type: "success",
            read: false,
            timestamp: "2023-11-20T16:00:00Z",
          },
          {
            id: 2,
            title: language === "en" ? "License renewal reminder" : "تذكير تجديد الترخيص",
            message: language === "en" ? "Your license expires in 45 days" : "ترخيصك ينتهي خلال 45 يوم",
            type: "reminder",
            read: true,
            timestamp: "2023-11-19T09:00:00Z",
          },
        ]
      }

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
    }
  }, [user, language])

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))

    // Navigate based on notification type
    if (user?.role === "registrar") {
      if (notification.type === "application") {
        router.push("/registrar/applications")
      } else if (notification.type === "document") {
        router.push("/registrar/documents")
      }
    } else if (user?.role === "reviewer") {
      if (notification.type === "assignment" || notification.type === "deadline") {
        router.push("/reviewer/applications")
      }
    } else {
      router.push("/notifications")
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 60) {
      return language === "en" ? `${diffMinutes}m ago` : `منذ ${diffMinutes} د`
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60)
      return language === "en" ? `${hours}h ago` : `منذ ${hours} س`
    } else {
      const days = Math.floor(diffMinutes / 1440)
      return language === "en" ? `${days}d ago` : `منذ ${days} ي`
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          {language === "en" ? "Notifications" : "الإشعارات"}
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} {language === "en" ? "new" : "جديد"}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length > 0 ? (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.timestamp)}</p>
                  </div>
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-sm text-primary cursor-pointer"
              onClick={() => router.push("/notifications")}
            >
              {language === "en" ? "View all notifications" : "عرض جميع الإشعارات"}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled className="text-center text-muted-foreground">
            {language === "en" ? "No notifications" : "لا توجد إشعارات"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
