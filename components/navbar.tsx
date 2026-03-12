"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface NavbarProps {
  userType?: "alumni" | "user" | "teacher"
  currentPage?: string
}

export function Navbar({ userType = "user", currentPage = "dashboard" }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems =
    userType === "alumni"
      ? [
          { label: "Dashboard", href: "/alumni-dashboard" },
          { label: "Student Queries", href: "/alumni-dashboard?tab=queries" },
          { label: "My Profile", href: "/alumni-dashboard?tab=profile" },
        ]
      : userType === "teacher"
        ? [
            { label: "Dashboard", href: "/teacher-dashboard" },
            { label: "Post Event", href: "/teacher-dashboard?tab=post-event" },
            { label: "Post Course", href: "/teacher-dashboard?tab=post-course" },
          ]
        : [
            { label: "Dashboard", href: "/user-dashboard" },
            { label: "Events", href: "/events" },
            { label: "Career Helper", href: "/career-helper" },
            { label: "Assessment", href: "/career-assessment" },
            { label: "Jobs", href: "/jobs" },
            { label: "Resume", href: "/resume" },
            { label: "Courses", href: "/courses" },
            { label: "Alumni", href: "/alumni" },
            { label: "Feedback", href: "/feedback" },
          ]

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-lg font-bold text-foreground">Slumini</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.label.toLowerCase()
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/")} className="hidden sm:inline-flex">
              Logout
            </Button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href)
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
