"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavbarProps {
  userType?: "alumni" | "user" | "teacher"
  currentPage?: string
}

export function Navbar({ userType = "user", currentPage = "dashboard" }: NavbarProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems =
    userType === "alumni"
      ? []
      : userType === "teacher"
        ? []
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
    <nav className="glass-card sticky top-0 z-40 bg-background/60 border-b border-white/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
              Slumini
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const isActive = currentPage === item.label.toLowerCase()
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden group ${
                    isActive 
                      ? "text-primary bg-primary/10 font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent animate-scale-in" />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-border transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left opacity-50" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Logout Button */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
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
