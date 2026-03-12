import { Timestamp } from "firebase/firestore";

// ============================================
// USER PROFILES
// ============================================

export interface User {
    userId: string; // Firebase Auth UID
    role: "student" | "alumni" | "teacher";
    name: string;
    email: string;
    department: string;
    verified: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Alumni {
    userId: string; // Same as User UID
    company: string;
    position: string;
    batch: number; // Graduation year
    expertise: string[]; // Array of skills/domains
    linkedinUrl?: string;
    available: boolean; // Available for mentoring
    bio?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Student {
    userId: string; // Same as User UID
    year: number; // Current year (1-4)
    semester: number; // Current semester
    skills: string[]; // Array of skills
    resumeURL?: string; // Firebase Storage URL
    careerInterests: string[]; // Interested domains
    gpa?: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Teacher {
    userId: string; // Same as User UID
    employeeId: string;
    designation: string;
    subjects: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ============================================
// EVENTS
// ============================================

export interface Event {
    eventId: string; // Auto-generated
    title: string;
    description: string;
    date: Timestamp;
    time: string; // "14:00" format
    mode: "online" | "offline";
    meetLink?: string; // For online events
    venue?: string; // For offline events
    posterURL?: string; // Firebase Storage URL
    createdBy: string; // User ID of creator
    createdByName: string; // Denormalized for display
    createdByRole: "alumni" | "teacher";
    maxAttendees?: number;
    attendeeCount: number;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    tags: string[]; // ["workshop", "career", "technical"]
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface EventRegistration {
    userId: string; // Student ID
    userName: string; // Denormalized
    registeredAt: Timestamp;
    attended?: boolean;
}

// ============================================
// CHATS
// ============================================

export interface Chat {
    chatId: string; // Format: "{userId1}_{userId2}" (alphabetically sorted)
    participants: string[]; // [userId1, userId2]
    participantNames: { [userId: string]: string }; // Denormalized names
    participantRoles: { [userId: string]: string }; // Denormalized roles
    lastMessage: string;
    lastMessageTime: Timestamp;
    unreadCount: { [userId: string]: number }; // Unread messages per user
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Message {
    messageId: string; // Auto-generated
    senderId: string;
    senderName: string; // Denormalized
    message: string;
    timestamp: Timestamp;
    seen: boolean;
    type: "text" | "file"; // For future file sharing
    fileURL?: string;
}

// ============================================
// JOBS
// ============================================

export interface Job {
    jobId: string; // Auto-generated
    title: string;
    company: string;
    type: "internship" | "full-time" | "part-time";
    description: string;
    requirements: string[]; // Array of requirements
    location: string;
    salary?: string;
    applyLink: string;
    postedBy: string; // Alumni user ID
    postedByName: string; // Denormalized
    postedByCompany: string; // Denormalized from alumni profile
    status: "active" | "closed";
    applicantCount?: number;
    tags: string[]; // ["frontend", "react", "remote"]
    createdAt: Timestamp;
    updatedAt: Timestamp;
    expiresAt?: Timestamp;
}

// ============================================
// RESUME REQUESTS
// ============================================

export interface ResumeRequest {
    requestId: string; // Auto-generated
    studentId: string;
    studentName: string; // Denormalized
    alumniId: string;
    alumniName: string; // Denormalized
    resumeURL: string; // Firebase Storage URL
    status: "pending" | "reviewed" | "rejected";
    feedback?: string;
    rating?: number; // 1-5 rating from alumni
    requestMessage?: string; // Student's message to alumni
    createdAt: Timestamp;
    reviewedAt?: Timestamp;
    updatedAt: Timestamp;
}

// ============================================
// COLLECTION NAMES (Constants)
// ============================================

export const COLLECTIONS = {
    USERS: "users",
    ALUMNI: "alumni",
    STUDENTS: "students",
    TEACHERS: "teachers",
    EVENTS: "events",
    EVENT_REGISTRATIONS: "registrations", // Subcollection of events
    CHATS: "chats",
    MESSAGES: "messages", // Subcollection of chats
    JOBS: "jobs",
    RESUME_REQUESTS: "resumeRequests",
} as const;

// ============================================
// STORAGE PATHS (Constants)
// ============================================

export const STORAGE_PATHS = {
    RESUMES: (userId: string) => `resumes/${userId}`,
    EVENT_POSTERS: (eventId: string) => `events/${eventId}`,
    PROFILE_PICTURES: (userId: string) => `profiles/${userId}`,
    CHAT_FILES: (chatId: string) => `chats/${chatId}`,
} as const;
