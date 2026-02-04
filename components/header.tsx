"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/components/auth-context"
import { useLanguage } from "@/components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, GlobeIcon, MoonIcon, SunIcon } from "lucide-react"
import { useState } from "react"
import { RealTimeNotifications } from "@/components/real-time-notifications" // Import RealTimeNotifications

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("about"), href: "/about" },
    { name: t("services"), href: "/services" },
    { name: t("directory"), href: "/directory/institutions" },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-600">{t("engineersRegistry")}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  pathname === item.href ? "text-green-600" : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <GlobeIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => document.body.classList.remove("dark")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.body.classList.add("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => document.body.classList.toggle("dark")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <UserNav />
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t("register")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-green-600 ${
                    pathname === item.href ? "text-green-600" : "text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
