"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StaggeredText from "./StaggeredText";
import MagneticButton from "./MagneticButton";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FlowHero() {
    const panelsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Initial intro animation for panels
        const panels = panelsRef.current?.children;
        if (panels) {
            gsap.fromTo(panels,
                { height: "100%" },
                {
                    height: "100%",
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power4.inOut"
                }
            );
        }

        // Content fade in
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
        );

    }, { scope: panelsRef });

    return (
        <header className="relative w-full h-screen overflow-hidden bg-black text-white">
            {/* 3-Panel Background */}
            <div ref={panelsRef} className="absolute inset-0 flex h-full w-full z-0">
                <div className="w-1/3 h-full bg-[#2934D0]"></div>
                <div className="w-1/3 h-full bg-[#17E668]"></div>
                <div className="w-1/3 h-full bg-[#FF55B0]"></div>
            </div>

            {/* Drag Indicator Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                <div className="flex items-center gap-4 opacity-50 px-6 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                    <ArrowLeft size={16} />
                    <span className="uppercase text-sm tracking-widest font-bold">Drag</span>
                    <ArrowRight size={16} />
                </div>
            </div>

            {/* Main Content */}
            <div ref={contentRef} className="relative z-20 flex flex-col justify-center items-center h-full text-center px-4">
                <div className="mb-8">
                    <MagneticButton className="border-white text-white hover:bg-white hover:text-black">
                        Party
                    </MagneticButton>
                </div>

                <h1 className="max-w-7xl mx-auto flex flex-col items-center justify-center font-sans z-30 relative">
                    {/* Line 1: The Flow Party is a */}
                    <div className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-6 mb-2 md:mb-4 w-full">
                        <StaggeredText
                            text="The Flow Party is a"
                            className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase"
                            delay={1}
                        />
                        <span className="font-serif italic text-4xl md:text-7xl lg:text-8xl text-transparent text-stroke-white opacity-0 animate-[fadeIn_1s_ease-out_1.8s_forwards]">safe</span>
                    </div>

                    {/* Line 2: inclusive, & fun space */}
                    <div className="flex flex-wrap justify-center items-baseline gap-x-3 md:gap-x-6 w-full">
                        <StaggeredText
                            text="inclusive, & fun"
                            className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase"
                            delay={1.2}
                        />
                        <StaggeredText
                            text="space"
                            className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase"
                            delay={1.4}
                        />
                    </div>
                </h1>

                {/* Giant Background Text Layer */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-20 translate-y-1/2">
                    <div className="text-[20vw] font-bold leading-none text-center whitespace-nowrap text-white/10 uppercase tracking-tighter">
                        Flow Party
                    </div>
                </div>
            </div>
        </header>
    );
}
