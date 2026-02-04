"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { useLanguage } from "@/components/language-provider"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

type Notification = {
  id: string
  user_id: string
  type: "application" | "document" | "system" | "reminder"
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: any
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    // Mock notifications for now as we don't have a local backend for this yet
    const fetchNotifications = async () => {
      // In a real app, this would be an API call: await fetch('/api/notifications')
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user.id,
          type: "system",
          title: t("language") === "en" ? "Welcome" : "مرحبا بك",
          message: t("language") === "en" ? "Welcome to the AgriEngineer portal." : "مرحبا بك في بوابة AgriEngineer.",
          is_read: false,
          created_at: new Date().toISOString(),
        }
      ]
      
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.is_read).length)
    }

    fetchNotifications()

    // Real-time updates would be handled via WebSockets or Polling in a local setup
    // For now, we'll just use the initial fetch
  }, [user, t])

  const markAsRead = async (id: string) => {
    if (!user) return

    // Update local state and in a real app, call an API
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return

    // Update local state and in a real app, call an API
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return "📝"
      case "document":
        return "📄"
      case "system":
        return "⚙️"
      case "reminder":
        return "⏰"
      default:
        return "🔔"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("default", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return ""
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-[10px] font-bold flex items-center justify-center bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">{t("notifications") || (t("language") === "en" ? "Notifications" : "الإشعارات")}</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              {t("markAllAsRead") || (t("language") === "en" ? "Mark all as read" : "تحديد الكل كمقروء")}
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              {t("noNotifications") || (t("language") === "en" ? "No notifications" : "لا توجد إشعارات")}
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`px-4 py-3 cursor-pointer ${!notification.is_read ? "bg-primary/5" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.is_read ? "text-primary" : ""}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" asChild className="w-full text-xs">
            <a href="/notifications">{t("viewAllNotifications") || (t("language") === "en" ? "View all" : "عرض الكل")}</a>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
