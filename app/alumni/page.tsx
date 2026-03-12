"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { alumniData } from "@/lib/data"
import { RatingModal } from "@/components/rating-modal"
import Link from "next/link"
import { addRating, getUserRating, getAverageRating } from "@/lib/firestore/rating-service"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface AlumniUser {
  uid: string
  name: string
  email: string
  profession?: string
  company?: string
  field?: string
  course?: string
  batch?: string
  image?: string
}

export default function AlumniPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState<string>("all")
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    alumniId: string | null
    alumniName: string
  }>({ isOpen: false, alumniId: null, alumniName: "" })
  const [ratings, setRatings] = useState<Record<string, { rating: number; comment: string }>>({})
  const [averageRatings, setAverageRatings] = useState<Record<string, { average: number; count: number }>>({})
  const [alumni, setAlumni] = useState<AlumniUser[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  // Load user info and alumni
  useEffect(() => {
    const uid = localStorage.getItem("userId") || ""
    const email = localStorage.getItem("userEmail") || ""
    const name = localStorage.getItem("userName") || ""
    setUserId(uid)
    setUserEmail(email)
    setUserName(name)

    loadAlumni(uid)
  }, [])

  const loadAlumni = async (uid: string) => {
    setLoading(true)
    try {
      // Load alumni from Firebase users collection
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "alumni"))
      const snapshot = await getDocs(q)

      const firebaseAlumni: AlumniUser[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          uid: doc.id,
          name: data.name || "Alumni",
          email: data.email || "",
          profession: data.profession,
          company: data.company,
          field: data.field,
          course: data.course,
          batch: data.batch,
          image: data.image || "👨‍💼",
        }
      })

      // If no alumni in Firebase, use mock data as fallback
      if (firebaseAlumni.length === 0) {
        const mockAlumni: AlumniUser[] = alumniData.map((a) => ({
          uid: a.id.toString(),
          name: a.name,
          email: a.email,
          profession: a.profession,
          company: a.company,
          field: a.field,
          course: a.course,
          batch: a.batch,
          image: a.image,
        }))
        setAlumni(mockAlumni)
      } else {
        setAlumni(firebaseAlumni)
      }

      // Load user's ratings and average ratings
      if (uid) {
        const userRatings: Record<string, { rating: number; comment: string }> = {}
        const avgRatings: Record<string, { average: number; count: number }> = {}

        for (const alumnus of firebaseAlumni.length > 0 ? firebaseAlumni : alumniData.map((a) => ({ uid: a.id.toString(), name: a.name, email: a.email }))) {
          // Get user's rating
          const userRating = await getUserRating(uid, alumnus.uid, "alumni")
          if (userRating) {
            userRatings[alumnus.uid] = {
              rating: userRating.rating,
              comment: userRating.comment,
            }
          }

          // Get average rating
          const avgRating = await getAverageRating(alumnus.uid, "alumni")
          avgRatings[alumnus.uid] = avgRating
        }

        setRatings(userRatings)
        setAverageRatings(avgRatings)
      }
    } catch (error) {
      console.error("Error loading alumni:", error)
      // Fallback to mock data
      const mockAlumni: AlumniUser[] = alumniData.map((a) => ({
        uid: a.id.toString(),
        name: a.name,
        email: a.email,
        profession: a.profession,
        company: a.company,
        field: a.field,
        course: a.course,
        batch: a.batch,
        image: a.image,
      }))
      setAlumni(mockAlumni)
    } finally {
      setLoading(false)
    }
  }

  const uniqueFields = ["all", ...new Set(alumni.map((a) => a.field).filter(Boolean))]

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alumnus.profession && alumnus.profession.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (alumnus.company && alumnus.company.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesField = selectedField === "all" || alumnus.field === selectedField
    return matchesSearch && matchesField
  })

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!ratingModal.alumniId || !userId) {
      alert("Please log in to rate alumni")
      return
    }

    try {
      await addRating({
        itemId: ratingModal.alumniId,
        itemType: "alumni",
        itemName: ratingModal.alumniName,
        userId,
        userEmail,
        userName,
        rating,
        comment,
      })

      setRatings({
        ...ratings,
        [ratingModal.alumniId]: { rating, comment },
      })

      // Reload average rating
      const avgRating = await getAverageRating(ratingModal.alumniId, "alumni")
      setAverageRatings({
        ...averageRatings,
        [ratingModal.alumniId]: avgRating,
      })

      setRatingModal({ isOpen: false, alumniId: null, alumniName: "" })
      alert("Thank you for your feedback!")
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Failed to submit rating. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="alumni" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Alumni Directory</h1>
          <p className="text-muted-foreground mb-6">Connect with and learn from our successful alumni network</p>

          {/* Filters */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by name, profession, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2 flex-wrap">
              {uniqueFields.map((field) => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${selectedField === field
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary"
                    }`}
                >
                  {field === "all" ? "All Fields" : field}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading alumni...</p>
          </div>
        ) : (
          <>
            {/* Alumni Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumnus) => (
                <div
                  key={alumnus.uid}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col text-center"
                >
                  <div className="text-5xl mb-4">{alumnus.image}</div>

                  <h3 className="font-semibold text-foreground mb-1 text-balance">{alumnus.name}</h3>
                  {alumnus.profession && <p className="text-sm font-medium text-primary mb-2">{alumnus.profession}</p>}

                  <div className="space-y-2 mb-6 text-xs text-muted-foreground flex-1">
                    {alumnus.company && <div className="font-medium">{alumnus.company}</div>}
                    {alumnus.field && <div>{alumnus.field}</div>}
                    {alumnus.course && <div>{alumnus.course}</div>}
                    {alumnus.batch && <div>Batch {alumnus.batch}</div>}
                  </div>

                  {/* Display average rating */}
                  {averageRatings[alumnus.uid] && averageRatings[alumnus.uid].count > 0 && (
                    <div className="mb-3 text-sm">
                      <div className="flex justify-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.round(averageRatings[alumnus.uid].average) ? "⭐" : "☆"}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {averageRatings[alumnus.uid].average.toFixed(1)} ({averageRatings[alumnus.uid].count} reviews)
                      </p>
                    </div>
                  )}

                  {/* Display user's rating */}
                  {ratings[alumnus.uid] && (
                    <div className="mb-3 text-sm">
                      <p className="text-xs text-accent font-medium">Your rating:</p>
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < ratings[alumnus.uid].rating ? "⭐" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Link href={`/chat/${alumnus.uid}`} className="block">
                      <Button className="w-full" size="sm">
                        Chat
                      </Button>
                    </Link>
                    <button
                      onClick={() => setRatingModal({ isOpen: true, alumniId: alumnus.uid, alumniName: alumnus.name })}
                      className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      {ratings[alumnus.uid] ? "Update Rating" : "Rate Mentor"}
                    </button>
                    <a href={`mailto:${alumnus.email}`} className="block">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        Email
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredAlumni.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No alumni found matching your search</p>
              </div>
            )}
          </>
        )}

        <RatingModal
          isOpen={ratingModal.isOpen}
          itemName={ratingModal.alumniName}
          itemType="alumni"
          onClose={() => setRatingModal({ isOpen: false, alumniId: null, alumniName: "" })}
          onSubmit={handleRatingSubmit}
        />
      </main>
    </div>
  )
}
