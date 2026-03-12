"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { jobsData } from "@/lib/data"
import { PostJobForm, type JobFormData } from "@/components/post-job-form"
import { ResumeReviewModal, type ResumeReview } from "@/components/resume-review-modal"
import type { ResumeData } from "@/components/resume-builder-modal"
import { GlobalChat } from "@/components/global-chat"
import { ChatWindow } from "@/components/chat-window"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { getUserConversations, type ConversationData } from "@/lib/firestore/chat-service"
import { createJob, getJobsByAlumni, deleteJob, getJobApplications, type JobData, type JobApplicationData } from "@/lib/firestore/job-service"
import { useRouter } from "next/navigation"

interface StudentUser {
  uid: string
  name: string
  email: string
  course?: string
  batch?: string
  image?: string
}

export default function AlumniDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "messages" | "profile" | "post-jobs" | "resume-reviews" | "reviews"
  >("dashboard")
  const [showPostJobForm, setShowPostJobForm] = useState(false)
  const [showResumeReviewModal, setShowResumeReviewModal] = useState(false)
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null)
  const [chatStudentId, setChatStudentId] = useState<number | null>(null)
  const [postedJobs, setPostedJobs] = useState<JobData[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [showApplicantsModal, setShowApplicantsModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobApplicants, setJobApplicants] = useState<JobApplicationData[]>([])
  const [loadingApplicants, setLoadingApplicants] = useState(false)
  const [submittedReviews, setSubmittedReviews] = useState<ResumeReview[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<any>({})
  const [conversations, setConversations] = useState<ConversationData[]>([])
  const [selectedChat, setSelectedChat] = useState<{ id: string; name: string } | null>(null)
  const [students, setStudents] = useState<StudentUser[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            const data = docSnap.data()
            setProfile(data)
            setEditForm(data)
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      } else {
        router.push("/alumni-login")
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const loadConversations = async (userId: string) => {
    try {
      const convos = await getUserConversations(userId, "alumni")
      setConversations(convos)
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

  const loadStudents = async () => {
    setLoadingStudents(true)
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("role", "==", "student"))
      const snapshot = await getDocs(q)

      const studentsList: StudentUser[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          uid: doc.id,
          name: data.name || "Student",
          email: data.email || "",
          course: data.course,
          batch: data.batch,
          image: data.image || "👨‍🎓",
        }
      })

      setStudents(studentsList)
    } catch (error) {
      console.error("Error loading students:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadPostedJobs = async (userId: string) => {
    setLoadingJobs(true)
    try {
      const jobs = await getJobsByAlumni(userId)
      setPostedJobs(jobs)
    } catch (error) {
      console.error("Error loading posted jobs:", error)
    } finally {
      setLoadingJobs(false)
    }
  }

  useEffect(() => {
    if (profile?.uid) {
      loadConversations(profile.uid)
      loadStudents()
      loadPostedJobs(profile.uid)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return
    try {
      const docRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(docRef, editForm)
      setProfile(editForm)
      setIsEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  const studentResumesForReview: ResumeData[] = [
    {
      id: "1",
      fullName: "Aditya Kumar",
      email: "aditya@email.com",
      phone: "+91-9876543210",
      summary: "Passionate software developer with 1 year of internship experience in web development",
      experience: "Frontend Developer Intern • TechCorp • 2024 • Developed React applications and fixed UI bugs",
      education: "B.Tech CSE • XYZ University • 2024",
      skills: "React, JavaScript, HTML, CSS, Node.js, MongoDB",
      certifications: "Google Cloud Associate Cloud Engineer",
      createdAt: new Date("2024-12-01"),
    },
    {
      id: "2",
      fullName: "Priya Nair",
      email: "priya@email.com",
      phone: "+91-9876543211",
      summary: "Data-driven developer interested in data science and machine learning",
      experience: "Data Science Intern • Analytics Co. • 2024 • Built predictive models using Python",
      education: "B.Tech CSE • XYZ University • 2024",
      skills: "Python, Pandas, NumPy, TensorFlow, SQL, Tableau",
      certifications: "AWS Machine Learning Specialty",
      createdAt: new Date("2024-12-05"),
    },
    {
      id: "3",
      fullName: "Rohit Gupta",
      email: "rohit@email.com",
      phone: "+91-9876543212",
      summary: "Full-stack developer with experience in building scalable web applications",
      experience: "Junior Developer • WebSolutions • 2023-2024 • Built REST APIs and frontend interfaces",
      education: "B.Tech IT • ABC University • 2023",
      skills: "JavaScript, React, Node.js, Express, PostgreSQL, Docker",
      certifications: "Full Stack Web Development Certification",
      createdAt: new Date("2024-11-15"),
    },
  ]

  const studentQueries = [
    {
      id: 1,
      studentId: 1,
      studentName: "Aditya Kumar",
      studentEmail: "aditya@email.com",
      question: "How to prepare for tech interviews?",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Priya Nair",
      studentEmail: "priya@email.com",
      question: "Career transition from core to software?",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      studentId: 3,
      studentName: "Rohit Gupta",
      studentEmail: "rohit@email.com",
      question: "Best practices for code optimization?",
      timestamp: "1 day ago",
    },
  ]

  const receivedReviews = [
    {
      id: "1",
      studentName: "Aditya Kumar",
      itemType: "mentorship" as const,
      rating: 5,
      comment: "Priya was incredibly helpful in preparing for my interviews. Great mentor!",
      date: "2025-01-10",
    },
    {
      id: "2",
      studentName: "Priya Nair",
      itemType: "mentorship" as const,
      rating: 4,
      comment: "Excellent guidance on career transition. Highly recommended!",
      date: "2025-01-05",
    },
    {
      id: "3",
      studentName: "Rohit Gupta",
      itemType: "mentorship" as const,
      rating: 5,
      comment: "One-on-one sessions were very productive. Learned a lot!",
      date: "2024-12-28",
    },
  ]

  const handlePostJob = async (jobData: JobFormData) => {
    if (!profile) return
    try {
      await createJob({
        ...jobData,
        postedBy: profile.email,
        postedByName: profile.name,
        postedById: profile.uid,
      })
      alert("Job posted successfully!")
      loadPostedJobs(profile.uid)
      setShowPostJobForm(false)
    } catch (error) {
       console.error("Error posting job:", error)
       alert("Failed to post job")
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await deleteJob(jobId)
        setPostedJobs(postedJobs.filter((job) => job.jobId !== jobId))
      } catch (error) {
        console.error("Error deleting job:", error)
        alert("Failed to delete job")
      }
    }
  }

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId)
    setShowApplicantsModal(true)
    setLoadingApplicants(true)
    try {
      const apps = await getJobApplications(jobId)
      setJobApplicants(apps)
    } catch (error) {
      console.error("Error loading applicants:", error)
    } finally {
      setLoadingApplicants(false)
    }
  }

  const handleSubmitReview = (review: ResumeReview) => {
    setSubmittedReviews([review, ...submittedReviews])
    setShowResumeReviewModal(false)
    alert("Review submitted successfully!")
  }

  const getStudentReviews = (resumeId: string) => {
    return submittedReviews.filter((r) => r.resumeId === resumeId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="alumni" currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          {(["dashboard", "messages", "post-jobs", "resume-reviews", "reviews", "profile"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "post-jobs"
                ? "Post Jobs"
                : tab === "resume-reviews"
                  ? "Resume Reviews"
                  : tab === "reviews"
                    ? "Reviews Received"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {profile?.name || "Alumni"}!</h1>
              <p className="text-muted-foreground">Thank you for giving back to the alumni community</p>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">12</div>
                <p className="text-sm text-muted-foreground">Students Mentored</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-accent mb-2">28</div>
                <p className="text-sm text-muted-foreground">Chat Messages</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <p className="text-sm text-muted-foreground">Events Hosted</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-accent mb-2">{postedJobs.length}</div>
                <p className="text-sm text-muted-foreground">Jobs Posted</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Student Queries</h2>
              <div className="space-y-4">
                {studentQueries.slice(0, 2).map((query) => (
                  <div
                    key={query.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{query.studentName}</h3>
                        <p className="text-muted-foreground mb-2">{query.question}</p>
                        <p className="text-xs text-muted-foreground">{query.timestamp}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const student = students.find((s: StudentUser) => s.email === query.studentEmail)
                          if (student) {
                            setSelectedChat({
                              id: student.email,
                              name: student.name
                            })
                          }
                        }}
                      >
                        Respond
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab (Replaces Queries) */}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Student Messages</h2>

            {conversations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conversations.map((chat) => (
                  <div
                    key={chat.conversationId}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all flex flex-col cursor-pointer relative"
                    onClick={() =>
                      setSelectedChat({
                        id: chat.participants.studentId,
                        name: chat.participants.studentName,
                      })
                    }
                  >
                    {chat.unreadCount.alumni > 0 && (
                      <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {chat.unreadCount.alumni} new
                      </span>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl">👨‍🎓</div>
                      <div>
                        <h3 className="font-semibold text-foreground">{chat.participants.studentName}</h3>
                        <p className="text-xs text-muted-foreground">Student</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg flex-1 mb-4">
                      <p className="text-sm text-foreground line-clamp-2 italic">"{chat.lastMessage}"</p>
                      <p className="text-xs text-muted-foreground mt-2 text-right">
                        {chat.lastMessageTime?.toDate
                          ? chat.lastMessageTime.toDate().toLocaleDateString()
                          : "Just now"}
                      </p>
                    </div>

                    <Button variant="outline" className="w-full mt-auto">
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  When students contact you for mentorship, their messages will appear here.
                </p>
              </div>
            )}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Student Directory</h2>
              {loadingStudents ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading students...</p>
                </div>
              ) : students.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {students.map((student) => (
                    <div
                      key={student.uid}
                      className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all flex flex-col items-center text-center"
                    >
                      <div className="text-4xl mb-3">{student.image}</div>
                      <h3 className="font-semibold text-foreground text-lg">{student.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{student.course || "Student"}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {student.batch ? `Batch ${student.batch}` : ""}
                      </p>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setSelectedChat({
                            id: student.uid,
                            name: student.name,
                          })
                        }
                      >
                        Start Chat
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <div className="text-4xl mb-4">👨‍🎓</div>
                  <h3 className="text-xl font-semibold mb-2">No students yet</h3>
                  <p className="text-muted-foreground">
                    When students register, they will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "post-jobs" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Jobs & Internships Posted</h2>
                <p className="text-muted-foreground">Manage all the job opportunities you've posted for students</p>
              </div>
              <Button onClick={() => setShowPostJobForm(true)} className="whitespace-nowrap">
                + Post New Job
              </Button>
            </div>

            {loadingJobs ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading your job postings...</p>
              </div>
            ) : postedJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {postedJobs.map((job) => (
                  <div key={job.jobId} className="bg-card border border-border rounded-lg p-6 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span className="font-medium text-accent">{job.company}</span>
                      </div>
                      <div className="text-sm text-primary font-semibold">{job.salary}</div>
                    </div>

                    <p className="text-muted-foreground mb-4 text-sm flex-1">{job.description}</p>

                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex items-start gap-2">
                        <span>📍</span>
                        <span className="text-sm text-muted-foreground">{job.location}</span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">ELIGIBILITY</div>
                        <p className="text-foreground">{job.eligibility}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => job.jobId && handleViewApplicants(job.jobId)} variant="outline" className="flex-1 bg-transparent">
                        {job.applicants || 0} Applications
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => job.jobId && handleDeleteJob(job.jobId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                <Button onClick={() => setShowPostJobForm(true)}>Post Your First Job</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "resume-reviews" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Student Resumes for Review</h2>
              <p className="text-muted-foreground">Review student resumes and provide constructive feedback</p>
            </div>

            <div className="grid gap-6">
              {studentResumesForReview.map((resume) => {
                const reviews = getStudentReviews(resume.id)
                return (
                  <div key={resume.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{resume.fullName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{resume.email}</p>
                        <p className="text-sm text-foreground mb-2">
                          <strong>Summary:</strong> {resume.summary}
                        </p>
                        <p className="text-sm text-foreground mb-2">
                          <strong>Experience:</strong> {resume.experience}
                        </p>
                        <p className="text-sm text-foreground mb-2">
                          <strong>Skills:</strong> {resume.skills}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground mb-2">{reviews.length}</div>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                      </div>
                    </div>

                    {reviews.length > 0 && (
                      <div className="bg-muted/30 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-border"
                          >
                            <div className="flex gap-1 mb-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-sm ${star <= review.rating ? "text-yellow-400" : "text-muted-foreground"}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-foreground">{review.feedback}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        setSelectedResume(resume)
                        setShowResumeReviewModal(true)
                      }}
                    >
                      {reviews.length > 0 ? "Update Review" : "Review Resume"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Reviews & Ratings</h2>
              <p className="text-muted-foreground">Feedback from students about your mentorship</p>
            </div>

            {receivedReviews.length > 0 ? (
              <div className="space-y-4">
                {receivedReviews.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{review.studentName}</h3>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-muted-foreground"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Keep mentoring students!</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Profile</h2>
            {loading ? (
              <p>Loading profile...</p>
            ) : profile ? (
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="text-6xl mb-6">{profile.image || "👨‍💼"}</div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Email ID</label>
                    <p className="text-lg text-foreground mt-2">{profile.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Profession</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.profession || ""}
                        onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.profession || "Not Set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Course Completed</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.course || ""}
                        onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.course || "Not Set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Current Field of Work</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.field || ""}
                        onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.field || "Not Set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Company</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.company || ""}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.company || "Not Set"}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Batch Year</label>
                    {isEditing ? (
                      <input
                        className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                        value={editForm.batch || ""}
                        onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg text-foreground mt-2">{profile.batch || "Not Set"}</p>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-4">
                      <Button className="flex-1" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p>Profile not found</p>
            )}
          </div>
        )}
      </main>

      {showPostJobForm && <PostJobForm onClose={() => setShowPostJobForm(false)} onSubmit={handlePostJob} />}

      {showResumeReviewModal && selectedResume && (
        <ResumeReviewModal
          resume={selectedResume}
          onClose={() => {
            setShowResumeReviewModal(false)
            setSelectedResume(null)
          }}
          onSubmit={handleSubmitReview}
          existingReview={selectedResume ? submittedReviews.find((r) => r.resumeId === selectedResume.id) : undefined}
        />
      )}

      {selectedChat && profile && (
        <ChatWindow
          myId={profile.email}
          myName={profile.name}
          myRole="alumni"
          targetId={selectedChat.id}
          targetName={selectedChat.name}
          onClose={() => {
            setSelectedChat(null)
            if (profile?.uid) loadConversations(profile.uid) // Refresh list when closing
          }}
        />
      )}

      {/* Legacy global chat logic preserved but unused for now
      {chatStudentId && (
        <GlobalChat
          userType="alumni"
          myId={profile?.id || "alumni"}
          targetId={chatStudentId}
          onClose={() => setChatStudentId(null)}
        />
      )} 
      */}

      {showApplicantsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Job Applications
              </h2>
              <button
                onClick={() => {
                  setShowApplicantsModal(false)
                  setSelectedJobId(null)
                  setJobApplicants([])
                }}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2">
              {loadingApplicants ? (
                <div className="text-center py-8 text-muted-foreground">Loading applicants...</div>
              ) : jobApplicants.length > 0 ? (
                <div className="space-y-4">
                  {jobApplicants.map((app) => (
                    <div key={app.applicationId} className="bg-muted/30 border border-border p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <h4 className="font-semibold text-foreground">{app.studentName}</h4>
                        <a href={`mailto:${app.studentEmail}`} className="text-sm text-primary hover:underline">{app.studentEmail}</a>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {app.appliedAt && 'toDate' in app.appliedAt ? app.appliedAt.toDate().toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {/* We could add logic later to reject/accept or view resume. For now, email is the primary contact method. */}
                        <a href={`mailto:${app.studentEmail}`}>
                          <Button size="sm">Email Student</Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-3">📄</div>
                  <p>No applications yet for this job.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <Button variant="outline" onClick={() => setShowApplicantsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
