"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
    role: "user" | "bot"
    text: string
}

const SUGGESTIONS = [
    "How do I chat with an alumni?",
    "How do I apply for a job?",
    "How do I register for an event?",
    "How do I get my resume reviewed?",
]

export function Chatbot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "👋 Hi! I'm **Slumini Assistant**. I'm here to help you navigate the portal. What would you like to know?",
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, open])

    const sendMessage = async (text: string) => {
        const userMessage = text.trim()
        if (!userMessage || loading) return

        setInput("")
        setMessages((prev) => [...prev, { role: "user", text: userMessage }])
        setLoading(true)

        try {
            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                }),
            })
            const data = await res.json()
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data.reply || "Sorry, I encountered an error. Please try again." },
            ])
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again." },
            ])
        } finally {
            setLoading(false)
        }
    }

    // Render simple markdown-like bold
    const renderText = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/)
        return parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
                <span key={i}>{part}</span>
            )
        )
    }

    return (
        <>
            {/* Floating bubble */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 focus:outline-none"
                style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    boxShadow: "0 0 24px rgba(124, 58, 237, 0.5)",
                }}
                aria-label="Open chatbot"
            >
                {open ? "✕" : "🤖"}
            </button>

            {/* Chat panel */}
            {open && (
                <div
                    className="fixed bottom-24 left-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        width: "360px",
                        height: "520px",
                        background: "var(--background)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0 8px 40px rgba(79, 70, 229, 0.25)",
                        animation: "slideUp 0.25s ease-out",
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 shrink-0"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    >
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
                        <div>
                            <p className="font-semibold text-white text-sm">Slumini Assistant</p>
                            <p className="text-white/70 text-xs">Always here to help</p>
                        </div>
                        <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--muted, #0a0a0a)" }}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                {msg.role === "bot" && (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mr-2 mt-1"
                                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                                        🤖
                                    </div>
                                )}
                                <div
                                    className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                                    style={
                                        msg.role === "user"
                                            ? {
                                                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                                color: "white",
                                                borderBottomRightRadius: "4px",
                                            }
                                            : {
                                                background: "var(--card, #1c1c1e)",
                                                color: "var(--foreground)",
                                                border: "1px solid var(--border, #2a2a2a)",
                                                borderBottomLeftRadius: "4px",
                                            }
                                    }
                                >
                                    {renderText(msg.text)}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mr-2 mt-1"
                                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                                    🤖
                                </div>
                                <div
                                    className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
                                    style={{ background: "var(--card, #1c1c1e)", border: "1px solid var(--border, #2a2a2a)" }}
                                >
                                    <span className="flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions (shown only at start) */}
                    {messages.length === 1 && (
                        <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0" style={{ background: "var(--muted, #0a0a0a)" }}>
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-primary hover:text-white hover:border-primary"
                                    style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                                placeholder="Ask me anything..."
                                disabled={loading}
                                className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                style={{
                                    background: "var(--muted, #1c1c1e)",
                                    border: "1px solid var(--border)",
                                    color: "var(--foreground)",
                                }}
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-50 shrink-0"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                            >
                                ➤
                            </button>
                        </div>
                        <p className="text-center text-[10px] mt-1.5" style={{ color: "var(--muted-foreground)" }}>
                            Powered by Gemini AI
                        </p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    )
}
