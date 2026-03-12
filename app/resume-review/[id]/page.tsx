"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface ResumeReview {
  id: string
  resumeId: string
  alumniName: string
  rating: number
  feedback: string
  createdAt: Date
}

export default function ResumeReviewPage({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState<ResumeReview[]>([])

  useEffect(() => {
    // Load reviews from localStorage in a real app
    const stored = localStorage.getItem(`reviews-${params.id}`)
    if (stored) {
      setReviews(JSON.parse(stored))
    }
  }, [params.id])

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="resume" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/resume">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ChevronLeft size={16} className="mr-2" />
            Back to Resumes
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Reviews</h1>
          <p className="text-muted-foreground">Feedback and suggestions from alumni mentors</p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h2>
            <p className="text-muted-foreground mb-6">Invite alumni mentors to review your resume</p>
            <Link href="/alumni">
              <Button>Request Review from Alumni</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-foreground">{averageRating}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-2xl ${
                            star <= Math.round(Number(averageRating)) ? "text-yellow-400" : "text-muted-foreground"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
                  <p className="text-sm text-muted-foreground">Reviews Received</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{review.alumniName}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${star <= review.rating ? "text-yellow-400" : "text-muted-foreground"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
