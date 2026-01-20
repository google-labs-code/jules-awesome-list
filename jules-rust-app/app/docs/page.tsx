"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";
import { COURSE_TRACKS } from "@/lib/course-data";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-black text-foreground font-mono selection:bg-accent-cyan selection:text-black">
            <BackgroundCanvas />

            <div className="relative z-10 container mx-auto px-6 py-20 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-green">
                        DOCUMENTATION
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your field guide to navigating the Jules Rust Learning System.
                        <br />
                        <span className="text-accent-orange">v2.0.4.beta</span>
                    </p>
                </div>

                {/* Section: How to Use */}
                <section className="mb-16 bg-gray-900/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slide-up">
                    <h2 className="text-3xl font-bold text-accent-cyan mb-6 flex items-center gap-3">
                        <span className="text-4xl">🚀</span> How to Use
                    </h2>
                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <div className="flex gap-4">
                            <span className="text-2xl">ign</span>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">1. Select a Track</h3>
                                <p>Navigate to the <Link href="/learn" className="text-accent-orange underline hover:text-white">Courses</Link> page and choose a specialization. We simulate everything from basic Rust to Cyber Warfare.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-2xl">💻</span>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">2. Hack the Code</h3>
                                <p>Each lesson presents a broken or incomplete Rust program. Use the <strong className="text-white">RetroEditor™</strong> to write your solution. Real-time syntax highlighting included.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">3. Run & Verify</h3>
                                <p>Hit <span className="bg-accent-orange text-white text-xs px-2 py-1 rounded font-bold">RUN CODE</span>. Our simulated compiler checks your logic. If you pass, you unlock the next module immediately.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-2xl">🤖</span>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">4. AI Assistance</h3>
                                <p>Stuck? The <strong className="text-accent-purple">AI Tutor</strong> is available in advanced modules (Math & AI). Just ask it for a hint!</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Course Catalog */}
                <section className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                    <h2 className="text-3xl font-bold text-accent-green mb-8 flex items-center gap-3">
                        <span className="text-4xl">📚</span> Course Catalog
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {COURSE_TRACKS.map((track) => (
                            <div key={track.id} className="group bg-black border border-gray-800 p-6 rounded-xl hover:border-accent-cyan transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 transform origin-left">
                                    {track.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan">
                                    {track.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4 h-10">
                                    {track.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Modules:</div>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {track.modules.slice(0, 3).map(mod => (
                                            <li key={mod.id} className="truncate flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple"></span>
                                                {mod.title}
                                            </li>
                                        ))}
                                        {track.modules.length > 3 && (
                                            <li className="text-gray-500 italic text-xs pl-3.5">
                                                + {track.modules.length - 3} more...
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-20 text-center text-gray-600 text-sm border-t border-gray-900 pt-8">
                    <p>🔥 Built with Next.js, Rust (Simulated), and AI.</p>
                    <p className="mt-2 text-xs">© 2026 Jules Awesome List.</p>
                </footer>
            </div>
        </div>
    );
}
