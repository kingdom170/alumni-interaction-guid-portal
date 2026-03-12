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

export interface RatingData {
    ratingId?: string
    itemId: string
    itemType: "alumni" | "event" | "course"
    itemName: string
    userId: string
    userEmail: string
    userName: string
    rating: number // 1-5
    comment: string
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

/**
 * Add or update a rating
 */
export async function addRating(
    ratingData: Omit<RatingData, "ratingId" | "createdAt" | "updatedAt">
): Promise<string> {
    try {
        const ratingsRef = collection(db, "ratings")

        // Check if user already rated this item
        const q = query(
            ratingsRef,
            where("userId", "==", ratingData.userId),
            where("itemId", "==", ratingData.itemId),
            where("itemType", "==", ratingData.itemType)
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            // Update existing rating
            const existingDoc = snapshot.docs[0]
            await updateDoc(doc(db, "ratings", existingDoc.id), {
                rating: ratingData.rating,
                comment: ratingData.comment,
                updatedAt: serverTimestamp(),
            })
            return existingDoc.id
        } else {
            // Create new rating
            const ratingDoc = await addDoc(ratingsRef, {
                ...ratingData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            return ratingDoc.id
        }
    } catch (error) {
        console.error("Error adding rating:", error)
        throw new Error("Failed to add rating")
    }
}

/**
 * Get all ratings for a specific item
 */
export async function getRatingsForItem(
    itemId: string,
    itemType: "alumni" | "event" | "course"
): Promise<RatingData[]> {
    try {
        const ratingsRef = collection(db, "ratings")
        const q = query(
            ratingsRef,
            where("itemId", "==", itemId),
            where("itemType", "==", itemType),
            orderBy("createdAt", "desc")
        )
        const snapshot = await getDocs(q)

        return snapshot.docs.map((doc) => ({
            ratingId: doc.id,
            ...doc.data(),
        })) as RatingData[]
    } catch (error) {
        console.error("Error getting ratings:", error)
        return []
    }
}

/**
 * Get a specific user's rating for an item
 */
export async function getUserRating(
    userId: string,
    itemId: string,
    itemType: "alumni" | "event" | "course"
): Promise<RatingData | null> {
    try {
        const ratingsRef = collection(db, "ratings")
        const q = query(
            ratingsRef,
            where("userId", "==", userId),
            where("itemId", "==", itemId),
            where("itemType", "==", itemType)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) return null

        const doc = snapshot.docs[0]
        return {
            ratingId: doc.id,
            ...doc.data(),
        } as RatingData
    } catch (error) {
        console.error("Error getting user rating:", error)
        return null
    }
}

/**
 * Calculate average rating for an item
 */
export async function getAverageRating(
    itemId: string,
    itemType: "alumni" | "event" | "course"
): Promise<{ average: number; count: number }> {
    try {
        const ratings = await getRatingsForItem(itemId, itemType)

        if (ratings.length === 0) {
            return { average: 0, count: 0 }
        }

        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
        const average = sum / ratings.length

        return {
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: ratings.length,
        }
    } catch (error) {
        console.error("Error calculating average rating:", error)
        return { average: 0, count: 0 }
    }
}

/**
 * Delete a rating
 */
export async function deleteRating(ratingId: string): Promise<void> {
    try {
        const ratingRef = doc(db, "ratings", ratingId)
        await deleteDoc(ratingRef)
    } catch (error) {
        console.error("Error deleting rating:", error)
        throw new Error("Failed to delete rating")
    }
}
