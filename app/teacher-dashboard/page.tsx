"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { eventsData, alumniData, eventQueryMessages, coursesData } from "@/lib/data"
import Link from "next/link"
import type { Course } from "@/lib/data"
import { createEvent, updateEvent, deleteEvent, getEventsByOrganizer, type EventData } from "@/lib/firestore/event-service"
import { createCourse, updateCourse, deleteCourse, getCoursesByInstructor, type CourseData } from "@/lib/firestore/course-service"
import { EventRegistrationsModal } from "@/components/event-registrations-modal"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "post-event" | "post-course" | "queries" | "alumni" | "reviews"
  >("overview")
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventCategory, setEventCategory] = useState("Workshop")
  const [postedEvents, setPostedEvents] = useState(eventsData)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState<string>("all")
  const [queries, setQueries] = useState<typeof eventQueryMessages>(eventQueryMessages)
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("Web Development")
  const [courseLevel, setCourseLevel] = useState("Beginner")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseStartDate, setCourseStartDate] = useState("")
  const [courseLink, setCourseLink] = useState("")
  const [postedCourses, setPostedCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [registrationsModal, setRegistrationsModal] = useState<{
    isOpen: boolean
    eventId: string
    eventTitle: string
  }>({ isOpen: false, eventId: "", eventTitle: "" })
  const [teacherEmail, setTeacherEmail] = useState("")
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const receivedReviews = [
    {
      id: "1",
      studentName: "Aditya Kumar",
      courseTitle: "Web Development Fundamentals",
      rating: 5,
      comment: "Excellent course! The instructor explained concepts very clearly.",
      date: "2025-01-08",
    },
    {
      id: "2",
      studentName: "Priya Nair",
      courseTitle: "Web Development Fundamentals",
      rating: 4,
      comment: "Great content and assignments. Would appreciate more real-world projects.",
      date: "2025-01-05",
    },
    {
      id: "3",
      studentName: "Rohit Gupta",
      eventTitle: "Career in AI & Machine Learning",
      rating: 5,
      comment: "Fantastic tech talk! Very inspiring and informative.",
      date: "2024-12-20",
    },
  ]

  // Load teacher email from localStorage on component mount
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "teacher@mes.ac.in"
    const name = localStorage.getItem("userName") || "Teacher"
    setTeacherEmail(email)
    // Load events and courses from Firebase
    loadTeacherEvents(email)
    loadCourses()
  }, [])

  const loadTeacherEvents = async (email: string) => {
    setLoadingEvents(true)
    try {
      const events = await getEventsByOrganizer(email)
      if (events.length > 0) {
        // Convert Firebase events to local format for display
        const formattedEvents = events.map((event) => ({
          id: event.eventId || "",
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          organizer: event.createdByName,
          category: event.category,
        }))
        setPostedEvents(formattedEvents as any)
      }
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setLoadingEvents(false)
    }
  }

  // Load courses from Firebase
  const loadCourses = async () => {
    setLoadingCourses(true)
    try {
      const email = localStorage.getItem("userEmail") || "teacher@mes.ac.in"
      const courses = await getCoursesByInstructor(email)
      setPostedCourses(courses as any)
    } catch (error) {
      console.error("Error loading courses:", error)
    } finally {
      setLoadingCourses(false)
    }
  }

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle || !eventDescription || !eventDate || !eventTime) {
      alert("Please fill in all fields")
      return
    }

    try {
      const teacherName = localStorage.getItem("userName") || "Teacher"
      const email = localStorage.getItem("userEmail") || "teacher@mes.ac.in"

      // Save to Firebase
      const eventId = await createEvent({
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        category: eventCategory,
        createdBy: email,
        createdByName: teacherName,
        createdByRole: "teacher",
        status: "upcoming",
      })

      // Add to local state for immediate display
      const newEvent = {
        id: eventId,
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        organizer: teacherName,
        category: eventCategory,
      }

      setPostedEvents([newEvent, ...postedEvents] as any)
      setEventTitle("")
      setEventDescription("")
      setEventDate("")
      setEventTime("")
      setEventCategory("Workshop")
      setShowForm(false)
      alert("Event posted successfully!")
    } catch (error) {
      console.error("Error posting event:", error)
      alert("Failed to post event. Please try again.")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    try {
      await deleteEvent(eventId)
      setPostedEvents(postedEvents.filter((event) => event.id.toString() !== eventId))
    } catch (error) {
      alert("Failed to delete event. Please try again.")
    }
  }

  const handleSaveEventEdit = async () => {
    if (!editingEvent?.eventId) return
    setSavingEdit(true)
    try {
      await updateEvent(editingEvent.eventId, {
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        time: editingEvent.time,
        category: editingEvent.category,
      })
      setPostedEvents(postedEvents.map((e) =>
        e.id.toString() === editingEvent.eventId
          ? { ...e, title: editingEvent.title, description: editingEvent.description, date: editingEvent.date, time: editingEvent.time, category: editingEvent.category }
          : e
      ))
      setEditingEvent(null)
    } catch (error) {
      alert("Failed to update event. Please try again.")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleSaveCourseEdit = async () => {
    if (!editingCourse?.courseId) return
    setSavingEdit(true)
    try {
      await updateCourse(editingCourse.courseId, {
        title: editingCourse.title,
        description: editingCourse.description,
        category: editingCourse.category,
        level: editingCourse.level,
        duration: editingCourse.duration,
        startDate: editingCourse.startDate,
        link: editingCourse.link,
      })
      setPostedCourses(postedCourses.map((c) =>
        (c as any).courseId === editingCourse.courseId ? { ...c, ...editingCourse } : c
      ))
      setEditingCourse(null)
    } catch (error) {
      alert("Failed to update course. Please try again.")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    try {
      await deleteCourse(courseId)
      setPostedCourses(postedCourses.filter((c) => (c as any).courseId !== courseId))
    } catch (error) {
      alert("Failed to delete course. Please try again.")
    }
  }

  const handleReplyQuery = (queryId: string) => {
    if (!replyText[queryId]?.trim()) return

    setQueries(queries.map((q) => (q.id === queryId ? { ...q, replied: true } : q)))
    setReplyText({ ...replyText, [queryId]: "" })
    alert("Reply sent to student!")
  }

  const handlePostCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseTitle || !courseDescription || !courseDuration || !courseStartDate || !courseLink) {
      alert("Please fill in all fields including the course link")
      return
    }

    try {
      const teacherName = localStorage.getItem("userName") || "Teacher"
      const email = localStorage.getItem("userEmail") || "teacher@mes.ac.in"

      // Save to Firebase
      const courseId = await createCourse({
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        level: courseLevel as "Beginner" | "Intermediate" | "Advanced",
        duration: courseDuration,
        startDate: courseStartDate,
        link: courseLink,
        instructor: teacherName,
        instructorId: email,
      })

      // Add to local state for immediate display
      const newCourse = {
        id: courseId,
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        level: courseLevel as "Beginner" | "Intermediate" | "Advanced",
        duration: courseDuration,
        startDate: courseStartDate,
        link: courseLink,
        instructor: teacherName,
        enrolledCount: 0,
        rating: 0,
      }

      setPostedCourses([newCourse, ...postedCourses] as any)
      setCourseTitle("")
      setCourseDescription("")
      setCourseCategory("Web Development")
      setCourseLevel("Beginner")
      setCourseDuration("")
      setCourseStartDate("")
      setCourseLink("")
      setShowCourseForm(false)
      alert("Course posted successfully!")
    } catch (error) {
      console.error("Error posting course:", error)
      alert("Failed to post course. Please try again.")
    }
  }

  const uniqueFields = ["all", ...new Set(alumniData.map((a) => a.field))]

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "all" || alumni.field === selectedField
    return matchesSearch && matchesField
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="teacher" currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage events, handle queries, and connect with alumni</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/50 pb-2 overflow-x-auto scroolbar-hide">
          {(["overview", "post-event", "post-course", "queries", "alumni", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-105"
                }`}
            >
              {tab === "post-event"
                ? "Post Event"
                : tab === "post-course"
                  ? "Post Course"
                  : tab === "reviews"
                    ? "Reviews Received"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-primary">
                <div className="text-4xl font-black text-gradient-primary mb-2">{postedEvents.length}</div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Events Posted</p>
              </div>
              <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-secondary">
                <div className="text-4xl font-black text-secondary mb-2">{postedEvents.length * 25 + postedCourses.length * 15}</div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Attendees</p>
              </div>
              <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-accent">
                <div className="text-4xl font-black text-accent mb-2">
                  {queries.filter((q) => !q.replied).length}
                </div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending Queries</p>
              </div>
              <div className="glass-card rounded-2xl p-6 hover-lift border-t-4 border-t-primary">
                <div className="text-4xl font-black text-gradient-primary mb-2">{queries.filter((q) => q.replied).length}</div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Replied Queries</p>
              </div>
            </div>

            {/* Posted Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Posted Events</h2>
                <Button
                  onClick={() => {
                    setActiveTab("post-event")
                    setShowForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  + Post New Event
                </Button>
              </div>

              {postedEvents.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <p className="text-muted-foreground mb-4">No events posted yet</p>
                  <Button
                    onClick={() => {
                      setActiveTab("post-event")
                      setShowForm(true)
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                  >
                    Post Your First Event
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {postedEvents.map((event, idx) => (
                    <div
                      key={event.id}
                      className={`glass-card rounded-2xl p-6 hover-lift border-l-4 border-l-primary/50 transition-all duration-300 animate-slide-down delay-${(idx+1)*100}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded inline-block mb-2 uppercase tracking-wide">{event.category}</div>
                          <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingEvent({ eventId: event.id.toString(), title: event.title, description: event.description, date: event.date, time: event.time, category: event.category, createdBy: teacherEmail, createdByName: "", createdByRole: "teacher", status: "upcoming" })}
                            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id.toString())}
                            className="text-destructive hover:text-destructive/80 font-medium text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setRegistrationsModal({
                              isOpen: true,
                              eventId: event.id.toString(),
                              eventTitle: event.title,
                            })
                          }
                          className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200"
                        >
                          View Registrations
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Posted Courses */}
            {postedCourses.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-foreground mb-6">Your Posted Courses</h3>
                <div className="space-y-4">
                  {postedCourses.map((course) => (
                    <div key={course.id} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course.category} • {course.level}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { const c = course as any; setEditingCourse({ courseId: c.courseId || c.id?.toString(), title: c.title, description: c.description, category: c.category, level: c.level, duration: c.duration, startDate: c.startDate, link: c.link || '', instructor: c.instructor, instructorId: c.instructorId || teacherEmail }) }}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id?.toString() || "")}
                            className="text-destructive hover:text-destructive/80 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Duration: {course.duration}</span>
                        <span>Starts: {course.startDate}</span>
                        <span>Enrolled: {course.enrolledCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post Event Tab */}
        {activeTab === "post-event" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Post a New Event</h2>

            <div className="max-w-2xl bg-card border border-border rounded-lg p-8">
              <form onSubmit={handlePostEvent} className="space-y-6">
                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Event Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g., Advanced Web Development Workshop"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe the event in detail..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    Event Date
                  </label>
                  <input
                    id="date"
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g., Jan 15, 2025"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                    Event Time
                  </label>
                  <input
                    id="time"
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g., 3:00 PM"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Event Category
                  </label>
                  <select
                    id="category"
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Workshop</option>
                    <option>Tech Talk</option>
                    <option>Seminar</option>
                    <option>Entrepreneurship</option>
                    <option>Networking</option>
                    <option>Career Talk</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 h-auto text-base">
                    Post Event
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setEventTitle("")
                      setEventDescription("")
                      setEventDate("")
                      setEventTime("")
                      setEventCategory("Workshop")
                    }}
                    variant="outline"
                    className="flex-1 py-2 h-auto text-base"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Course Tab */}
        {activeTab === "post-course" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Post a New Course</h2>

            <div className="max-w-2xl bg-card border border-border rounded-lg p-8">
              <form onSubmit={handlePostCourse} className="space-y-6">
                {/* Course Title */}
                <div>
                  <label htmlFor="courseTitle" className="block text-sm font-medium text-foreground mb-2">
                    Course Title
                  </label>
                  <input
                    id="courseTitle"
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Advanced React Development"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Course Description */}
                <div>
                  <label htmlFor="courseDescription" className="block text-sm font-medium text-foreground mb-2">
                    Course Description
                  </label>
                  <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Describe your course content and objectives..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="courseCategory" className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    id="courseCategory"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Machine Learning</option>
                    <option>Mobile Development</option>
                    <option>Design</option>
                    <option>DevOps</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="courseLevel" className="block text-sm font-medium text-foreground mb-2">
                    Level
                  </label>
                  <select
                    id="courseLevel"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="courseDuration" className="block text-sm font-medium text-foreground mb-2">
                    Duration
                  </label>
                  <input
                    id="courseDuration"
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="courseStartDate" className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <input
                    id="courseStartDate"
                    type="text"
                    value={courseStartDate}
                    onChange={(e) => setCourseStartDate(e.target.value)}
                    placeholder="e.g., Feb 3, 2025"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Course Link */}
                <div>
                  <label htmlFor="courseLink" className="block text-sm font-medium text-foreground mb-2">
                    Course Link
                  </label>
                  <input
                    id="courseLink"
                    type="url"
                    value={courseLink}
                    onChange={(e) => setCourseLink(e.target.value)}
                    placeholder="e.g., https://www.coursera.org/learn/course-name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add enrollment link from platforms like Coursera, Udemy, edX, etc.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Post Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Queries Tab */}
        {activeTab === "queries" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Student Queries</h2>

            {queries.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No student queries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{query.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{query.studentEmail}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${query.replied ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {query.replied ? "✓ Replied" : "⏳ Pending"}
                      </span>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-foreground text-sm">{query.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(query.timestamp).toLocaleString()}</p>
                    </div>

                    {/* Reply Section */}
                    <button
                      onClick={() => setExpandedQuery(expandedQuery === query.id ? null : query.id)}
                      className="text-sm font-medium text-blue-600 hover:underline mb-3"
                    >
                      {expandedQuery === query.id ? "Hide Reply" : "Reply"}
                    </button>

                    {expandedQuery === query.id && (
                      <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                        <textarea
                          value={replyText[query.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [query.id]: e.target.value })}
                          placeholder="Type your reply here..."
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                        <button
                          onClick={() => handleReplyQuery(query.id)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          Send Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alumni Network Tab */}
        {activeTab === "alumni" && (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Alumni Network</h2>
              <p className="text-muted-foreground mb-6">Connect with successful alumni and collaborate on events</p>

              {/* Filters */}
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Search by name, profession, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <div className="flex gap-2 flex-wrap">
                  {uniqueFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => setSelectedField(field)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${selectedField === field
                        ? "bg-blue-600 text-white"
                        : "bg-card border border-border text-foreground hover:border-blue-600"
                        }`}
                    >
                      {field === "all" ? "All Fields" : field}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alumni Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumni) => (
                <div
                  key={alumni.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all flex flex-col text-center"
                >
                  <div className="text-5xl mb-4">{alumni.image}</div>

                  <h3 className="font-semibold text-foreground mb-1 text-balance">{alumni.name}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-2">{alumni.profession}</p>

                  <div className="space-y-2 mb-6 text-xs text-muted-foreground flex-1">
                    <div className="font-medium">{alumni.company}</div>
                    <div>{alumni.field}</div>
                    <div>{alumni.course}</div>
                    <div>Batch {alumni.batch}</div>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/chat/${alumni.id}`} className="block">
                      <Button className="w-full" size="sm">
                        Chat
                      </Button>
                    </Link>
                    <a href={`mailto:${alumni.email}`} className="block">
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
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Reviews & Ratings</h2>
              <p className="text-muted-foreground">Feedback from students about your courses and events</p>
            </div>

            {receivedReviews.length > 0 ? (
              <div className="space-y-4">
                {receivedReviews.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{review.studentName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {review.courseTitle ? `Course: ${review.courseTitle}` : `Event: ${review.eventTitle}`}
                        </p>
                        <div className="flex gap-1">
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
                <p className="text-muted-foreground">No reviews yet. Keep creating great courses and events!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <EventRegistrationsModal
        isOpen={registrationsModal.isOpen}
        eventId={registrationsModal.eventId}
        eventTitle={registrationsModal.eventTitle}
        onClose={() => setRegistrationsModal({ isOpen: false, eventId: "", eventTitle: "" })}
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Edit Event</h2>
              <button onClick={() => setEditingEvent(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Event Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                  <input
                    type="text"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Workshop</option>
                  <option>Tech Talk</option>
                  <option>Seminar</option>
                  <option>Entrepreneurship</option>
                  <option>Networking</option>
                  <option>Career Talk</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleSaveEventEdit}
                disabled={savingEdit}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingEvent(null)}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Edit Course</h2>
              <button onClick={() => setEditingCourse(null)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Machine Learning</option>
                    <option>Mobile Development</option>
                    <option>Design</option>
                    <option>DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Level</label>
                  <select
                    value={editingCourse.level}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as "Beginner" | "Intermediate" | "Advanced" })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="e.g. 8 weeks"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                  <input
                    type="text"
                    value={editingCourse.startDate}
                    onChange={(e) => setEditingCourse({ ...editingCourse, startDate: e.target.value })}
                    placeholder="e.g. Feb 3, 2025"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Course Link</label>
                <input
                  type="url"
                  value={editingCourse.link}
                  onChange={(e) => setEditingCourse({ ...editingCourse, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleSaveCourseEdit}
                disabled={savingEdit}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingCourse(null)}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
