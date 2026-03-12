import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";
import {
    COLLECTIONS,
    STORAGE_PATHS,
    User,
    Alumni,
    Student,
    Event,
    EventRegistration,
    Chat,
    Message,
    Job,
    ResumeRequest
} from "./schema";

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

/**
 * Create a new user profile during registration
 */
export async function createUserProfile(
    userId: string,
    role: "student" | "alumni" | "teacher",
    userData: Partial<User>
): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    const userDoc: User = {
        userId,
        role,
        name: userData.name || "",
        email: userData.email || "",
        department: userData.department || "",
        verified: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    await setDoc(userRef, userDoc);
}

/**
 * Create alumni-specific profile
 */
export async function createAlumniProfile(
    userId: string,
    alumniData: Partial<Alumni>
): Promise<void> {
    const alumniRef = doc(db, COLLECTIONS.ALUMNI, userId);

    const alumniDoc: Alumni = {
        userId,
        company: alumniData.company || "",
        position: alumniData.position || "",
        batch: alumniData.batch || new Date().getFullYear(),
        expertise: alumniData.expertise || [],
        linkedinUrl: alumniData.linkedinUrl,
        available: alumniData.available ?? true,
        bio: alumniData.bio,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    await setDoc(alumniRef, alumniDoc);
}

/**
 * Create student-specific profile
 */
export async function createStudentProfile(
    userId: string,
    studentData: Partial<Student>
): Promise<void> {
    const studentRef = doc(db, COLLECTIONS.STUDENTS, userId);

    const studentDoc: Student = {
        userId,
        year: studentData.year || 1,
        semester: studentData.semester || 1,
        skills: studentData.skills || [],
        resumeURL: studentData.resumeURL,
        careerInterests: studentData.careerInterests || [],
        gpa: studentData.gpa,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    await setDoc(studentRef, studentDoc);
}

/**
 * Update user profile
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<User>
): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Get user profile with role-specific data
 */
export async function getUserProfile(userId: string): Promise<User | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        return null;
    }

    return userSnap.data() as User;
}

// ============================================
// EVENT FUNCTIONS
// ============================================

/**
 * Create a new event
 */
export async function createEvent(
    creatorId: string,
    creatorName: string,
    creatorRole: "alumni" | "teacher",
    eventData: Partial<Event>
): Promise<string> {
    const eventsRef = collection(db, COLLECTIONS.EVENTS);

    const eventDoc = {
        title: eventData.title || "",
        description: eventData.description || "",
        date: eventData.date || Timestamp.now(),
        time: eventData.time || "",
        mode: eventData.mode || "online",
        meetLink: eventData.meetLink,
        venue: eventData.venue,
        posterURL: eventData.posterURL,
        createdBy: creatorId,
        createdByName: creatorName,
        createdByRole: creatorRole,
        maxAttendees: eventData.maxAttendees,
        attendeeCount: 0,
        status: "upcoming",
        tags: eventData.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(eventsRef, eventDoc);
    return docRef.id;
}

/**
 * Register a student for an event
 */
export async function registerForEvent(
    eventId: string,
    userId: string,
    userName: string
): Promise<void> {
    const registrationRef = doc(
        db,
        COLLECTIONS.EVENTS,
        eventId,
        COLLECTIONS.EVENT_REGISTRATIONS,
        userId
    );

    const registration: EventRegistration = {
        userId,
        userName,
        registeredAt: Timestamp.now(),
    };

    await setDoc(registrationRef, registration);

    // Increment attendee count
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId);
    await updateDoc(eventRef, {
        attendeeCount: increment(1),
    });
}

/**
 * Unregister from an event
 */
export async function unregisterFromEvent(
    eventId: string,
    userId: string
): Promise<void> {
    const registrationRef = doc(
        db,
        COLLECTIONS.EVENTS,
        eventId,
        COLLECTIONS.EVENT_REGISTRATIONS,
        userId
    );

    await deleteDoc(registrationRef);

    // Decrement attendee count
    const eventRef = doc(db, COLLECTIONS.EVENTS, eventId);
    await updateDoc(eventRef, {
        attendeeCount: increment(-1),
    });
}

// ============================================
// CHAT FUNCTIONS
// ============================================

/**
 * Create chat room ID from two user IDs (deterministic)
 */
export function createChatId(userId1: string, userId2: string): string {
    const sorted = [userId1, userId2].sort();
    return `${sorted[0]}_${sorted[1]}`;
}

/**
 * Create or get existing chat room
 */
