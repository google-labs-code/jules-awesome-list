"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trackSlideshowEvent } from "@/lib/actions/track-usage";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
    "/images/slideshow/space_sequence_1_1768743815192.png",
    "/images/slideshow/space_sequence_2_1768743831515.png",
    "/images/slideshow/space_sequence_3_1768743847200.png",
];

export function HomepageSlideshow() {
    const container = useRef<HTMLDivElement>(null);
    const panels = useRef<HTMLDivElement[]>([]);

    useGSAP(
        () => {
            // Track start of interaction
            trackSlideshowEvent("VIEW");

            const totalPanels = panels.current.length;
            const images = gsap.utils.toArray<HTMLElement>(".slideshow-image");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    pin: true,
                    scrub: 1, // Smooth interaction
                    snap: 1 / (totalPanels - 1),
                    end: () => "+=" + container.current!.offsetWidth * totalPanels,
                    onLeave: () => {
                        trackSlideshowEvent("COMPLETE");
                    }
                }
            });

            // Horizontal scroll of panels
            tl.to(panels.current, {
                xPercent: -100 * (totalPanels - 1),
                ease: "none",
            });

            // Simultaneous zoom/expansion effect on images
            tl.to(images, {
                scale: 1.35, // Zoom in significantly to feel the "expansion"
                ease: "none",
                transformOrigin: "center center"
            }, "<"); // Start at the same time as the horizontal scroll
        },
        { scope: container }
    );

    return (
        <div ref={container} className="relative h-screen w-full overflow-hidden bg-black">
            <div className="flex h-full w-[300%]"> {/* 300% width for 3 slides */}
                {IMAGES.map((src, i) => (
                    <div
                        key={i}
                        ref={(el) => {
                            if (el) panels.current[i] = el;
                        }}
                        className="relative h-full w-screen flex-shrink-0 flex items-center justify-center overflow-hidden"
                    >
                        <Image
                            src={src}
                            alt={`Space journey sequence ${i + 1}`}
                            fill
                            className="slideshow-image object-cover" // Added identifier class
                            priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="relative z-10 max-w-4xl text-center p-8">
                            <h2 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                                {i === 0 && "Explore the Cosmos of Code"}
                                {i === 1 && "AI-Powered Learning"}
                                {i === 2 && "Master Your Future"}
                            </h2>
                            <p className="text-2xl text-gray-200 drop-shadow-md">
                                {i === 0 && "Embark on a journey through the universe of Rust and modern web development."}
                                {i === 1 && "Accelerate your mastery with intelligent tutoring and real-time feedback."}
                                {i === 2 && "Join thousands of developers building the next generation of software."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white animate-bounce">
                <p>Scroll to Explore</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto mt-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
    );
}
