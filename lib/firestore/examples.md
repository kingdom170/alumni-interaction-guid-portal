# Firestore Collection Examples

Complete example documents showing the structure of each collection in the Slumini Alumni Portal.

## Users Collection

**Path**: `/users/{userId}`

```json
{
  "userId": "abc123xyz",
  "role": "student",
  "name": "John Doe",
  "email": "john.doe@student.mes.ac.in",
  "department": "Computer Science",
  "verified": true,
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707155000, "_nanoseconds": 0 }
}
```

---

## Alumni Collection

**Path**: `/alumni/{userId}`

```json
{
  "userId": "xyz789abc",
  "company": "Google",
  "position": "Software Engineer",
  "batch": 2020,
  "expertise": ["React", "Node.js", "Cloud Architecture"],
  "linkedinUrl": "https://linkedin.com/in/janedoe",
  "available": true,
  "bio": "SDE at Google with 4 years of experience in full-stack development",
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707155000, "_nanoseconds": 0 }
}
```

---

## Students Collection

**Path**: `/students/{userId}`

```json
{
  "userId": "abc123xyz",
  "year": 3,
  "semester": 5,
  "skills": ["Python", "Machine Learning", "React"],
  "resumeURL": "https://firebasestorage.googleapis.com/.../resume.pdf",
  "careerInterests": ["Data Science", "AI", "Backend Development"],
  "gpa": 8.5,
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707155000, "_nanoseconds": 0 }
}
```

---

## Events Collection

**Path**: `/events/{eventId}`

```json
{
  "eventId": "event_123",
  "title": "Career Guidance Workshop",
  "description": "Learn about career paths in tech from industry experts",
  "date": { "_seconds": 1707855000, "_nanoseconds": 0 },
  "time": "14:00",
  "mode": "online",
  "meetLink": "https://meet.google.com/abc-defg-hij",
  "venue": null,
  "posterURL": "https://firebasestorage.googleapis.com/.../poster.jpg",
  "createdBy": "xyz789abc",
  "createdByName": "Jane Doe",
  "createdByRole": "alumni",
  "maxAttendees": 100,
  "attendeeCount": 45,
  "status": "upcoming",
  "tags": ["career", "workshop", "tech"],
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707155000, "_nanoseconds": 0 }
}
```

### Event Registrations Subcollection

**Path**: `/events/{eventId}/registrations/{userId}`

```json
{
  "userId": "abc123xyz",
  "userName": "John Doe",
  "registeredAt": { "_seconds": 1707255000, "_nanoseconds": 0 },
  "attended": false
}
```

---

## Chats Collection

**Path**: `/chats/{chatId}`

**ChatId Format**: `{userId1}_{userId2}` (alphabetically sorted)

```json
{
  "chatId": "abc123xyz_xyz789abc",
  "participants": ["abc123xyz", "xyz789abc"],
  "participantNames": {
    "abc123xyz": "John Doe",
    "xyz789abc": "Jane Doe"
  },
  "participantRoles": {
    "abc123xyz": "student",
    "xyz789abc": "alumni"
  },
  "lastMessage": "Thank you for your guidance!",
  "lastMessageTime": { "_seconds": 1707355000, "_nanoseconds": 0 },
  "unreadCount": {
    "abc123xyz": 0,
    "xyz789abc": 2
  },
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707355000, "_nanoseconds": 0 }
}
```

### Messages Subcollection

**Path**: `/chats/{chatId}/messages/{messageId}`

```json
{
  "messageId": "msg_123",
  "senderId": "abc123xyz",
  "senderName": "John Doe",
  "message": "Can you review my resume?",
  "timestamp": { "_seconds": 1707355000, "_nanoseconds": 0 },
  "seen": true,
  "type": "text",
  "fileURL": null
}
```

---

## Jobs Collection

**Path**: `/jobs/{jobId}`

```json
{
  "jobId": "job_456",
  "title": "Frontend Developer Intern",
  "company": "Google",
  "type": "internship",
  "description": "Work on cutting-edge web applications using React and TypeScript",
  "requirements": [
    "Strong knowledge of React",
    "TypeScript experience",
    "Understanding of REST APIs"
  ],
  "location": "Bangalore, India",
  "salary": "₹30,000/month",
  "applyLink": "https://careers.google.com/apply/123",
  "postedBy": "xyz789abc",
  "postedByName": "Jane Doe",
  "postedByCompany": "Google",
  "status": "active",
  "applicantCount": 15,
  "tags": ["frontend", "react", "internship"],
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "expiresAt": { "_seconds": 1709747000, "_nanoseconds": 0 }
}
```

---

## Resume Requests Collection

**Path**: `/resumeRequests/{requestId}`

```json
{
  "requestId": "req_789",
  "studentId": "abc123xyz",
  "studentName": "John Doe",
  "alumniId": "xyz789abc",
  "alumniName": "Jane Doe",
  "resumeURL": "https://firebasestorage.googleapis.com/.../john_resume.pdf",
  "status": "reviewed",
  "feedback": "Great resume! Consider adding more quantifiable achievements in your project descriptions.",
  "rating": 4,
  "requestMessage": "Please review my resume for SDE roles",
  "createdAt": { "_seconds": 1707155000, "_nanoseconds": 0 },
  "reviewedAt": { "_seconds": 1707255000, "_nanoseconds": 0 },
  "updatedAt": { "_seconds": 1707255000, "_nanoseconds": 0 }
}
```

---

## Timestamp Format

All timestamps in Firestore are stored as Firebase Timestamp objects:

```typescript
import { Timestamp } from "firebase/firestore";

// Create timestamp
const now = Timestamp.now();

// Server timestamp (recommended for consistency)
import { serverTimestamp } from "firebase/firestore";
const timestamp = serverTimestamp();

// Convert to Date
const date = timestamp.toDate();

// Convert to ISO string
const isoString = timestamp.toDate().toISOString();
```

---

## Querying Examples

### Get All Upcoming Events

```typescript
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const eventsRef = collection(db, "events");
const q = query(
  eventsRef,
  where("status", "==", "upcoming"),
  orderBy("date", "asc")
);
const snapshot = await getDocs(q);
const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Get User's Chats

```typescript
const chatsRef = collection(db, "chats");
const q = query(
  chatsRef,
  where("participants", "array-contains", userId),
  orderBy("updatedAt", "desc")
);
const snapshot = await getDocs(q);
```

### Get Active Jobs

```typescript
const jobsRef = collection(db, "jobs");
const q = query(
  jobsRef,
  where("status", "==", "active"),
  orderBy("createdAt", "desc"),
  limit(20)
);
```

### Get Chat Messages

```typescript
const messagesRef = collection(db, "chats", chatId, "messages");
const q = query(
  messagesRef,
  orderBy("timestamp", "asc"),
  limit(50)
);
```

---

## Real-time Listeners

### Listen to Chat Messages

```typescript
import { onSnapshot } from "firebase/firestore";

const messagesRef = collection(db, "chats", chatId, "messages");
const q = query(messagesRef, orderBy("timestamp", "asc"));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  console.log("New messages:", messages);
});

// Clean up listener when component unmounts
// unsubscribe();
```

### Listen to Event Updates

```typescript
const eventRef = doc(db, "events", eventId);

const unsubscribe = onSnapshot(eventRef, (doc) => {
  const eventData = doc.data();
  console.log("Event updated:", eventData);
});
```
