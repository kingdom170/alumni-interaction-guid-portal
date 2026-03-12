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
    onSnapshot,
    updateDoc,
    serverTimestamp,
    Timestamp,
    setDoc,
} from "firebase/firestore"

export interface ConversationData {
    conversationId: string
    participants: {
        studentId: string
        studentName: string
        alumniId: string
        alumniName: string
    }
    lastMessage: string
    lastMessageTime: any
    lastMessageSender: string
    unreadCount: {
        student: number
        alumni: number
    }
    createdAt: any
    updatedAt: any
}

export interface MessageData {
    messageId?: string
    senderId: string
    senderName: string
    senderRole: "student" | "alumni"
    message: string
    timestamp: any
    read: boolean
}

/**
 * Generate conversation ID from student and alumni IDs
 */
export function generateConversationId(studentId: string, alumniId: string): string {
    return `${studentId}_${alumniId}`
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: "student" | "alumni",
    message: string,
    recipientId: string,
    recipientName: string
): Promise<string> {
    try {
        // Add message to messages subcollection
        const messagesRef = collection(db, "conversations", conversationId, "messages")
        const messageDoc = await addDoc(messagesRef, {
            senderId,
            senderName,
            senderRole,
            message,
            timestamp: serverTimestamp(),
            read: false,
        })

        // Update or create conversation document
        const conversationRef = doc(db, "conversations", conversationId)
        const conversationSnap = await getDoc(conversationRef)

        const isStudentSender = senderRole === "student"
        const unreadCount = conversationSnap.exists()
            ? {
                student: isStudentSender ? 0 : (conversationSnap.data().unreadCount?.student || 0) + 1,
                alumni: isStudentSender ? (conversationSnap.data().unreadCount?.alumni || 0) + 1 : 0,
            }
            : {
                student: 0,
                alumni: isStudentSender ? 1 : 0,
            }

        if (conversationSnap.exists()) {
            // Update existing conversation
            await updateDoc(conversationRef, {
                lastMessage: message,
                lastMessageTime: serverTimestamp(),
                lastMessageSender: senderId,
                unreadCount,
                updatedAt: serverTimestamp(),
            })
        } else {
            // Create new conversation
            await setDoc(conversationRef, {
                conversationId,
                participants: {
                    studentId: isStudentSender ? senderId : recipientId,
                    studentName: isStudentSender ? senderName : recipientName,
                    alumniId: isStudentSender ? recipientId : senderId,
                    alumniName: isStudentSender ? recipientName : senderName,
                },
                lastMessage: message,
                lastMessageTime: serverTimestamp(),
                lastMessageSender: senderId,
                unreadCount,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        }

        return messageDoc.id
    } catch (error) {
        console.error("Error sending message:", error)
        throw new Error("Failed to send message")
    }
}

/**
 * Get all messages in a conversation
 */
export async function getConversationMessages(conversationId: string): Promise<MessageData[]> {
    try {
        const messagesRef = collection(db, "conversations", conversationId, "messages")
        const q = query(messagesRef, orderBy("timestamp", "asc"))

        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            messageId: doc.id,
            ...doc.data(),
        })) as MessageData[]
    } catch (error) {
        console.error("Error fetching messages:", error)
        return []
    }
}

/**
 * Subscribe to real-time updates for a conversation
 */
export function subscribeToConversation(
    conversationId: string,
    onUpdate: (messages: MessageData[]) => void
): () => void {
    const messagesRef = collection(db, "conversations", conversationId, "messages")
    const q = query(messagesRef, orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
            messageId: doc.id,
            ...doc.data(),
        })) as MessageData[]
        onUpdate(messages)
    })

    return unsubscribe
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(userId: string, userRole: "student" | "alumni"): Promise<ConversationData[]> {
    try {
        const conversationsRef = collection(db, "conversations")
        const fieldPath = userRole === "student" ? "participants.studentId" : "participants.alumniId"
        const q = query(conversationsRef, where(fieldPath, "==", userId), orderBy("updatedAt", "desc"))

        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => doc.data()) as ConversationData[]
    } catch (error) {
        console.error("Error fetching conversations:", error)
        return []
    }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string, userRole: "student" | "alumni"): Promise<void> {
    try {
        const conversationRef = doc(db, "conversations", conversationId)

        const updateField = userRole === "student" ? "unreadCount.student" : "unreadCount.alumni"
        await updateDoc(conversationRef, {
            [updateField]: 0,
        })
    } catch (error) {
        console.error("Error marking messages as read:", error)
    }
}
