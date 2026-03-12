"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { alumniData } from "@/lib/data"
import { useParams } from "next/navigation"
import { sendMessage, subscribeToConversation, generateConversationId, type MessageData } from "@/lib/firestore/chat-service"

export default function ChatPage() {
  const params = useParams()
  const alumniId = Number.parseInt(params.alumniId as string)
  const alumni = alumniData.find((a) => a.id === alumniId)

  const [messages, setMessages] = useState<MessageData[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [userType, setUserType] = useState<"user" | "teacher" | "alumni">("user")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState<"student" | "alumni">("student")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Detect user type and load user info from localStorage
  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const email = localStorage.getItem("userEmail") || ""
    const name = localStorage.getItem("userName") || "User"

    setUserId(email)
    setUserName(name)

    if (role === "teacher") {
      setUserType("teacher")
      setUserRole("student") // Teachers chat as if they were students
    } else if (role === "alumni") {
      setUserType("alumni")
      setUserRole("alumni")
    } else {
      setUserType("user")
      setUserRole("student")
    }
  }, [])

  // Subscribe to real-time messages
  useEffect(() => {
    if (!userId || !alumni) return

    // Use alumni email if available, otherwise fallback to ID
    const alumniId = alumni.email || alumni.id.toString()
    const conversationId = generateConversationId(userId, alumniId)
    const unsubscribe = subscribeToConversation(conversationId, (newMessages) => {
      setMessages(newMessages)
    })

    return () => unsubscribe()
  }, [userId, alumni])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() && userId && alumni) {
      try {
        const alumniId = alumni.email || alumni.id.toString()
        const conversationId = generateConversationId(userId, alumniId)

        await sendMessage(
          conversationId,
          userId,
          userName,
          userRole,
          inputMessage,
          alumniId,
          alumni.name
        )

        setInputMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
        alert("Failed to send message. Please try again.")
      }
    }
  }

  if (!alumni) {
    return <div>Alumni not found</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar userType={userType} />

      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{alumni.image}</div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{alumni.name}</h1>
              <p className="text-sm text-muted-foreground">
                {alumni.profession} at {alumni.company}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === userId
            const timestamp = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date()

            return (
              <div key={msg.messageId} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                    }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask a career-related question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={handleSendMessage} className="px-6">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
