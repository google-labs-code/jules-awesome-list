"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PartyHackerHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Grid & Background
        tl.to(".grid-line", {
            scaleX: 1,
            scaleY: 1,
            opacity: 0.4,
            duration: 1.5,
            stagger: 0.05,
            ease: "power2.out",
        });

        // Code Rain Effect (Simple GSAP staggering)
        gsap.to(".code-particle", {
            y: "100vh",
            opacity: 0,
            duration: "random(2, 5)",
            repeat: -1,
            stagger: { amount: 2, from: "random" },
            ease: "none",
        });

        // 2. Main Title (Glitch & Scale)
        tl.fromTo(
            ".hero-char",
            { opacity: 0, scale: 0.5, filter: "blur(10px)" },
            {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.8,
                stagger: { amount: 0.5, from: "center" },
                ease: "back.out(1.7)",
            },
            "-=1.0"
        );

        // Continuous floating for HUD
        gsap.to(".hud-container", {
            y: 10,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        });

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[85vh] bg-black overflow-hidden flex flex-col items-center justify-center font-mono selection:bg-yellow-400 selection:text-black"
        >
            {/* Dynamic Background Grid */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none perspective-500">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="grid-line absolute w-full h-[1px] bg-cyan-500/50 origin-left"
                        style={{ top: `${i * 5}%`, transform: "scaleX(0)" }}
                    />
                ))}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="grid-line absolute h-full w-[1px] bg-purple-500/50 origin-top"
                        style={{ left: `${i * 5}%`, transform: "scaleY(0)" }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/80 to-black" />
            </div>

            {/* Code Rain Particles */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="code-particle absolute text-xs text-yellow-500 font-bold"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: -20,
                        }}
                    >
                        {Math.random() > 0.5 ? "1" : "0"} {Math.random() > 0.5 ? "NANOBANANA" : "HACK"}
                    </div>
                ))}
            </div>

            {/* Main HUD Container */}
            <div className="hud-container z-10 relative p-12 border border-cyan-500/30 bg-black/60 backdrop-blur-md rounded-xl shadow-[0_0_50px_rgba(0,255,255,0.1)]">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400" />

                <div className="text-center mb-4">
                    <span className="text-xs text-cyan-400 tracking-[0.8em] font-bold uppercase block mb-2">
            // System_Override
                    </span>
                    <span className="inline-block w-12 h-1 bg-yellow-500 rounded-full" />
                </div>

                <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none text-white drop-shadow-[0_0_10px_purple]">
                    <div className="flex justify-center">
                        {"PARTY".split("").map((char, i) => (
                            <span key={`p-${i}`} className="hero-char inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600">
                                {char}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-center -mt-2 md:-mt-6">
                        {"HACKER".split("").map((char, i) => (
                            <span key={`h-${i}`} className="hero-char inline-block text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-orange-600">
                                {char}
                            </span>
                        ))}
                    </div>
                </h1>

                <div className="mt-8 flex justify-center gap-6 items-center">
                    <div className="h-[1px] w-12 bg-gray-500" />
                    <p className="text-sm md:text-base text-gray-400 font-bold tracking-widest uppercase">
                        <span className="text-yellow-400">System_Online</span>
                    </p>
                    <div className="h-[1px] w-12 bg-gray-500" />
                </div>
            </div>

            {/* Bottom Floating Visual */}
            <div className="absolute bottom-10 animate-bounce text-cyan-500/50">
                ▼ SCROLL TO HACK ▼
            </div>
        </div>
    );
}