export async function createChatRoom(
    user1Id: string,
    user1Name: string,
    user1Role: string,
    user2Id: string,
    user2Name: string,
    user2Role: string
): Promise<string> {
    const chatId = createChatId(user1Id, user2Id);
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);

    // Check if chat already exists
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
        return chatId;
    }

    // Create new chat
    const chatDoc: Chat = {
        chatId,
        participants: [user1Id, user2Id],
        participantNames: {
            [user1Id]: user1Name,
            [user2Id]: user2Name,
        },
        participantRoles: {
            [user1Id]: user1Role,
            [user2Id]: user2Role,
        },
        lastMessage: "",
        lastMessageTime: Timestamp.now(),
        unreadCount: {
            [user1Id]: 0,
            [user2Id]: 0,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    };

    await setDoc(chatRef, chatDoc);
    return chatId;
}

/**
 * Send a message in a chat
 */
export async function sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    message: string,
    receiverId: string
): Promise<void> {
    const messagesRef = collection(
        db,
        COLLECTIONS.CHATS,
        chatId,
        COLLECTIONS.MESSAGES
    );

    const messageDoc: Omit<Message, "messageId"> = {
        senderId,
        senderName,
        message,
        timestamp: Timestamp.now(),
        seen: false,
        type: "text",
    };

    await addDoc(messagesRef, messageDoc);

    // Update chat metadata
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    await updateDoc(chatRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${receiverId}`]: increment(1),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
    chatId: string,
    userId: string
): Promise<void> {
    const chatRef = doc(db, COLLECTIONS.CHATS, chatId);
    await updateDoc(chatRef, {
        [`unreadCount.${userId}`]: 0,
    });
}

// ============================================
// JOB FUNCTIONS
// ============================================

/**
 * Post a new job (alumni only)
 */
export async function postJob(
    alumniId: string,
    alumniName: string,
    alumniCompany: string,
    jobData: Partial<Job>
): Promise<string> {
    const jobsRef = collection(db, COLLECTIONS.JOBS);

    const jobDoc = {
        title: jobData.title || "",
        company: jobData.company || alumniCompany,
        type: jobData.type || "full-time",
        description: jobData.description || "",
        requirements: jobData.requirements || [],
        location: jobData.location || "",
        salary: jobData.salary,
        applyLink: jobData.applyLink || "",
        postedBy: alumniId,
        postedByName: alumniName,
        postedByCompany: alumniCompany,
        status: "active",
        applicantCount: 0,
        tags: jobData.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: jobData.expiresAt,
    };

    const docRef = await addDoc(jobsRef, jobDoc);
    return docRef.id;
}

/**
 * Update job posting
 */
export async function updateJob(
    jobId: string,
    updates: Partial<Job>
): Promise<void> {
    const jobRef = doc(db, COLLECTIONS.JOBS, jobId);
    await updateDoc(jobRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

// ============================================
// RESUME REQUEST FUNCTIONS
// ============================================

/**
 * Create a resume review request
 */
export async function createResumeRequest(
    studentId: string,
    studentName: string,
    alumniId: string,
    alumniName: string,
    resumeURL: string,
    requestMessage?: string
): Promise<string> {
    const requestsRef = collection(db, COLLECTIONS.RESUME_REQUESTS);

    const requestDoc = {
        studentId,
        studentName,
        alumniId,
        alumniName,
        resumeURL,
        status: "pending",
        requestMessage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(requestsRef, requestDoc);
    return docRef.id;
}

/**
 * Update resume request (add feedback)
 */
export async function updateResumeRequest(
    requestId: string,
    feedback: string,
    rating?: number
): Promise<void> {
    const requestRef = doc(db, COLLECTIONS.RESUME_REQUESTS, requestId);
    await updateDoc(requestRef, {
        status: "reviewed",
        feedback,
        rating,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Upload resume to Firebase Storage
 */
export async function uploadResume(
    userId: string,
    file: File
): Promise<string> {
    const fileRef = ref(
        storage,
        `${STORAGE_PATHS.RESUMES(userId)}/${file.name}`
    );

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
}

/**
 * Upload event poster
 */
export async function uploadEventPoster(
    eventId: string,
    file: File
): Promise<string> {
    const fileRef = ref(
        storage,
        `${STORAGE_PATHS.EVENT_POSTERS(eventId)}/${file.name}`
    );

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
    userId: string,
    file: File
): Promise<string> {
    const fileRef = ref(
        storage,
        `${STORAGE_PATHS.PROFILE_PICTURES(userId)}/profile.jpg`
    );

    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
}

/**
 * Delete file from storage
 */
export async function deleteFile(fileURL: string): Promise<void> {
    const fileRef = ref(storage, fileURL);
    await deleteObject(fileRef);
}
