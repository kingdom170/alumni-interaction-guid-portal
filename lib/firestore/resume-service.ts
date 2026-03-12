import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface ResumeData {
    resumeId?: string
    userId: string
    userEmail: string
    fullName: string
    email: string
    phone: string
    summary: string
    experience: string
    education: string
    skills: string
    certifications?: string
    sharedWith: string[] // Alumni UIDs who can review
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface ResumeReviewData {
    reviewId?: string
    reviewerId: string
    reviewerName: string
    reviewerEmail: string
    rating: number
    feedback: string
    createdAt: Timestamp | Date
}

/**
 * Create a new resume
 */
export async function createResume(
    resumeData: Omit<ResumeData, "resumeId" | "createdAt" | "updatedAt" | "sharedWith">
): Promise<string> {
    try {
        const resumesRef = collection(db, "resumes")
        const resumeDoc = await addDoc(resumesRef, {
            ...resumeData,
            sharedWith: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return resumeDoc.id
    } catch (error) {
        console.error("Error creating resume:", error)
        throw new Error("Failed to create resume")
    }
}

/**
 * Update an existing resume
 */
export async function updateResume(
    resumeId: string,
    resumeData: Partial<Omit<ResumeData, "resumeId" | "userId" | "createdAt" | "updatedAt">>
): Promise<void> {
    try {
        const resumeRef = doc(db, "resumes", resumeId)
        await updateDoc(resumeRef, {
            ...resumeData,
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error("Error updating resume:", error)
        throw new Error("Failed to update resume")
    }
}

/**
 * Delete a resume
 */
export async function deleteResume(resumeId: string): Promise<void> {
    try {
        const resumeRef = doc(db, "resumes", resumeId)
        await deleteDoc(resumeRef)
    } catch (error) {
        console.error("Error deleting resume:", error)
        throw new Error("Failed to delete resume")
    }
}

/**
 * Get all resumes for a user
 */
export async function getUserResumes(userId: string): Promise<ResumeData[]> {
    try {
        const resumesRef = collection(db, "resumes")
        const q = query(resumesRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            resumeId: doc.id,
            ...doc.data(),
        })) as ResumeData[]
    } catch (error) {
        console.error("Error getting user resumes:", error)
        return []
    }
}

/**
 * Get all resumes (for alumni to review)
 */
export async function getAllResumes(): Promise<ResumeData[]> {
    try {
        const resumesRef = collection(db, "resumes")
        const q = query(resumesRef, orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            resumeId: doc.id,
            ...doc.data(),
        })) as ResumeData[]
    } catch (error) {
        console.error("Error getting all resumes:", error)
        return []
    }
}

/**
 * Add a review to a resume
 */
export async function addResumeReview(
    resumeId: string,
    reviewData: Omit<ResumeReviewData, "reviewId" | "createdAt">
): Promise<string> {
    try {
        const reviewsRef = collection(db, "resumes", resumeId, "reviews")
        const reviewDoc = await addDoc(reviewsRef, {
            ...reviewData,
            createdAt: serverTimestamp(),
        })
        return reviewDoc.id
    } catch (error) {
        console.error("Error adding resume review:", error)
        throw new Error("Failed to add review")
    }
}

/**
 * Get all reviews for a resume
 */
export async function getResumeReviews(resumeId: string): Promise<ResumeReviewData[]> {
    try {
        const reviewsRef = collection(db, "resumes", resumeId, "reviews")
        const q = query(reviewsRef, orderBy("createdAt", "desc"))
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            reviewId: doc.id,
            ...doc.data(),
        })) as ResumeReviewData[]
    } catch (error) {
        console.error("Error getting resume reviews:", error)
        return []
    }
}
