import { db } from "@/lib/firebase"
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore"

export interface CourseData {
    courseId?: string
    title: string
    description: string
    duration: string
    level: "Beginner" | "Intermediate" | "Advanced"
    category: string
    startDate: string
    link: string
    instructor: string
    instructorId: string
    enrolledCount?: number
    rating?: number
    createdAt?: any
    updatedAt?: any
}

/**
 * Create a new course in Firestore
 */
export async function createCourse(courseData: CourseData): Promise<string> {
    try {
        const coursesRef = collection(db, "courses")
        const docRef = await addDoc(coursesRef, {
            ...courseData,
            enrolledCount: 0,
            rating: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return docRef.id
    } catch (error) {
        console.error("Error creating course:", error)
        throw new Error("Failed to create course")
    }
}

/**
 * Get all courses created by a specific instructor
 */
export async function getCoursesByInstructor(instructorId: string): Promise<CourseData[]> {
    try {
        const coursesRef = collection(db, "courses")
        // Use only where() without orderBy to avoid needing a composite Firestore index
        const q = query(coursesRef, where("instructorId", "==", instructorId))
        const snapshot = await getDocs(q)
        const courses = snapshot.docs.map((doc) => ({
            courseId: doc.id,
            ...doc.data(),
        })) as CourseData[]
        // Sort client-side
        return courses.sort((a, b) => ((b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
    } catch (error) {
        console.error("Error fetching courses by instructor:", error)
        return []
    }
}

/**
 * Get all courses (for students/alumni)
 */
export async function getAllCourses(): Promise<CourseData[]> {
    try {
        const coursesRef = collection(db, "courses")
        // No orderBy — avoids needing a Firestore index; sort client-side instead
        const snapshot = await getDocs(coursesRef)
        const courses = snapshot.docs.map((doc) => ({
            courseId: doc.id,
            ...doc.data(),
        })) as CourseData[]
        return courses.sort((a, b) => ((b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)))
    } catch (error) {
        console.error("Error fetching courses:", error)
        return []
    }
}

/**
 * Get course by ID
 */
export async function getCourseById(courseId: string): Promise<CourseData | null> {
    try {
        const courseRef = doc(db, "courses", courseId)
        const courseDoc = await getDoc(courseRef)

        if (courseDoc.exists()) {
            return {
                courseId: courseDoc.id,
                ...courseDoc.data(),
            } as CourseData
        }
        return null
    } catch (error) {
        console.error("Error fetching course:", error)
        return null
    }
}

/**
 * Update a course
 */
export async function updateCourse(courseId: string, courseData: Partial<CourseData>): Promise<boolean> {
    try {
        const courseRef = doc(db, "courses", courseId)
        await updateDoc(courseRef, {
            ...courseData,
            updatedAt: serverTimestamp(),
        })
        return true
    } catch (error) {
        console.error("Error updating course:", error)
        throw new Error("Failed to update course")
    }
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId: string): Promise<boolean> {
    try {
        const courseRef = doc(db, "courses", courseId)
        await deleteDoc(courseRef)
        return true
    } catch (error) {
        console.error("Error deleting course:", error)
        throw new Error("Failed to delete course")
    }
}
