"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function NanobananaHero() {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            // Initial intro animation
            const tl = gsap.timeline();

            tl.from(".panel", {
                yPercent: 100,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out"
            })
                .from(".hero-text-word", {
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "back.out(1.7)"
                }, "-=0.5");

            // Scroll interaction
            // Make the text move slightly on scroll
            gsap.to(textRef.current, {
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                },
                y: 100,
                scale: 0.95
            });

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={container} className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden font-unbounded">
            {/* Three Colored Panels */}
            <div className="panel w-full md:w-1/3 h-1/3 md:h-full bg-nano-blue relative z-0"></div>
            <div className="panel w-full md:w-1/3 h-1/3 md:h-full bg-nano-green relative z-0"></div>
            <div className="panel w-full md:w-1/3 h-1/3 md:h-full bg-nano-pink relative z-0"></div>

            {/* Floating Text Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-80 md:mix-blend-normal md:opacity-100">
                {/* We duplicate text for mix-blend mode effects if needed, but for now simple overlay */}
            </div>

            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
                <h1 ref={textRef} className="text-white flex flex-col items-center justify-center text-center z-50">
                    <div className="text-6xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-2xl flex items-center gap-2 md:gap-4 mb-4">
                        <span className="inline-block overflow-hidden"><span className="hero-text-word inline-block text-accent-cyan">&lt;</span></span>
                        <span className="inline-block overflow-hidden"><span className="hero-text-word inline-block text-white">HELLO</span></span>
                        <span className="inline-block overflow-hidden"><span className="hero-text-word inline-block text-white">WORLD</span></span>
                        <span className="inline-block overflow-hidden"><span className="hero-text-word inline-block text-accent-cyan">/&gt;</span></span>
                    </div>

                    <div className="text-xl md:text-4xl font-bold tracking-wide normal-case flex flex-wrap items-center justify-center gap-2 md:gap-3 opacity-0 animate-[fadeIn_1s_ease-out_1.5s_forwards]">
                        <span className="animate-bounce">🚀</span>
                        <span className="text-gray-200">Learn <span className="text-accent-orange">Rust</span> the fun way</span>
                        <span className="animate-bounce delay-100">🦀</span>
                    </div>
                </h1>
            </div>

            {/* Decorative element from the 'nanobanana' vibe - maybe a scrolling marquee at bottom */}
            <div className="absolute bottom-10 left-0 w-full overflow-hidden text-white font-bold text-xl z-30 opacity-70">
                <div className="animate-marquee whitespace-nowrap">
                    NANOBANANA /// ENJOY THE RIDE /// VIBRANT COLORS /// GSAP ANIMATIONS /// RUST IS COOL ///
                    NANOBANANA /// ENJOY THE RIDE /// VIBRANT COLORS /// GSAP ANIMATIONS /// RUST IS COOL ///
                </div>
            </div>
        </div>
    );
}
