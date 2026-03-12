"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function StudentLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Authenticate against localStorage
    const normalizedEmail = email.toLowerCase().trim()

    if (!normalizedEmail.endsWith("@student.mes.ac.in")) {
      setError("Please use your official @student.mes.ac.in email")
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
      const user = userCredential.user

      // Verify role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.role === "student") {
          // Save student info to localStorage
          localStorage.setItem("userRole", "student")
          localStorage.setItem("userEmail", userData.email || normalizedEmail)
          localStorage.setItem("userName", userData.name || "Student")
          localStorage.setItem("userId", user.uid)
          router.push("/user-dashboard")
        } else {
          setError(`This account is registered as ${userData.role}. Please login via ${userData.role} login.`)
          await auth.signOut()
        }
      } else {
        setError("User profile not found")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 opacity-0-init animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xl animate-bounce-gentle">
              S
            </div>
            <h1 className="text-2xl font-bold text-foreground">Slumini</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Student Login</h2>
          <p className="text-muted-foreground">Access opportunities and mentorship</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg opacity-0-init animate-scale-in delay-200">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="your@college.edu"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-slide-down animate-shake">{error}</div>
            )}

            {/* Submit Button */}
            <div className="grid grid-cols-2 gap-4">
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-2 h-auto text-base transition-all hover:scale-105">
                Login
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/register?role=student")}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent/10 py-2 h-auto text-base transition-all hover:scale-105"
              >
                Sign Up
              </Button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
            >
              Back to Login Options
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 opacity-0-init animate-fade-in-up delay-400">
          <div className="text-center hover-scale cursor-pointer">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-xs text-muted-foreground">Learn & Grow</p>
          </div>
          <div className="text-center hover-scale cursor-pointer">
            <div className="text-2xl mb-2">💼</div>
            <p className="text-xs text-muted-foreground">Career Ready</p>
          </div>
          <div className="text-center hover-scale cursor-pointer">
            <div className="text-2xl mb-2">🤝</div>
            <p className="text-xs text-muted-foreground">Network</p>
          </div>
        </div>
      </div>
    </div>
  )
}
