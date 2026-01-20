"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

interface StaggeredTextProps {
    text: string;
    className?: string;
    wrapperClass?: string;
    staggerAmount?: number;
    delay?: number;
    trigger?: string;
}

export default function StaggeredText({
    text,
    className = "",
    wrapperClass = "",
    staggerAmount = 0.03,
    delay = 0,
    trigger
}: StaggeredTextProps) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const letters = container.current?.querySelectorAll(".char");
        if (!letters || letters.length === 0) return;

        const animVars: gsap.TweenVars = {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: staggerAmount,
            duration: 1.2,
            ease: "power4.out",
            delay: delay
        };

        if (trigger) {
            animVars.scrollTrigger = {
                trigger: trigger,
                start: "top 80%",
            };
        }

        gsap.fromTo(letters,
            { y: "150%", opacity: 0, rotateX: -90 },
            animVars
        );

    }, { scope: container, dependencies: [trigger, delay] });

    return (
        <div ref={container} className={`overflow-hidden leading-[0.85] ${wrapperClass}`}>
            <div className={`flex flex-wrap ${className}`}>
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        className="char inline-block transform-style-3d origin-bottom"
                        style={{ whiteSpace: "pre" }}
                    >
                        {char}
                    </span>
                ))}
            </div>
        </div>
    );
}
