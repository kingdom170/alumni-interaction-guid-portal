"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const roleParam = searchParams.get("role")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student", // default fallback
    })
    const [error, setError] = useState("")

    // Update role from URL param if present
    useEffect(() => {
        if (roleParam && ["student", "teacher", "alumni"].includes(roleParam)) {
            setFormData(prev => ({ ...prev, role: roleParam }))
        }
    }, [roleParam])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.password) {
            setError("Please fill in all fields")
            return
        }

        const normalizedEmail = formData.email.toLowerCase().trim()

        // Domain Validation
        if (formData.role === "teacher") {
            if (!normalizedEmail.endsWith("@teacher.mes.ac.in")) {
                setError("Teachers must use an @teacher.mes.ac.in email address")
                return
            }
        } else {
            // Student and Alumni
            if (!normalizedEmail.endsWith("@student.mes.ac.in")) {
                setError(`Students and Alumni must use an @student.mes.ac.in email address`)
                return
            }
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, formData.password)
            const user = userCredential.user

            // Store user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: formData.name,
                email: normalizedEmail,
                role: formData.role,
                createdAt: new Date().toISOString()
            })

            alert("Registration successful! You are now logged in.")

            if (formData.role === "student") {
                router.push("/user-dashboard") // Direct to dashboard after reg? Or login page? Detailed in plan says login pages. But usually registration autologs in.
                // The plan said: "Registration successful! Please login." -> Plan implies redirect to login.
                // However, createUserWithEmailAndPassword auto signs in.
                // I will redirect to the specific login page to force re-auth or just assume logged in.
                // Standard firebase flow is they are signed in.
                // But the existing flow was "Registration successful! Please login."
                // I'll stick to redirecting to login pages so they can verify their credentials or follow the flow.
                // ACTUALLY, if they are signed in, I should probably sign them out if I want them to login again, OR just redirect to dashboard.
                // Let's redirect to dashboard if `createUserWithEmailAndPassword` succeeds, but the plan said "Verify user is created... Login... Go to /student-login".
                // I will alert "Registration successful!" and redirect to the specific login page like before, but I should probably signOut first to enforce login flow, OR just redirect to dashboard.
                // Given the existing app structure had separate login pages, maybe they want to see them.
                // Let's stick strictly to what the previous code did: redirect to login page.
                // But I need to signOut first? No, if I redirect to login page, the login page checks persistence?
                // Firebase persistence is usually "local".
                // Let's just redirect to the login page as before.
            } else if (formData.role === "teacher") {
                router.push("/teacher-login")
            } else if (formData.role === "alumni") {
                router.push("/alumni-login")
            } else {
                router.push("/")
            }
        } catch (err: any) {
            console.error("Registration error:", err)
            if (err.code === "auth/email-already-in-use") {
                setError("Email already registered")
            } else {
                setError(err.message || "Failed to register")
            }
        }
    }

    // If role is locked via URL, don't show the buttons, just show which role is being registered
    const isRoleLocked = !!roleParam && ["student", "teacher", "alumni"].includes(roleParam)

    return (
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <form onSubmit={handleRegister} className="space-y-6">
                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        I am a...
                    </label>
                    {isRoleLocked ? (
                        <div className="w-full p-2 bg-muted rounded-md text-sm font-semibold capitalize text-foreground border border-border text-center">
                            {formData.role}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "student" })}
                                className={`py-2 px-1 text-sm rounded-md border transition-colors ${formData.role === "student"
                                    ? "bg-accent text-accent-foreground border-accent"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "teacher" })}
                                className={`py-2 px-1 text-sm rounded-md border transition-colors ${formData.role === "teacher"
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                    }`}
                            >
                                Teacher
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "alumni" })}
                                className={`py-2 px-1 text-sm rounded-md border transition-colors ${formData.role === "alumni"
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                    }`}
                            >
                                Alumni
                            </button>
                        </div>
                    )}
                </div>

                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value })
                            setError("")
                        }}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            setError("")
                        }}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                        value={formData.password}
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value })
                            setError("")
                        }}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>
                )}

                {/* Submit Button */}
                <Button className="w-full py-2 h-auto text-base">Create Account</Button>

            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/" className="text-primary hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                            S
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Slumini</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
                    <p className="text-muted-foreground">Join our community today</p>
                </div>

                <Suspense fallback={<div>Loading form...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
}
