"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RatingModalProps {
  isOpen: boolean
  itemName: string
  itemType: "alumni" | "course" | "event"
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
}

export function RatingModal({ isOpen, itemName, itemType, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    onSubmit(rating, comment)
    setRating(0)
    setComment("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Rate {itemType === "alumni" ? "Alumni Mentorship" : itemType === "course" ? "Course" : "Event"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{itemName}</p>

        {/* Star Rating */}
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-colors cursor-pointer"
            >
              {star <= (hoverRating || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your feedback..."
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit Rating
          </Button>
        </div>
      </div>
    </div>
  )
}
