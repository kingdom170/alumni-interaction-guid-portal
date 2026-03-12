"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PostJobFormProps {
  onClose: () => void
  onSubmit: (jobData: JobFormData) => void
}

export interface JobFormData {
  title: string
  company: string
  location: string
  type: "Full-time" | "Internship"
  salary: string
  eligibility: string
  description: string
}

export function PostJobForm({ onClose, onSubmit }: PostJobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    eligibility: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.company && formData.location && formData.salary && formData.description) {
      onSubmit(formData)
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        eligibility: "",
        description: "",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">Post a Job/Internship Opportunity</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Junior Frontend Developer"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Tech Corp"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore, India"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Job Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Salary/Stipend *</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., 4-6 LPA or ₹15,000/month"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Eligibility *</label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g., B.Tech - CSE, 2024-2025 batch"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what you're looking for in candidates..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button type="submit" className="flex-1">
              Post Job Opportunity
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
