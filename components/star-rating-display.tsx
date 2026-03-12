"use client"

interface StarRatingDisplayProps {
  rating: number
  maxRating?: number
  showLabel?: boolean
}

export function StarRatingDisplay({ rating, maxRating = 5, showLabel = true }: StarRatingDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(maxRating)].map((_, i) => (
          <span key={i} className="text-lg">
            {i < Math.floor(rating) ? "⭐" : i < rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
      {showLabel && <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>}
    </div>
  )
}
