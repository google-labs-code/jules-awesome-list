"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PartyHackerHero from "@/components/PartyHackerHero";
import FlowSlider from "@/components/FlowSlider";
import BentoCard from "@/components/BentoCard";

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
    {
        title: "Generative Art",
        description: "Create a piece of art that evolves over time using noise algorithms.",
        difficulty: "Hard",
        grid: "col-span-1 md:col-span-2 lg:col-span-2",
        tags: ["p5.js", "Noise", "Canvas"],
        icon: "🎨"
    },
    {
        title: "Glitch Effect",
        description: "Simulate a digital glitch effect on hover or scroll.",
        difficulty: "Medium",
        grid: "col-span-1",
        tags: ["CSS", "Filters"],
        icon: "👾"
    },
    {
        title: "Particle System",
        description: "Build a physics-based particle system that reacts to mouse input.",
        difficulty: "Hard",
        grid: "col-span-1",
        tags: ["Physics", "Canvas"],
        icon: "✨"
    },
    {
        title: "Typography",
        description: "Kinetic typography experiments using GSAP.",
        difficulty: "Easy",
        grid: "col-span-1 md:col-span-2",
        tags: ["GSAP", "Text"],
        icon: "📝"
    }
];

export default function PartyHackerPage() {
    const mainRef = useRef<HTMLElement>(null);
    const whoRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!whoRef.current || !containerRef.current) return;

        // 8-bit style animation: simple, stepped movements
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                pin: true,
                scrub: 1,
            }
        });

        // 1. Reveal PAST Image (Pixelate in?)
        tl.fromTo(".past-img",
            { opacity: 0, scale: 0.1 },
            { opacity: 1, scale: 1, duration: 1, ease: "steps(5)" }
        )
            .fromTo(".past-text",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "steps(3)" }
            );

        // 2. Transition / Reveal FUTURE Image
        tl.fromTo(".future-img",
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 1, ease: "steps(5)" }
        )
            .fromTo(".future-text",
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, ease: "steps(3)" },
                "<" // start same time as image
            );

    }, { scope: mainRef });

    return (
        <main ref={mainRef} className="bg-black min-h-screen selection:bg-flow-pink selection:text-white overflow-x-hidden">

            {/* 1. Hero Section */}
            <PartyHackerHero />

            {/* 2. Events Slider */}
            <section id="events" className="relative z-20 bg-black -mt-20 pt-20 rounded-t-[3rem] pb-20">
                <FlowSlider />
            </section>

            {/* 3. Past & Future (8-bit Section) */}
            <div ref={containerRef} className="relative bg-neutral-900 text-white w-full z-10 overflow-hidden">
                <div ref={whoRef} className="flex flex-col md:flex-row h-[200vh] w-full">

                    {/* LEFT PANEL: THE PAST */}
                    <div className="past-panel w-full md:w-1/2 h-screen sticky top-0 flex flex-col items-center justify-center p-8 bg-neutral-900 border-r-4 border-yellow-900/30 relative overflow-hidden">
                        {/* Retro Grid Background */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: "linear-gradient(rgba(234, 179, 8, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
                        />

                        <div className="z-10 text-center">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 text-yellow-500 tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ fontFamily: 'var(--font-unbounded)' }}>
                                THE PAST
                            </h2>
                            <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-yellow-500/50 bg-black shadow-[0_0_30px_rgba(234,179,8,0.2)] rounded-xl overflow-hidden group">
                                <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-xl z-20 pointer-events-none" />
                                <img
                                    src="/images/party-hacker/past_v2.png"
                                    alt="8-bit Programmer Past"
                                    className="w-full h-full object-cover pixelated opacity-0 past-img transition-transform duration-700 group-hover:scale-110"
                                    style={{ imageRendering: "pixelated" }}
                                />
                                {/* Overlay CRT Scanlines */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none z-10 mix-blend-overlay" />
                            </div>
                            <p className="mt-8 max-w-sm text-center font-mono text-yellow-100/80 text-sm md:text-base leading-relaxed past-text opacity-0 bg-yellow-900/10 p-4 rounded-lg border border-yellow-500/20 backdrop-blur-sm">
                                <span className="text-yellow-400 font-bold">&gt; INSERT_COIN</span><br />
                                We started in cluttered rooms. Code was raw, screens were heavy, and pizza was the only fuel. The origin of the hack. <br />
                                <span className="animate-pulse text-yellow-500">_</span>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT PANEL: THE FUTURE */}
                    <div className="future-panel w-full md:w-1/2 h-screen sticky top-0 flex flex-col items-center justify-center p-8 bg-black relative overflow-hidden">
                        {/* Cyber Grid Background */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{ backgroundImage: "linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
                        />

                        <div className="z-10 text-center">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" style={{ fontFamily: 'var(--font-unbounded)' }}>
                                THE FUTURE
                            </h2>
                            <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-cyan-500/50 bg-black shadow-[0_0_40px_rgba(6,182,212,0.3)] rounded-xl overflow-hidden group">
                                {/* Decor HUD Elements */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-purple-500 z-20" />

                                <img
                                    src="/images/party-hacker/future_v2.png"
                                    alt="8-bit Programmer Future"
                                    className="w-full h-full object-cover pixelated opacity-0 future-img transition-transform duration-700 group-hover:scale-110"
                                    style={{ imageRendering: "pixelated" }}
                                />
                                {/* Holographic Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 opacity-50 pointer-events-none z-10" />
                            </div>
                            <p className="mt-8 max-w-sm text-center font-mono text-cyan-100/80 text-sm md:text-base leading-relaxed future-text opacity-0 bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
                                <span className="text-cyan-400 font-bold">&gt; SYSTEM_UPGRADE</span><br />
                                Neural links. AI assistants. Infinite creativity. The party transcends physical boundaries and enters the digital ether. <br />
                                <span className="animate-pulse text-purple-500">_</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. Challenges Grid */}
            <section className="py-32 bg-black text-white relative z-20">
                <div className="container mx-auto px-4">
                    <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between gap-4">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">
                            <span className="text-transparent text-stroke-white">Party</span> <span className="italic font-serif text-flow-pink">Challenges</span>
                        </h2>
                        <p className="text-white/60 max-w-md text-right">
                            Sharpen your skills with our weekly creative coding challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                        {CHALLENGES.map((challenge, i) => (
                            <div key={i} className="group-card">
                                <BentoCard {...challenge} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Connect */}
            <section className="py-20 bg-flow-blue text-white text-center relative z-20">
                <h2 className="text-4xl md:text-8xl font-bold mb-8 tracking-tighter">
                    JOIN THE <br /> <span className="italic font-serif">PARTY</span>
                </h2>
                <button className="px-8 py-4 bg-white text-flow-blue rounded-full text-xl font-bold hover:scale-105 transition-transform">
                    Discord Community
                </button>
            </section>
        </main>
    );
}
