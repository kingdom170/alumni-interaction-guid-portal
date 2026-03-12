"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { alumniData, studentsData } from "@/lib/data"

interface Message {
    id: string
    sender: "student" | "alumni"
    text: string
    timestamp: number
}

interface GlobalChatProps {
    userType: "student" | "alumni"
    myId: number // ID of the current logged-in user
    targetId?: number | null // ID of the person communicating with (if known)
    onClose?: () => void // Optional callback for closing externally controlled chat
}

export function GlobalChat({ userType, myId, targetId, onClose }: GlobalChatProps) {
    // If targetId is provided, open immediately. If not (Student side), start closed/inbox.
    // For Alumni side, this component is likely rendered conditionally when targetId is present.
    const [isOpen, setIsOpen] = useState(!!targetId)
    const [activeTargetId, setActiveTargetId] = useState<number | null>(targetId || null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Sync isOpen with targetId changes if controlled externally
    useEffect(() => {
        if (targetId) {
            setActiveTargetId(targetId)
            setIsOpen(true)
        }
    }, [targetId])

    // Logic to determine the storage key
    // Key Format: portal_chat_{AlumniID}_{StudentID}
    // To ensure the same key for both parties, we need to know who is who.
    const getStorageKey = (target: number) => {
        if (userType === "student") {
            // MyId = StudentID, Target = AlumniID
            return `portal_chat_${target}_${myId}`
        } else {
            // MyId = AlumniID, Target = StudentID
            return `portal_chat_${myId}_${target}`
        }
    }

    const loadMessages = (target: number) => {
        const key = getStorageKey(target)
        const stored = localStorage.getItem(key)
        if (stored) {
            setMessages(JSON.parse(stored))
        } else {
            setMessages([])
        }
    }

    useEffect(() => {
        if (activeTargetId) {
            loadMessages(activeTargetId)
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (activeTargetId && e.key === getStorageKey(activeTargetId)) {
                loadMessages(activeTargetId)
            }
        }

        const handleLocalUpdate = () => {
            if (activeTargetId) loadMessages(activeTargetId)
        }

        window.addEventListener("storage", handleStorageChange)
        window.addEventListener("local-chat-update", handleLocalUpdate)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("local-chat-update", handleLocalUpdate)
        }
    }, [activeTargetId, userType, myId])

    useEffect(() => {
        if (isOpen && activeTargetId) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen, activeTargetId])

    const handleSend = () => {
        if (!inputText.trim() || !activeTargetId) return

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: userType,
            text: inputText,
            timestamp: Date.now(),
        }

        const updatedMessages = [...messages, newMessage]
        setMessages(updatedMessages)

        const key = getStorageKey(activeTargetId)
        localStorage.setItem(key, JSON.stringify(updatedMessages))

        window.dispatchEvent(new Event("local-chat-update"))
        setInputText("")
    }

    const handleClearChat = () => {
        if (!activeTargetId) return
        const key = getStorageKey(activeTargetId)
        // Clear only this conversation
        setMessages([])
        localStorage.removeItem(key)
        window.dispatchEvent(new Event("local-chat-update"))
    }

    const handleClose = () => {
        setIsOpen(false)
        if (onClose) onClose()
    }

    const targetName = userType === "student"
        ? alumniData.find(a => a.id === activeTargetId)?.name || "Alumni"
        : studentsData.find(s => s.id === activeTargetId)?.name || "Student"

    const targetRole = userType === "student"
        ? alumniData.find(a => a.id === activeTargetId)?.profession
        : studentsData.find(s => s.id === activeTargetId)?.course

    // Determine container positioning:
    // - If controlled externally (Alumni dashboard modal-like), act as a modal or fixed center?
    // - Or just stick to the bottom right bubble for consistency?
    // Let's keep it as the bottom right bubble for now, but if targetId passed, it pops open.

    if (!isOpen && !onClose) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center text-2xl transition-transform hover:scale-105"
                >
                    💬
                </Button>
            </div>
        )
    }

    if (!isOpen) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 text-foreground">
            <div className="bg-card border border-border rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-[500px] animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">

                {/* --- STUDENT INBOX (When no specific target in student mode) --- */}
                {userType === "student" && !activeTargetId && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-border bg-primary/10 flex justify-between items-center">
                            <h3 className="font-semibold text-foreground">Direct Messages</h3>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 bg-background/50">
                            <p className="text-xs text-muted-foreground px-2 py-2 uppercase font-semibold">Start a conversation</p>
                            {alumniData.map(alumni => (
                                <div
                                    key={alumni.id}
                                    onClick={() => setActiveTargetId(alumni.id)}
                                    className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="text-2xl">{alumni.image}</div>
                                    <div>
                                        <div className="font-medium text-sm">{alumni.name}</div>
                                        <div className="text-xs text-muted-foreground">{alumni.profession}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CHAT VIEW --- */}
                {activeTargetId && (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-primary/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {userType === "student" && (
                                    <button
                                        onClick={() => setActiveTargetId(null)}
                                        className="mr-1 text-muted-foreground hover:text-foreground"
                                        title="Back to List"
                                    >
                                        ←
                                    </button>
                                )}
                                <div>
                                    <h3 className="font-semibold text-foreground text-sm">{targetName}</h3>
                                    <p className="text-[10px] text-muted-foreground">{targetRole}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleClearChat}
                                    className="text-xs text-muted-foreground hover:text-destructive px-2"
                                    title="Clear Chat"
                                >
                                    🗑️
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                            {messages.length === 0 ? (
                                <div className="text-center text-muted-foreground text-sm py-10">
                                    <p>No messages yet.</p>
                                    <p>Start chatting with {targetName}!</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === userType ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.sender === userType
                                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                                    : "bg-muted text-muted-foreground rounded-bl-sm"
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <p className={`text-[9px] mt-1 text-right opacity-70`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-border bg-card">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <Button onClick={handleSend} size="icon" className="h-10 w-10 rounded-full shrink-0">
                                    ➤
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
