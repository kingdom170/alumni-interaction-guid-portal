"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getEventRegistrations, type RegistrationData } from "@/lib/firestore/event-service"

interface EventRegistrationsModalProps {
    isOpen: boolean
    eventId: string
    eventTitle: string
    onClose: () => void
}

export function EventRegistrationsModal({ isOpen, eventId, eventTitle, onClose }: EventRegistrationsModalProps) {
    const [registrations, setRegistrations] = useState<RegistrationData[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && eventId) {
            loadRegistrations()
        }
    }, [isOpen, eventId])

    const loadRegistrations = async () => {
        setLoading(true)
        try {
            const data = await getEventRegistrations(eventId)
            setRegistrations(data)
        } catch (error) {
            console.error("Error loading registrations:", error)
            alert("Failed to load registrations")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Event Registrations</h2>
                            <p className="text-sm text-muted-foreground mt-1">{eventTitle}</p>
                            <p className="text-sm text-blue-600 mt-1 font-medium">
                                Total Registrations: {registrations.length}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading registrations...</p>
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                            <p className="text-muted-foreground">No registrations yet for this event</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {registrations.map((registration, index) => (
                                <div
                                    key={index}
                                    className="bg-muted/30 border border-border rounded-lg p-4 hover:border-blue-500 transition-colors"
                                >
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-3 text-lg">
                                                {registration.userName}
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Email: </span>
                                                    <span className="text-foreground font-medium">{registration.userEmail}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Phone: </span>
                                                    <span className="text-foreground font-medium">{registration.userPhone}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Department: </span>
                                                    <span className="text-foreground font-medium">{registration.department}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Year: </span>
                                                    <span className="text-foreground font-medium">{registration.year}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            {registration.dietaryRestrictions && (
                                                <div>
                                                    <span className="text-muted-foreground">Dietary Restrictions: </span>
                                                    <span className="text-foreground">{registration.dietaryRestrictions}</span>
                                                </div>
                                            )}
                                            {registration.additionalNotes && (
                                                <div>
                                                    <span className="text-muted-foreground">Additional Notes: </span>
                                                    <span className="text-foreground">{registration.additionalNotes}</span>
                                                </div>
                                            )}
                                            {registration.registeredAt && (
                                                <div>
                                                    <span className="text-muted-foreground">Registered: </span>
                                                    <span className="text-foreground">
                                                        {new Date(registration.registeredAt.seconds * 1000).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <Button onClick={onClose} className="flex-1">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
