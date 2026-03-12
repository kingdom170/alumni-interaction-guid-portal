"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"alumni" | "student" | "teacher" | null>(null)

  const handleLoginClick = (type: "alumni" | "student" | "teacher") => {
    setUserType(type)
    if (type === "alumni") {
      router.push("/alumni-login")
    } else if (type === "student") {
      router.push("/student-login")
    } else {
      router.push("/teacher-login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm opacity-0-init animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg animate-bounce-gentle">
                S
              </div>
              <h1 className="text-xl font-bold text-foreground">Slumini</h1>
            </div>
            <div className="text-sm text-muted-foreground">Alumni Portal</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="opacity-0-init animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Connect with Alumni</h2>
              <p className="text-lg text-muted-foreground">
                Seek career guidance, explore job opportunities, and build meaningful connections with our alumni
                network.
              </p>
            </div>

            <div className="space-y-4 opacity-0-init animate-fade-in-up delay-200">
              <p className="text-sm font-semibold text-primary">Choose Your Role</p>
              <div className="grid gap-4">
                {/* Alumni Login */}
                <div className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all opacity-0-init animate-fade-in-up delay-300 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-xl">👨‍💼</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">Alumni Login</h3>
                      <p className="text-sm text-muted-foreground">Share expertise and post job opportunities</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button onClick={() => handleLoginClick("alumni")} className="w-full bg-primary hover:bg-primary/90">
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/register?role=alumni")}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>

                {/* Student Login */}
                <div className="group relative bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all opacity-0-init animate-fade-in-up delay-400 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-accent text-xl">🎓</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">Student Login</h3>
                      <p className="text-sm text-muted-foreground">Explore opportunities and connect with mentors</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button onClick={() => handleLoginClick("student")} className="w-full bg-accent hover:bg-accent/90">
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/register?role=student")}
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent/10"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>

                {/* Teacher Login */}
                <div className="group relative bg-card border border-border rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all opacity-0-init animate-fade-in-up delay-500 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-500 text-xl">👨‍🏫</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">Teacher Login</h3>
                      <p className="text-sm text-muted-foreground">Post events and manage student interactions</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button onClick={() => handleLoginClick("teacher")} className="w-full bg-blue-600 hover:bg-blue-700">
                      Login
                    </Button>
                    <Button
                      onClick={() => router.push("/register?role=teacher")}
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-6 opacity-0-init animate-fade-in-left delay-300">
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover-scale cursor-pointer">
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-semibold text-foreground mb-2">Networking Events</h3>
              <p className="text-sm text-muted-foreground">Attend exclusive events and workshops organized by alumni</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover-scale cursor-pointer">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-foreground mb-2">Career Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Discover internships and job openings from leading companies
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover-scale cursor-pointer">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-foreground mb-2">Direct Mentoring</h3>
              <p className="text-sm text-muted-foreground">Chat with alumni to get career guidance and insights</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover-scale cursor-pointer">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-semibold text-foreground mb-2">Alumni Network</h3>
              <p className="text-sm text-muted-foreground">Explore profiles and connect with professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Slumini - Alumni Interaction & Guidance Portal</p>
          <p className="mt-2">Connecting alumni with students for career growth</p>
        </div>
      </footer>
    </div>
  )
}
