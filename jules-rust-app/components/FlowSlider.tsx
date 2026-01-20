"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const EVENTS = [
    {
        title: "Flow Party On Demand",
        date: "15 FEB 24",
        type: "Announcement",
        color: "bg-flow-blue",
        image: "event_flow_party.png"
    },
    {
        title: "The Making of Pigeon's Mission",
        date: "22 MAR 24",
        type: "Game Design",
        color: "bg-flow-black",
        textColor: "text-white",
        image: "event_pigeon_mission.png"
    },
    {
        title: "Slater App Judging",
        date: "14 SEPT 23",
        type: "Development",
        color: "bg-flow-green",
        textColor: "text-black",
        image: "event_slater_judging.png"
    },
    {
        title: "Learning Lumos",
        date: "21 MAY 23",
        type: "Development",
        color: "bg-flow-pink",
        textColor: "text-black",
        image: "event_learning_lumos.png"
    }
];

export default function FlowSlider() {
    const scrollContainer = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full py-20 bg-black text-cyan-400 overflow-hidden font-unbounded relative border-t border-b border-cyan-900/50">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                        <span className="block text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">EVENTS.LOG</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-3xl md:text-4xl">&gt; PAST & FUTURE</span>
                    </h2>
                </div>
                <div className="text-right max-w-md">
                    <p className="text-xs md:text-sm text-cyan-500/80 mb-2 uppercase tracking-[0.2em] font-mono">
                        // COMMUNITY_NOTICE
                    </p>
                    <p className="text-lg md:text-xl text-white/90 font-bold leading-tight drop-shadow-lg">
                        Hackers are welcome to contribute their ideas, we have GSAP.
                    </p>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainer}
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-4 md:px-12 pb-12 scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {EVENTS.map((event, i) => (
                    <div
                        key={i}
                        className={`relative flex-none w-[85vw] md:w-[60vw] lg:w-[40vw] aspect-[16/9] snap-center overflow-hidden group cursor-pointer rounded-xl border border-cyan-500/30 hover:border-cyan-400 transition-all duration-500 bg-black/50 backdrop-blur-sm`}
                        style={{ boxShadow: "0 0 30px -10px rgba(0, 255, 255, 0.15)" }}
                    >
                        {/* Image Background */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={`/images/party-hacker/${event.image || 'event_flow_party.png'}`} // Using local images, fallback logic if needed
                                alt={event.title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                            {/* Futuristic Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80" />
                            <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay z-10" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-bold uppercase leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                        {event.title}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 text-xs font-mono bg-black/60 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        DATE_{event.date}
                                    </div>
                                </div>
                                <div className={`px-4 py-1 text-[0.6rem] font-bold uppercase tracking-widest border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                    {event.type}
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="hidden group-hover:block transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0">
                                    <span className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-mono">
                                        [ ACCESS_DATA ]
                                    </span>
                                </div>
                                <div className="bg-cyan-500 text-black p-3 rounded-full transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
