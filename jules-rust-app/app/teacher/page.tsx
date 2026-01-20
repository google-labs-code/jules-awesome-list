"use client";

import React, { useState } from "react";
import AlienAvatar from "@/components/AlienAvatar";

interface Student {
    id: string;
    name: string;
    score?: number;
}

export default function TeacherPage() {
    const [classCode, setClassCode] = useState<string | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [newStudentName, setNewStudentName] = useState("");
    const [summary, setSummary] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<Record<string, number> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateClassCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "RUST-";
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setClassCode(code);
        // In a real app, this would create a session in the backend
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;

        const newStudent: Student = {
            id: Date.now().toString(),
            name: newStudentName.trim(),
            score: 0,
        };

        setStudents([...students, newStudent]);
        setNewStudentName("");
    };

    const updateScore = (id: string, delta: number) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, score: Math.max(0, (s.score || 0) + delta) } : s
        ));
    };

    const generateSummary = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/summarize-class", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ students }),
            });
            const data = await res.json();
            if (data.summary) setSummary(data.summary);
            if (data.graphData) setGraphData(data.graphData);
        } catch (error) {
            console.error("Failed to fetch summary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 p-8 flex flex-col items-center">
            <div className="max-w-6xl w-full space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-orange text-shadow-glow">
                        TEACHER_DASHBOARD
                    </h1>
                    <p className="text-xl text-gray-400">
                        Initialize classroom environment and manages student entities.
                    </p>
                </div>

                {/* Control Panel */}
                <div className="glass-panel p-8 border border-accent-cyan/30 bg-black/40 backdrop-blur-md rounded-xl">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">

                        {/* Class Code Generator */}
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h2 className="text-2xl font-bold text-accent-cyan">
                                <span className="mr-2">🔑</span> Class Access Code
                            </h2>
                            {classCode ? (
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <div className="text-5xl font-mono font-black text-white tracking-widest bg-accent-purple/20 px-6 py-4 rounded border border-accent-purple/50 animate-pulse">
                                        {classCode}
                                    </div>
                                    <p className="text-sm text-gray-400">Share this code with your students.</p>
                                </div>
                            ) : (
                                <button
                                    onClick={generateClassCode}
                                    className="px-8 py-4 bg-accent-purple hover:bg-accent-orange text-white font-bold text-lg rounded transition-all shadow-[0_0_20px_rgba(126,80,163,0.5)] hover:shadow-[0_0_30px_rgba(255,159,28,0.6)]"
                                >
                                    GENERATE_CODE()
                                </button>
                            )}
                        </div>

                        {/* Student Registration (Simulation) */}
                        {classCode && (
                            <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
                                <h3 className="text-xl font-bold text-accent-green mb-4">
                                    <span className="mr-2">➕</span> Simulate Student Join
                                </h3>
                                <form onSubmit={handleAddStudent} className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                        placeholder="Enter Name..."
                                        className="flex-1 bg-black/50 border border-accent-cyan/50 rounded px-4 py-2 text-white focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,245,255,0.3)] font-mono"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black font-bold transition-all rounded"
                                    >
                                        ADD
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>

                {/* AI Summary Section */}
                {students.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-white">
                                <span className="text-accent-yellow">AI</span> Analytics
                            </h2>
                            <button
                                onClick={generateSummary}
                                disabled={isLoading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {isLoading ? "ANALYZING..." : "GENERATE REPORT"}
                                <span className="text-xl">✨</span>
                            </button>
                        </div>

                        {(summary || graphData) && (
                            <div className="glass-panel p-6 border border-white/10 rounded-xl space-y-6">
                                {summary && (
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-xl font-bold text-accent-cyan mb-2">Class Performance Summary</h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">{summary}</p>
                                    </div>
                                )}

                                {graphData && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-accent-orange mb-4">Grade Distribution Vector</h3>
                                        <div className="flex items-end gap-4 h-40 border-b border-white/20 pb-2">
                                            {Object.entries(graphData).map(([grade, count]) => (
                                                <div key={grade} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div
                                                        className="w-full bg-accent-purple/50 rounded-t hover:bg-accent-purple transition-all relative overflow-hidden"
                                                        style={{ height: `${Math.max(5, (count / Math.max(...Object.values(graphData))) * 100)}%` }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    </div>
                                                    <span className="font-mono font-bold text-accent-cyan">{grade}</span>
                                                    <span className="text-xs text-gray-400">{count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Student Grid */}
                {students.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-center text-white">
                            <span className="text-accent-yellow">{students.length}</span> Lifeforms Detected
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {students.map((student) => (
                                <div key={student.id} className="group relative flex flex-col p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all hover:border-accent-orange/50">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-accent-purple/20 blur-xl rounded-full group-hover:bg-accent-orange/30 transition-all"></div>
                                            <AlienAvatar name={student.name} size={60} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="font-bold text-lg text-white group-hover:text-accent-cyan transition-colors truncate">
                                                {student.name}
                                            </h3>
                                            <div className="text-xs text-gray-500 font-mono">
                                                ID: {student.id.slice(-4)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="text-sm text-gray-400 font-mono">
                                            SCORE: <span className="text-accent-yellow text-xl font-bold ml-1">{student.score || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateScore(student.id, -10)}
                                                className="w-8 h-8 flex items-center justify-center rounded bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/50"
                                            >
                                                -
                                            </button>
                                            <button
                                                onClick={() => updateScore(student.id, 10)}
                                                className="w-8 h-8 flex items-center justify-center rounded bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white transition-all border border-green-500/50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
