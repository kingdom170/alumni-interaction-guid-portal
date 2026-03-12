"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { StarRatingDisplay } from "@/components/star-rating-display"

interface Feedback {
  id: string
  itemName: string
  itemType: "alumni" | "course" | "event"
  rating: number
  comment: string
  studentName: string
  date: string
}

const initialFeedbacks: Feedback[] = [
  {
    id: "1",
    itemName: "Priya Sharma",
    itemType: "alumni",
    rating: 5,
    comment: "Amazing mentorship! Very helpful and responsive.",
    studentName: "You",
    date: "Jan 10, 2025",
  },
  {
    id: "2",
    itemName: "Web Development Fundamentals",
    itemType: "course",
    rating: 4,
    comment: "Great course content but could use more hands-on projects.",
    studentName: "You",
    date: "Jan 8, 2025",
  },
]

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [filterType, setFilterType] = useState<"all" | "alumni" | "course" | "event">("all")

  const filteredFeedbacks = filterType === "all" ? feedbacks : feedbacks.filter((f) => f.itemType === filterType)

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="feedback" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Feedback & Ratings</h1>
          <p className="text-muted-foreground">Track all the ratings and feedback you've provided</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "alumni", "course", "event"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary"
              }`}
            >
              {type === "all" ? "All" : type === "alumni" ? "Alumni" : type === "course" ? "Courses" : "Events"}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length > 0 ? (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">
                      {feedback.itemType === "alumni"
                        ? "Alumni Mentorship"
                        : feedback.itemType === "course"
                          ? "Course"
                          : "Event"}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{feedback.itemName}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{feedback.date}</span>
                </div>

                <div className="mb-4">
                  <StarRatingDisplay rating={feedback.rating} />
                </div>

                {feedback.comment && <p className="text-sm text-muted-foreground italic">"{feedback.comment}"</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No feedback submitted yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
