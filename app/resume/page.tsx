"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ResumeBuilderModal, type ResumeData } from "@/components/resume-builder-modal"
import Link from "next/link"
import { Download, Trash2, Edit2 } from "lucide-react"
import {
  createResume,
  updateResume,
  deleteResume as deleteResumeFromFirebase,
  getUserResumes,
  type ResumeData as FirebaseResumeData,
} from "@/lib/firestore/resume-service"

export default function ResumePage() {
  const [resumes, setResumes] = useState<ResumeData[]>([])
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingResume, setEditingResume] = useState<ResumeData | undefined>()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")

  // Load user info and resumes
  useEffect(() => {
    const uid = localStorage.getItem("userId") || ""
    const email = localStorage.getItem("userEmail") || ""
    setUserId(uid)
    setUserEmail(email)

    if (uid) {
      loadResumes(uid)
    } else {
      setLoading(false)
    }
  }, [])

  const loadResumes = async (uid: string) => {
    setLoading(true)
    try {
      const firebaseResumes = await getUserResumes(uid)

      // Convert Firebase resumes to component format
      const convertedResumes: ResumeData[] = firebaseResumes.map((fbResume) => ({
        id: fbResume.resumeId || "",
        fullName: fbResume.fullName,
        email: fbResume.email,
        phone: fbResume.phone,
        summary: fbResume.summary,
        experience: fbResume.experience,
        education: fbResume.education,
        skills: fbResume.skills,
        certifications: fbResume.certifications,
        createdAt: fbResume.createdAt instanceof Date ? fbResume.createdAt : new Date(),
      }))

      setResumes(convertedResumes)
    } catch (error) {
      console.error("Error loading resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResume = async (resume: ResumeData) => {
    if (!userId || !userEmail) {
      alert("Please log in to save resumes")
      return
    }

    try {
      if (editingResume) {
        // Update existing resume
        await updateResume(resume.id, {
          fullName: resume.fullName,
          email: resume.email,
          phone: resume.phone,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          certifications: resume.certifications,
        })
        setResumes(resumes.map((r) => (r.id === resume.id ? resume : r)))
        setEditingResume(undefined)
      } else {
        // Create new resume
        const resumeId = await createResume({
          userId,
          userEmail,
          fullName: resume.fullName,
          email: resume.email,
          phone: resume.phone,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          certifications: resume.certifications,
        })

        const newResume: ResumeData = {
          ...resume,
          id: resumeId,
          createdAt: new Date(),
        }
        setResumes([newResume, ...resumes])
      }
      setShowBuilder(false)
    } catch (error) {
      console.error("Error saving resume:", error)
      alert("Failed to save resume. Please try again.")
    }
  }

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return
    }

    try {
      await deleteResumeFromFirebase(id)
      setResumes(resumes.filter((r) => r.id !== id))
    } catch (error) {
      console.error("Error deleting resume:", error)
      alert("Failed to delete resume. Please try again.")
    }
  }

  const handleEditResume = (resume: ResumeData) => {
    setEditingResume(resume)
    setShowBuilder(true)
  }

  const handleDownloadResume = (resume: ResumeData) => {
    const content = `
${resume.fullName}
Email: ${resume.email}
Phone: ${resume.phone}

PROFESSIONAL SUMMARY
${resume.summary}

EDUCATION
${resume.education}

WORK EXPERIENCE
${resume.experience}

SKILLS
${resume.skills}

${resume.certifications ? `CERTIFICATIONS\n${resume.certifications}` : ""}
    `
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `${resume.fullName}-Resume.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="resume" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
            <Button onClick={() => setShowBuilder(true)}>+ Create New Resume</Button>
          </div>
          <p className="text-muted-foreground">
            Create and manage your resumes. Alumni mentors can review and provide feedback.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Resumes Yet</h2>
            <p className="text-muted-foreground mb-6">Create your first resume to get feedback from alumni mentors</p>
            <Button onClick={() => setShowBuilder(true)}>Create Your First Resume</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all"
              >
                {/* Resume Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{resume.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadResume(resume)}
                      title="Download Resume"
                    >
                      <Download size={16} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditResume(resume)} title="Edit Resume">
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteResume(resume.id)}
                      title="Delete Resume"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {/* Resume Preview */}
                <div className="bg-background rounded-lg p-4 mb-4 max-h-48 overflow-hidden">
                  <div className="text-sm space-y-2 text-foreground">
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
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex gap-4">
                  <Link href={`/resume-review/${resume.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Reviews
                    </Button>
                  </Link>
                  <Link href={`/alumni?resume=${resume.id}`} className="flex-1">
                    <Button className="w-full">Get Review from Alumni</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showBuilder && (
        <ResumeBuilderModal
          onClose={() => {
            setShowBuilder(false)
            setEditingResume(undefined)
          }}
          onSubmit={handleSaveResume}
          initialData={editingResume}
        />
      )}
    </div>
  )
}
