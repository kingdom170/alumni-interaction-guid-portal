"use client"

import { useState, useRef, useEffect } from "react"
import type { MessageData, ConversationData } from "@/lib/firestore/chat-service"
import { sendMessage, subscribeToConversation, generateConversationId } from "@/lib/firestore/chat-service"
import { Button } from "@/components/ui/button"
import { Timestamp } from "firebase/firestore"

interface ChatWindowProps {
    myId: string
    myName: string
    myRole: "student" | "alumni"
    targetId: string
    targetName: string
    onClose: () => void
}

export function ChatWindow({ myId, myName, myRole, targetId, targetName, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<MessageData[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Determine conversation ID based on roles
    // If I am alumni, studentId is targetId
    // If I am student, studentId is myId
    const conversationId = myRole === "student"
        ? generateConversationId(myId, targetId)
        : generateConversationId(targetId, myId)

    useEffect(() => {
        const unsubscribe = subscribeToConversation(conversationId, (newMessages) => {
            setMessages(newMessages)
        })
        return () => unsubscribe()
    }, [conversationId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return

        try {
            // For creating the conversation, we need to know who is who
            const recipientId = targetId
            const recipientName = targetName

            await sendMessage(
                conversationId,
                myId,
                myName,
                myRole,
                inputMessage,
                recipientId,
                recipientName
            )
            setInputMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            alert("Failed to send message")
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 md:w-96 h-[500px] bg-background border border-border rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 border-b border-border bg-primary/10 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-foreground">{targetName}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{myRole === "alumni" ? "Student" : "Alumni"}</p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-10">
                        <p>No messages yet.</p>
                        <p>Start chatting with {targetName}!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === myId
                        // Handle timestamp whether it's a Firestore Timestamp or Date
                        let timeString = ""
                        if (msg.timestamp) {
                            const date = msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date(msg.timestamp)
                            timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        }

                        return (
                            <div key={msg.messageId} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-card border border-border text-foreground rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.message}</p>
                                    <p className={`text-[10px] mt-1 text-right opacity-70`}>
                                        {timeString}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-card">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 rounded-full shrink-0">
                        ➤
                    </Button>
                </div>
            </div>
        </div>
    )
}
