"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AnimatedHero() {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const subTextRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Split text animation logic (simplified manually for now without SplitText plugin)
            const letters = textRef.current?.querySelectorAll(".hero-char");

            if (letters && letters.length > 0) {
                tl.fromTo(
                    letters,
                    { y: 50, opacity: 0, rotate: 10 },
                    { y: 0, opacity: 1, rotate: 0, stagger: 0.05, duration: 0.8 }
                );
            }

            if (subTextRef.current) {
                tl.fromTo(
                    subTextRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.4"
                );
            }

            if (buttonsRef.current) {
                tl.fromTo(
                    Array.from(buttonsRef.current.children),
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
                    "-=0.6"
                );
            }
        },
        { scope: container }
    );

    return (
        <div ref={container} className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full text-center space-y-12 pb-20">
            {/* Animated Greeting */}
            <div className="space-y-8 cursor-default relative">
                <div className="absolute -inset-20 bg-accent-purple/20 blur-[100px] rounded-full opacity-40 animate-pulse"></div>
                <h1 ref={textRef} className="relative text-6xl md:text-9xl font-black tracking-tighter fluid-hover">
                    {/* Manual character split for animation */}
                    <span className="hero-char inline-block text-accent-cyan">&lt;</span>
                    {"HELLO".split("").map((char, i) => (
                        <span key={`h-${i}`} className="hero-char inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mx-[2px]">{char}</span>
                    ))}
                    <span className="hero-char inline-block mx-4"> </span>
                    {"WORLD".split("").map((char, i) => (
                        <span key={`w-${i}`} className="hero-char inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mx-[2px]">{char}</span>
                    ))}
                    <span className="hero-char inline-block text-accent-cyan">/&gt;</span>
                </h1>
                <p ref={subTextRef} className="text-2xl md:text-4xl text-gray-300 font-light tracking-wide max-w-3xl mx-auto leading-relaxed opacity-0">
                    🚀 Learn <span className="text-accent-orange font-bold">Rust</span> the fun way 🦀
                </p>
            </div>

            {/* Call to Action Actions */}
            <div ref={buttonsRef} className="flex gap-8 flex-wrap justify-center opacity-0">
                <Link
                    href="/learn"
                    className="group relative flex items-center justify-center px-10 py-5 bg-accent-orange text-background font-bold text-xl border-2 border-accent-orange hover:bg-transparent hover:text-accent-orange overflow-hidden transition-all uppercase tracking-wider pixelated"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">🔥 Select Track</span>
                </Link>
                <Link
                    href="/ide"
                    className="group relative flex items-center justify-center px-10 py-5 bg-transparent text-accent-cyan font-bold text-xl border-2 border-accent-cyan hover:bg-accent-cyan hover:text-background overflow-hidden transition-all uppercase tracking-wider pixelated"
                >
                    <div className="absolute inset-0 bg-accent-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">💻 Use IDE</span>
                </Link>
                <Link
                    href="/ai-math"
                    className="group relative flex items-center justify-center px-10 py-5 bg-transparent text-accent-purple font-bold text-xl border-2 border-accent-purple hover:bg-accent-purple hover:text-background overflow-hidden transition-all uppercase tracking-wider pixelated"
                >
                    <div className="absolute inset-0 bg-accent-purple translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">📐 AI Mathematics</span>
                </Link>
            </div>
        </div>
    );
}
