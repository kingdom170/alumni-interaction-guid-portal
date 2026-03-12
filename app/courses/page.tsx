"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { RatingModal } from "@/components/rating-modal"
import { getAllCourses, type CourseData } from "@/lib/firestore/course-service"
import { addRating, getUserRating, getAverageRating } from "@/lib/firestore/rating-service"

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    courseId: number | null
    courseTitle: string
  }>({ isOpen: false, courseId: null, courseTitle: "" })
  const [ratings, setRatings] = useState<Record<number, { rating: number; comment: string }>>({})
  const [coursesData, setCoursesData] = useState<CourseData[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  // Load courses from Firebase on mount
  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoadingCourses(true)
    try {
      const courses = await getAllCourses()
      setCoursesData(courses)
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setLoadingCourses(false)
    }
  }

  const categories = ["All", ...new Set(coursesData.map((c) => c.category))]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const handleEnroll = (courseId: string, courseLink: string) => {
    window.open(courseLink, "_blank")
    if (!enrolledCourses.includes(Number(courseId))) {
      setEnrolledCourses([...enrolledCourses, Number(courseId)])
    }
  }

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingModal.courseId !== null) {
      setRatings({
        ...ratings,
        [ratingModal.courseId]: { rating, comment },
      })
      setRatingModal({ isOpen: false, courseId: null, courseTitle: "" })
      alert("Thank you for your feedback!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="courses" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-muted-foreground">Learn from expert instructors and enhance your skills</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Level</label>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedLevel === level
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Courses Grid */}
        {loadingCourses ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.courseId}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Course Header */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="text-sm font-medium text-foreground">⭐ {course.rating || 0}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>

                {/* Course Content */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground">{course.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>👨‍🏫</span>
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>📅</span>
                      <span>Starts {course.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>👥</span>
                      <span>{course.enrolledCount || 0} enrolled</span>
                    </div>
                  </div>

                  {ratings[Number(course.courseId)] && (
                    <div className="bg-muted/50 p-2 rounded text-xs">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < ratings[Number(course.courseId)].rating ? "⭐" : "☆"}</span>
                        ))}
                      </div>
                      Your rating
                    </div>
                  )}

                  <Button
                    onClick={() => handleEnroll(course.courseId!, course.link)}
                    className="w-full mb-2"
                    variant={enrolledCourses.includes(Number(course.courseId)) ? "default" : "outline"}
                  >
                    {enrolledCourses.includes(Number(course.courseId)) ? "✓ Enrolled" : "Enroll Now"}
                  </Button>

                  <button
                    onClick={() => setRatingModal({ isOpen: true, courseId: Number(course.courseId), courseTitle: course.title })}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    {ratings[Number(course.courseId)] ? "Update Rating" : "Rate Course"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No courses available yet</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchTerm || selectedCategory !== 'All' || selectedLevel !== 'All'
                ? 'No courses match your current filters. Try adjusting them.'
                : 'Teachers have not posted any courses yet. Check back soon!'}
            </p>
          </div>
        )}

        <RatingModal
          isOpen={ratingModal.isOpen}
          itemName={ratingModal.courseTitle}
          itemType="course"
          onClose={() => setRatingModal({ isOpen: false, courseId: null, courseTitle: "" })}
          onSubmit={handleRatingSubmit}
        />
      </main>
    </div>
  )
}
