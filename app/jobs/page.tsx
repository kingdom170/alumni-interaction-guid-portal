"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { getAllJobs, applyForJob, hasUserApplied, type JobData } from "@/lib/firestore/job-service"

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "internship" | "fulltime">("all")
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  // Load user info and jobs
  useEffect(() => {
    const uid = localStorage.getItem("userId") || ""
    const email = localStorage.getItem("userEmail") || ""
    const name = localStorage.getItem("userName") || ""
    setUserId(uid)
    setUserEmail(email)
    setUserName(name)

    loadJobs(uid)
  }, [])

  const loadJobs = async (uid: string) => {
    setLoading(true)
    try {
      const allJobs = await getAllJobs()
      setJobs(allJobs)

      // Check which jobs user has applied to
      if (uid) {
        const appliedJobIds: string[] = []
        for (const job of allJobs) {
          if (job.jobId) {
            const applied = await hasUserApplied(job.jobId, uid)
            if (applied) {
              appliedJobIds.push(job.jobId)
            }
          }
        }
        setAppliedJobs(appliedJobIds)
      }
    } catch (error) {
      console.error("Error loading jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const [applyingTo, setApplyingTo] = useState<string | null>(null)

  const handleApplyJob = async (jobId: string, jobTitle: string) => {
    if (!userId) {
      alert("Please log in to apply for jobs")
      return
    }

    if (appliedJobs.includes(jobId)) {
      alert("You have already applied for this job")
      return
    }

    setApplyingTo(jobId)
    try {
      await applyForJob(jobId, {
        studentId: userId,
        studentEmail: userEmail,
        studentName: userName,
      })

      setAppliedJobs([...appliedJobs, jobId])
      alert(`Successfully applied for ${jobTitle}!`)

      // Update the local jobs array directly to avoid fully wiping the screen with a loading spinner
      setJobs(jobs.map(job => 
        job.jobId === jobId ? { ...job, applicants: (job.applicants || 0) + 1 } : job
      ))
    } catch (error) {
      console.error("Error applying for job:", error)
      alert("Failed to apply for job. Please try again.")
    } finally {
      setApplyingTo(null)
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      selectedType === "all" ||
      (selectedType === "internship" && job.type === "Internship") ||
      (selectedType === "fulltime" && job.type === "Full-time")
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="jobs" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Internships & Job Opportunities</h1>
          <p className="text-muted-foreground mb-6">Explore career opportunities posted by our alumni</p>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Search</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["all", "internship", "fulltime"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary"
                    }`}
                >
                  {type === "all" ? "All Opportunities" : type === "internship" ? "Internships" : "Full-time Jobs"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded">{job.type}</span>
                      {job.applicants > 0 && (
                        <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                          {job.applicants} applicant{job.applicants !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <span className="font-medium text-accent">{job.company}</span>
                    </div>
                    <div className="text-sm text-primary font-semibold">{job.salary}</div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm">{job.description}</p>

                  <div className="space-y-3 mb-6 text-sm flex-1">
                    <div className="flex items-start gap-2">
                      <span>📍</span>
                      <span className="text-muted-foreground">{job.location}</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">ELIGIBILITY</div>
                      <p className="text-foreground">{job.eligibility}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">POSTED BY</div>
                      <p className="text-foreground">{job.postedByName}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => job.jobId && handleApplyJob(job.jobId, job.title)}
                    variant={job.jobId && appliedJobs.includes(job.jobId) ? "default" : "outline"}
                    className="w-full"
                    disabled={!!(job.jobId && (appliedJobs.includes(job.jobId) || applyingTo === job.jobId))}
                  >
                    {job.jobId && applyingTo === job.jobId ? "⏳ Applying..." : job.jobId && appliedJobs.includes(job.jobId) ? "✓ Applied" : "Apply Now"}
                  </Button>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No opportunities found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
