"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface ResumeData {
  id: string
  fullName: string
  email: string
  phone: string
  summary: string
  experience: string
  education: string
  skills: string
  certifications?: string
  createdAt: Date
}

interface ResumeBuilderModalProps {
  onClose: () => void
  onSubmit: (data: ResumeData) => void
  initialData?: ResumeData
}

export function ResumeBuilderModal({ onClose, onSubmit, initialData }: ResumeBuilderModalProps) {
  const [formData, setFormData] = useState<Omit<ResumeData, "id" | "createdAt">>(
    initialData
      ? {
          fullName: initialData.fullName,
          email: initialData.email,
          phone: initialData.phone,
          summary: initialData.summary,
          experience: initialData.experience,
          education: initialData.education,
          skills: initialData.skills,
          certifications: initialData.certifications,
        }
      : {
          fullName: "",
          email: "",
          phone: "",
          summary: "",
          experience: "",
          education: "",
          skills: "",
          certifications: "",
        },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const resumeData: ResumeData = {
      id: initialData?.id || Date.now().toString(),
      ...formData,
      createdAt: initialData?.createdAt || new Date(),
    }
    onSubmit(resumeData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">Build Your Resume</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
            <textarea
              name="summary"
              placeholder="Brief summary about yourself and career goals..."
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Education</h3>
            <textarea
              name="education"
              placeholder="Degree • University • Year (e.g., B.Tech CSE • XYZ University • 2024)"
              value={formData.education}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
            <textarea
              name="experience"
              placeholder="Job Title • Company • Duration • Description (e.g., Intern • Tech Corp • 2023-2024 • Built web applications)"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Skills</h3>
            <textarea
              name="skills"
              placeholder="List skills separated by commas (e.g., React, TypeScript, JavaScript, CSS, HTML)"
              value={formData.skills}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Certifications (Optional)</h3>
            <textarea
              name="certifications"
              placeholder="Certifications and achievements (e.g., AWS Solutions Architect, Google Cloud Certified)"
              value={formData.certifications}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Resume" : "Create Resume"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
