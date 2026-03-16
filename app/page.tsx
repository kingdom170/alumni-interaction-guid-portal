"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [flow, setFlow] = useState<"initial" | "login" | "signup">("initial")

  const handleActionClick = (type: "alumni" | "student" | "teacher") => {
    if (flow === "login") {
      router.push(`/${type}-login`)
    } else {
      router.push(`/register?role=${type}`)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-60 pointer-events-none animate-pulse-gentle"></div>
      <div className="absolute top-1/2 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] opacity-60 pointer-events-none animate-float delay-200"></div>

      {/* Navigation */}
      <nav className="glass-card sticky top-0 z-40 bg-background/60 border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                S
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
                Slumini
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="opacity-0-init animate-fade-in-up">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Connect with <span className="text-gradient-primary">Alumni</span>
              </h2>
              <p className="text-xl text-muted-foreground/90 font-medium leading-relaxed">
                Seek career guidance, explore job opportunities, and build meaningful connections with our alumni
                network.
              </p>
            </div>

            {flow === "initial" ? (
              <div className="space-y-6 opacity-0-init animate-fade-in-up delay-200">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">Get Started</p>
                <div className="grid grid-cols-2 gap-6">
                  <Button 
                    onClick={() => setFlow("login")} 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-2xl py-8 text-xl font-bold transition-all hover:scale-105"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setFlow("signup")}
                    variant="outline"
                    className="w-full border-2 border-primary/50 text-foreground hover:bg-primary/10 rounded-2xl py-8 text-xl font-bold transition-all hover:scale-105"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 opacity-0-init animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Choose Role to {flow === "login" ? "Login" : "Sign Up"}
                  </p>
                  <button 
                    onClick={() => setFlow("initial")} 
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {/* Alumni Card */}
                  <div 
                    onClick={() => handleActionClick("alumni")}
                    className="group relative glass-card rounded-2xl p-6 hover-lift border-l-4 border-l-primary/50 transition-all cursor-pointer opacity-0-init animate-fade-in-up delay-[100ms] hover:border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <span className="text-primary text-2xl group-hover:scale-110 transition-transform">👨‍💼</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground mb-1">Alumni</h3>
                        <p className="text-sm text-muted-foreground font-medium">Share expertise and post opportunities</p>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center">
                        {flow === "login" ? "Login" : "Sign Up"} <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Card */}
                  <div 
                    onClick={() => handleActionClick("student")}
                    className="group relative glass-card rounded-2xl p-6 hover-lift border-l-4 border-l-accent/50 transition-all cursor-pointer opacity-0-init animate-fade-in-up delay-[200ms] hover:border-accent"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <span className="text-accent text-2xl group-hover:scale-110 transition-transform">🎓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground mb-1">Student</h3>
                        <p className="text-sm text-muted-foreground font-medium">Explore opportunities and connect</p>
                      </div>
                      <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center">
                        {flow === "login" ? "Login" : "Sign Up"} <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Teacher Card */}
                  <div 
                    onClick={() => handleActionClick("teacher")}
                    className="group relative glass-card rounded-2xl p-6 hover-lift border-l-4 border-l-secondary/50 transition-all cursor-pointer opacity-0-init animate-fade-in-up delay-[300ms] hover:border-secondary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <span className="text-secondary text-2xl group-hover:scale-110 transition-transform">👨‍🏫</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground mb-1">Teacher</h3>
                        <p className="text-sm text-muted-foreground font-medium">Post events and manage students</p>
                      </div>
                      <div className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center">
                        {flow === "login" ? "Login" : "Sign Up"} <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="space-y-6 opacity-0-init animate-fade-in-left delay-300 h-full flex flex-col justify-center">
            <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-primary transition-all cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">📅</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Networking Events</h3>
              <p className="text-sm font-medium text-muted-foreground/90">Attend exclusive events and workshops organized by alumni</p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-secondary transition-all cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">💼</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Career Opportunities</h3>
              <p className="text-sm font-medium text-muted-foreground/90">
                Discover internships and job openings from leading companies
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-accent transition-all cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">💬</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Direct Mentoring</h3>
              <p className="text-sm font-medium text-muted-foreground/90">Chat with alumni to get career guidance and insights</p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-primary transition-all cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">🤝</div>
              <h3 className="text-lg font-bold text-foreground mb-1">Alumni Network</h3>
              <p className="text-sm font-medium text-muted-foreground/90">Explore profiles and connect with professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 glass-card mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm font-medium text-muted-foreground">
          <p>Slumini - Alumni Interaction & Guidance Portal</p>
          <p className="mt-2 text-primary/80">Connecting alumni with students for career growth</p>
        </div>
      </footer>
    </div>
  )
}
