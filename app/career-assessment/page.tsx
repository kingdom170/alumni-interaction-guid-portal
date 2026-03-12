"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CareerAssessmentQuiz } from "@/components/career-assessment-quiz"
import Link from "next/link"

export default function CareerAssessmentPage() {
  const [quizStarted, setQuizStarted] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="career helper" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!quizStarted ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Career Assessment Quiz</h1>
              <p className="text-lg text-muted-foreground">
                Answer a few questions to discover the perfect career path aligned with your strengths and interests
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">⏱️</div>
                <h3 className="font-semibold text-foreground mb-2">Quick & Easy</h3>
                <p className="text-sm text-muted-foreground">Takes only 3-5 minutes to complete</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-foreground mb-2">Personalized</h3>
                <p className="text-sm text-muted-foreground">Get tailored recommendations just for you</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-foreground mb-2">Data-Driven</h3>
                <p className="text-sm text-muted-foreground">Based on industry insights and market trends</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setQuizStarted(true)} className="px-8">
                Start Assessment Quiz
              </Button>
              <Link href="/career-helper">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 bg-transparent">
                  Explore Career Paths
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="space-y-4 mt-12">
              <h2 className="text-2xl font-bold text-foreground">What You'll Get</h2>
              <div className="space-y-3">
                {[
                  "Personalized career path recommendation",
                  "Key skills you need to develop",
                  "Average salary information for your recommended path",
                  "Industry growth trends and opportunities",
                  "Connection to relevant alumni mentors",
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <p className="text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setQuizStarted(false)}
              className="text-sm text-primary hover:underline flex items-center gap-2"
            >
              ← Back to info
            </button>
            <CareerAssessmentQuiz />
          </div>
        )}
      </main>
    </div>
  )
}
