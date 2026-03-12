"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { alumniData, eventsData, jobsData, eventQueryMessages } from "@/lib/data"
import Link from "next/link"
import { GlobalChat } from "@/components/global-chat"

export default function UserDashboard() {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [queryMessages, setQueryMessages] = useState<typeof eventQueryMessages>(eventQueryMessages)
  const [queryText, setQueryText] = useState("")

  const handleRegisterEvent = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

  const handleApplyJob = (jobId: number) => {
    if (appliedJobs.includes(jobId)) {
      setAppliedJobs(appliedJobs.filter((id) => id !== jobId))
    } else {
      setAppliedJobs([...appliedJobs, jobId])
    }
  }

  const handleSubmitQuery = (eventId: number) => {
    if (!queryText.trim()) return

    const newQuery = {
      id: Date.now().toString(),
      eventId,
      studentName: "Student Name",
      studentEmail: "student@email.com",
      message: queryText,
      timestamp: new Date(),
      replied: false,
    }

    setQueryMessages([...queryMessages, newQuery])
    setQueryText("")
    alert("Query sent to teacher successfully!")
  }

  const getEventQueries = (eventId: number) => {
    return queryMessages.filter((q) => q.eventId === eventId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Explore opportunities, connect with alumni, and advance your career</p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {eventsData.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">{event.category}</div>
                    <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>📅</span>
                    <span>
                      {event.date} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>👤</span>
                    <span>{event.organizer}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleRegisterEvent(event.id)}
                  className={
                    registeredEvents.includes(event.id) ? "w-full bg-green-600 hover:bg-green-700 mb-4" : "w-full mb-4"
                  }
                >
                  {registeredEvents.includes(event.id) ? "✓ Registered" : "Register"}
                </Button>
                <div className="border-t border-border pt-4">
                  <button
                    onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
                  >
                    <span>💬</span>
                    {expandedEvent === event.id ? "Hide" : "Ask a Query"}
                  </button>
                  {expandedEvent === event.id && (
                    <div className="mt-4 space-y-3">
                      <textarea
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        placeholder="Ask your question here..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <button
                        onClick={() => handleSubmitQuery(event.id)}
                        className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium text-sm transition-colors"
                      >
                        Send Query
                      </button>
                      {getEventQueries(event.id).length > 0 && (
                        <div className="bg-muted/50 rounded-lg p-3 mt-3 text-xs space-y-2 max-h-32 overflow-y-auto">
                          <div className="font-medium text-foreground">Your Queries:</div>
                          {getEventQueries(event.id).map((query) => (
                            <div key={query.id} className="bg-background p-2 rounded border border-border text-xs">
                              <div className="text-foreground">{query.message}</div>
                              <div className="text-muted-foreground mt-1">
                                {query.replied ? "✓ Replied" : "⏳ Pending"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs & Internships */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Internships & Job Opportunities</h2>
            <Link href="/jobs">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {jobsData.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-accent">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="text-sm text-primary font-medium">{job.salary}</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                <div className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">ELIGIBILITY</div>
                  <p className="text-sm text-foreground">{job.eligibility}</p>
                </div>
                <Button
                  onClick={() => handleApplyJob(job.id)}
                  variant={appliedJobs.includes(job.id) ? "default" : "outline"}
                  className="w-full"
                >
                  {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply Now"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Alumni Cards Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Connect with Alumni</h2>
            <Link href="/alumni">
              <Button variant="outline" size="sm">
                View All Alumni
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumniData.slice(0, 4).map((alumni) => (
              <div
                key={alumni.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-4">{alumni.image}</div>
                <h3 className="font-semibold text-foreground mb-1">{alumni.name}</h3>
                <p className="text-sm font-medium text-primary mb-3">{alumni.profession}</p>
                <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                  <div>{alumni.company}</div>
                  <div>{alumni.field}</div>
                  <div>{alumni.course}</div>
                  <div>Batch: {alumni.batch}</div>
                </div>
                <Link href={`/chat/${alumni.id}`}>
                  <Button className="w-full" size="sm">
                    Chat with Alumni
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <GlobalChat userType="student" myId={1} />
    </div>
  )
}
