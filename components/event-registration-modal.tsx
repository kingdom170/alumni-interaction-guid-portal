"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface EventRegistrationModalProps {
    isOpen: boolean
    eventTitle: string
    onClose: () => void
    onSubmit: (data: RegistrationData) => void
}

export interface RegistrationData {
    fullName: string
    email: string
    phone: string
    department: string
    year: string
    dietaryRestrictions?: string
    additionalNotes?: string
}

export function EventRegistrationModal({ isOpen, eventTitle, onClose, onSubmit }: EventRegistrationModalProps) {
    const [formData, setFormData] = useState<RegistrationData>({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        dietaryRestrictions: "",
        additionalNotes: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            department: "",
            year: "",
            dietaryRestrictions: "",
            additionalNotes: "",
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Event Registration</h2>
                            <p className="text-sm text-muted-foreground mt-1">{eventTitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your.email@student.mes.ac.in"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="10-digit mobile number"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1.5">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Civil">Civil</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-foreground mb-1.5">
                                Year of Study <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select Year</option>
                                <option value="First Year">First Year</option>
                                <option value="Second Year">Second Year</option>
                                <option value="Third Year">Third Year</option>
                                <option value="Final Year">Final Year</option>
                            </select>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-foreground mb-1.5">
                                Dietary Restrictions (Optional)
                            </label>
                            <input
                                type="text"
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                value={formData.dietaryRestrictions}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., Vegetarian, Vegan, Allergies"
                            />
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label htmlFor="additionalNotes" className="block text-sm font-medium text-foreground mb-1.5">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                id="additionalNotes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                placeholder="Any questions or special requirements?"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1">
                                Submit Registration
                            </Button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
