import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const SYSTEM_PROMPT = `You are "Slumini Assistant", a helpful and friendly chatbot on the Slumini Alumni Interaction & Guidance Portal. Your role is to help STUDENTS understand how to use the website in their daily activities.

Here is everything students can do on the platform:

1. **Student Dashboard**: After logging in as a student, you land on the Dashboard. Here you can see:
   - Your recent activity, mentorship requests, and quick access to key features.

2. **Chat with Alumni**: 
   - Go to the "Alumni" page from the navigation bar.
   - Browse the alumni directory and find an alumni you want to connect with.
   - Click "Chat" on their card to open a live chat window.
   - You can send messages, ask for career advice, mentorship, and more.

3. **Apply for Jobs**:
   - Go to the "Jobs" section.
   - Browse job postings created by alumni.
   - Click "Apply" on a job you're interested in and submit your resume and details.

4. **Register for Events**:
   - Go to the "Events" page.
   - Browse upcoming networking events and webinars posted by alumni and admins.
   - Click "Register" to sign up for any event.

5. **Resume Review**:
   - You can upload your resume through the dashboard.
   - Alumni can then review your resume and provide feedback on it.
   - Check "Resume Reviews" to see feedback given by alumni.

6. **Courses**:
   - Go to the "Courses" section to browse available courses.
   - Click "Enroll" or "Take Course" to start learning.

7. **Profile**:
   - Click on your profile or go to profile settings to update your name, course, batch, and other details.

8. **Login / Signup**:
   - Visit the homepage and click "Login".
   - Choose "Student" as your role.
   - You can sign in with an existing account or create a new one by clicking "Sign Up".
   - Your email must follow the student domain format.

General tips:
- The site has a dark mode by default. You can toggle the theme from the top-right corner.
- Messages with alumni are real-time — you'll see responses instantly.
- If you get stuck anywhere, just ask me and I'll guide you step by step!

Keep your answers short, friendly, and helpful. Use bullet points when listing steps. If a question is not related to using this website, politely redirect the conversation back to helping with the portal.`

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json(
            { error: "Gemini API key not configured. Please add GEMINI_API_KEY to .env.local" },
            { status: 500 }
        )
    }

    try {
        const { message, history } = await req.json()

        // Filter out the initial greeting (first bot message) and build valid alternating history
        const filteredHistory = (history || []).filter(
            (msg: { role: string; text: string }, i: number) => !(i === 0 && msg.role === "bot")
        )

        const contents = [
            ...filteredHistory.map((msg: { role: string; text: string }) => ({
                role: msg.role === "bot" ? "model" : "user",
                parts: [{ text: msg.text }],
            })),
            {
                role: "user",
                parts: [{ text: message }],
            },
        ]

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT }],
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    },
                }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error("Gemini API error:", JSON.stringify(data, null, 2))
            return NextResponse.json(
                { error: data?.error?.message || "Failed to get response from Gemini" },
                { status: 500 }
            )
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response."

        return NextResponse.json({ reply })
    } catch (error) {
        console.error("Chatbot error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
