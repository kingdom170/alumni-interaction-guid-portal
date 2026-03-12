"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { ResumeData } from "./resume-builder-modal"

export interface ResumeReview {
  id: string
  resumeId: string
  alumniName: string
  rating: number
  feedback: string
  createdAt: Date
}

interface ResumeReviewModalProps {
  resume: ResumeData
  onClose: () => void
  onSubmit: (review: ResumeReview) => void
  existingReview?: ResumeReview
}

export function ResumeReviewModal({ resume, onClose, onSubmit, existingReview }: ResumeReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 5)
  const [feedback, setFeedback] = useState(existingReview?.feedback || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const review: ResumeReview = {
      id: existingReview?.id || Date.now().toString(),
      resumeId: resume.id,
      alumniName: "Alumni Mentor",
      rating,
      feedback,
      createdAt: existingReview?.createdAt || new Date(),
    }
    onSubmit(review)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Review Resume</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resume Preview */}
          <div className="bg-background border border-border rounded-lg p-6 space-y-4 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground">{resume.fullName}</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong>Email:</strong> {resume.email}
              </div>
              <div>
                <strong>Phone:</strong> {resume.phone}
              </div>
              <div>
                <strong>Summary:</strong> {resume.summary}
              </div>
              <div>
                <strong>Education:</strong> {resume.education}
              </div>
              <div>
                <strong>Experience:</strong> {resume.experience}
              </div>
              <div>
                <strong>Skills:</strong> {resume.skills}
              </div>
              {resume.certifications && (
                <div>
                  <strong>Certifications:</strong> {resume.certifications}
                </div>
              )}
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-muted-foreground"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-4">
              <label className="text-lg font-semibold text-foreground">Feedback & Suggestions</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback on the resume, areas of improvement, strengths, etc."
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {existingReview ? "Update Review" : "Submit Review"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
