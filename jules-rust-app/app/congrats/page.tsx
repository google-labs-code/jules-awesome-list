"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const DANCING_EMOJIS = ["💃", "🕺", "👯", "👯‍♂️", "🎉", "🥳", "🍾", "🥂", "🎊", "🎇", "🎆", "🦀", "🚀"];

export default function CongratsPage() {
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

    // Fireworks effect
    useEffect(() => {
        const colors = ["#FF9F1C", "#00f5ff", "#ebd401", "#7e50a3", "#50fa7b"];

        const interval = window.setInterval(() => {
            const id = Date.now();
            const x = Math.random() * 100;
            const y = Math.random() * 80;
            const color = colors[Math.floor(Math.random() * colors.length)];

            setFireworks(prev => [...prev.slice(-10), { id, x, y, color }]);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-black text-center">
            <BackgroundCanvas />

            {/* Fireworks Rendering (Simple CSS animations) */}
            {fireworks.map(fw => (
                <div
                    key={fw.id}
                    className="absolute pointer-events-none animate-ping"
                    style={{
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                        backgroundColor: fw.color,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        boxShadow: `0 0 20px 10px ${fw.color}`,
                        animationDuration: '1s'
                    }}
                />
            ))}

            {/* Dancing Emojis Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 3 + 2}rem`,
                            animationDuration: `${Math.random() * 1 + 0.5}s`,
                            animationDelay: `${Math.random()}s`,
                            opacity: 0.5
                        }}
                    >
                        {DANCING_EMOJIS[Math.floor(Math.random() * DANCING_EMOJIS.length)]}
                    </div>
                ))}
            </div>

            <div className="relative z-10 p-12 bg-black/60 backdrop-blur-xl border-2 border-accent-yellow rounded-2xl shadow-[0_0_100px_rgba(235,212,1,0.3)] max-w-3xl transform hover:scale-105 transition-all duration-500">
                <div className="text-6xl mb-6 animate-pulse">
                    🏆 🦀 🚀
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-yellow via-white to-accent-orange mb-8 fluid-hover">
                    MISSION ACCOMPLISHED!
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                    You have mastered the basics of Rust and proven yourself worthy.
                    <br />
                    <span className="text-accent-cyan font-bold block mt-4 text-3xl">SYSTEM LEVEL: ELITE HACKER</span>
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-accent-yellow text-black font-bold text-xl rounded hover:bg-white hover:scale-110 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(235,212,1,0.6)]"
                    >
                        Return to Base
                    </Link>
                    <Link
                        href="/learn"
                        className="px-8 py-4 border-2 border-accent-orange text-accent-orange font-bold text-xl rounded hover:bg-accent-orange hover:text-white transition-all uppercase tracking-widest"
                    >
                        Review Missions
                    </Link>
                </div>
            </div>
        </main>
    );
}
