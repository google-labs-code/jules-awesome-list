"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

interface Message {
    role: "user" | "ai";
    content: string;
}

interface AIMathTutorProps {
    context: string;
}

export default function AIMathTutor({ context }: AIMathTutorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your AI Math Tutor. Ask me anything about this lesson!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };
        scrollToBottom();
    }, [messages, isOpen]);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai-tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, context }),
            });

            const data = await res.json();

            if (data.response) {
                setMessages(prev => [...prev, { role: "ai", content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: "ai", content: "⚠️ System Malfunction: " + (data.error || "Unknown error") }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: "ai", content: "⚠️ Network Error: Could not reach AI core." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[100] bg-accent-purple text-white p-4 rounded-full shadow-[0_0_20px_rgba(126,80,163,0.6)] hover:scale-110 transition-transform animate-pulse"
            >
                <span className="text-2xl">🤖</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 z-[100] w-full max-w-sm h-96 bg-black/90 backdrop-blur-md border border-accent-purple rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-accent-purple/20 p-3 border-b border-accent-purple/50 flex justify-between items-center">
                <h3 className="font-bold text-accent-purple flex items-center gap-2">
                    <span className="animate-spin text-xs">⚙️</span> AI TUTOR v1.0
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === "user"
                            ? "bg-accent-purple text-white rounded-br-none"
                            : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                            }`}>
                            {msg.role === "ai" ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-lg rounded-bl-none border border-gray-700 text-gray-400 text-xs flex items-center gap-1">
                            <span>Thinking</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-800 bg-black/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-purple transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-accent-purple text-white px-3 py-2 rounded text-sm font-bold hover:bg-accent-purple/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        SEND
                    </button>
                </div>
            </div>
        </div>
    );
}
