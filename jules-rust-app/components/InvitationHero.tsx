"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function InvitationHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const word1Ref = useRef<HTMLDivElement>(null);
    const word2Ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Initial State
        gsap.set(".invite-char", { y: 100, opacity: 0, rotateX: 90 });
        gsap.set(".line-decoration", { scaleX: 0 });

        // 2. Reveal "INVI"
        tl.to(".word-1 .invite-char", {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
        });

        // 3. Reveal "TATION" (Mirrored effect or delayed)
        tl.to(".word-2 .invite-char", {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: -0.1, // Reverse stagger
            ease: "power4.out",
        }, "-=1.0");

        // 4. Decoration Lines Expansion
        tl.to(".line-decoration", {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.out",
        }, "-=0.5");

        // 5. Floating / Breathing Animation
        gsap.to(".hero-container", {
            backgroundPosition: "0% 100%",
            ease: "none",
            duration: 20,
            repeat: -1,
            yoyo: true,
        });

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="hero-container relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans perspective-1000"
            style={{
                backgroundImage: "radial-gradient(circle at 50% 50%, #2a2a2a 0%, #000000 100%)",
                backgroundSize: "200% 200%",
            }}
        >
            {/* NanoBanana Gene Watermark */}
            <div className="absolute top-8 left-8 text-xs font-mono text-white/30 tracking-[0.5em] uppercase mix-blend-difference">
                NanoBanana Gene // SAP_DESIGN
            </div>

            <div className="z-10 flex flex-col items-center gap-0 md:gap-4 mix-blend-exclusion">

                {/* WORD 1: INVI */}
                <div ref={word1Ref} className="word-1 flex overflow-hidden">
                    {["I", "N", "V", "I"].map((char, i) => (
                        <span
                            key={i}
                            className="invite-char text-[15vw] md:text-[18vw] font-black leading-none text-white tracking-tighter transform origin-bottom"
                            style={{ textShadow: "0 10px 30px rgba(255,255,255,0.2)" }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Separator Line */}
                <div className="line-decoration w-[80vw] h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent my-4" />

                {/* WORD 2: TATION */}
                <div ref={word2Ref} className="word-2 flex overflow-hidden">
                    {["T", "A", "T", "I", "O", "N"].map((char, i) => (
                        <span
                            key={i}
                            className="invite-char text-[15vw] md:text-[18vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter transform origin-top"
                        >
                            {char}
                        </span>
                    ))}
                </div>
            </div>

            {/* Interactive Message */}
            <div className="absolute bottom-12 text-center">
                <p className="text-yellow-500/80 font-mono text-sm tracking-widest uppercase animate-pulse">
                    Click to Accept
                </p>
            </div>

            {/* Ambient Particles (Simple CSS implementation for performance) */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute w-64 h-64 bg-yellow-500/20 rounded-full blur-[100px] top-1/4 left-1/4 animate-blob" />
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] bottom-1/4 right-1/4 animate-blob animation-delay-2000" />
            </div>
        </div>
    );
}
