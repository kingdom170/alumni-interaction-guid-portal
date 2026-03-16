import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface JobData {
    jobId?: string
    title: string
    company: string
    location: string
    type: "Full-time" | "Internship"
    eligibility: string
    salary: string
    description: string
    postedBy: string // Alumni email
    postedByName: string
    postedById: string // Alumni UID
    status: "active" | "closed"
    applicants: number
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface JobApplicationData {
    applicationId?: string
    studentId: string
    studentEmail: string
    studentName: string
    appliedAt: Timestamp | Date
    status: "pending" | "reviewed" | "accepted" | "rejected"
    resumeId?: string
    resumeUrl?: string
}

/**
 * Create a new job posting
 */
export async function createJob(jobData: Omit<JobData, "jobId" | "createdAt" | "updatedAt" | "applicants" | "status">): Promise<string> {
    try {
        const jobsRef = collection(db, "jobs")
        const jobDoc = await addDoc(jobsRef, {
            ...jobData,
            status: "active",
            applicants: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return jobDoc.id
    } catch (error) {
        console.error("Error creating job:", error)
        throw new Error("Failed to create job")
    }
}

/**
 * Get all active jobs
 */
export async function getAllJobs(): Promise<JobData[]> {
    try {
        const jobsRef = collection(db, "jobs")
        // No orderBy — avoids needing a composite index on status + createdAt; sort client-side instead
        const q = query(jobsRef, where("status", "==", "active"))
        const snapshot = await getDocs(q)

        const jobs = snapshot.docs.map((doc) => ({
            jobId: doc.id,
            ...doc.data(),
        })) as JobData[]
        return jobs.sort((a, b) => {
            const timeA = a.createdAt && 'seconds' in a.createdAt ? a.createdAt.seconds : 0
            const timeB = b.createdAt && 'seconds' in b.createdAt ? b.createdAt.seconds : 0
            return timeB - timeA
        })
    } catch (error) {
        console.error("Error getting jobs:", error)
        return []
    }
}

/**
 * Get jobs posted by a specific alumni
 */
export async function getJobsByAlumni(alumniId: string): Promise<JobData[]> {
    try {
        const jobsRef = collection(db, "jobs")
        const q = query(jobsRef, where("postedById", "==", alumniId))
        const snapshot = await getDocs(q)

        const jobs = snapshot.docs.map((doc) => ({
            jobId: doc.id,
            ...doc.data(),
        })) as JobData[]
        return jobs.sort((a, b) => {
            const timeA = a.createdAt && 'seconds' in a.createdAt ? a.createdAt.seconds : 0
            const timeB = b.createdAt && 'seconds' in b.createdAt ? b.createdAt.seconds : 0
            return timeB - timeA
        })
    } catch (error) {
        console.error("Error getting alumni jobs:", error)
        return []
    }
}

/**
 * Apply for a job
 */
export async function applyForJob(
    jobId: string,
    applicationData: Omit<JobApplicationData, "applicationId" | "appliedAt" | "status">
): Promise<string> {
    try {
        // Add application to subcollection
        const applicationsRef = collection(db, "jobs", jobId, "applications")
        const applicationDoc = await addDoc(applicationsRef, {
            ...applicationData,
            status: "pending",
            appliedAt: serverTimestamp(),
        })

        // Increment applicants count
        const jobRef = doc(db, "jobs", jobId)
        const jobSnap = await getDoc(jobRef)
        if (jobSnap.exists()) {
            const currentApplicants = jobSnap.data().applicants || 0
            await updateDoc(jobRef, {
                applicants: currentApplicants + 1,
                updatedAt: serverTimestamp(),
            })
        }

        return applicationDoc.id
    } catch (error) {
        console.error("Error applying for job:", error)
        throw new Error("Failed to apply for job")
    }
}

/**
 * Check if user has already applied for a job
 */
export async function hasUserApplied(jobId: string, studentId: string): Promise<boolean> {
    try {
        const applicationsRef = collection(db, "jobs", jobId, "applications")
        const q = query(applicationsRef, where("studentId", "==", studentId))
        const snapshot = await getDocs(q)
        return !snapshot.empty
    } catch (error) {
        console.error("Error checking application:", error)
        return false
    }
}

/**
 * Get all applications for a job
 */
export async function getJobApplications(jobId: string): Promise<JobApplicationData[]> {
    try {
        const applicationsRef = collection(db, "jobs", jobId, "applications")
        const q = query(applicationsRef, orderBy("appliedAt", "desc"))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            applicationId: doc.id,
            ...doc.data(),
        })) as JobApplicationData[]
    } catch (error) {
        console.error("Error getting applications:", error)
        return []
    }
}

/**
 * Delete a job (only by owner)
 */
export async function deleteJob(jobId: string): Promise<void> {
    try {
        const jobRef = doc(db, "jobs", jobId)
        await deleteDoc(jobRef)
    } catch (error) {
        console.error("Error deleting job:", error)
        throw new Error("Failed to delete job")
    }
}

/**
 * Update job status
 */
export async function updateJobStatus(jobId: string, status: "active" | "closed"): Promise<void> {
    try {
        const jobRef = doc(db, "jobs", jobId)
        await updateDoc(jobRef, {
            status,
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error("Error updating job status:", error)
        throw new Error("Failed to update job status")
    }
}
