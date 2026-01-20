"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const ufoRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Setup mouse movement tracking
    useGSAP(() => {
        const cursor = cursorRef.current;
        const ufo = ufoRef.current;
        if (!cursor || !ufo) return;

        // Initial setup
        gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 }); // Start hidden

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

        // Continuous rotation for the UFO
        gsap.to(ufo, {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "linear",
        });

        const onMouseMove = (e: MouseEvent) => {
            // Make visible on first move if hidden
            if (gsap.getProperty(cursor, "opacity") === 0) {
                gsap.to(cursor, { opacity: 1, duration: 0.2 });
            }
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    // Setup interaction listeners
    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Expanded interactive check
            const isInteractive =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("interactive");

            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", () => setIsHovering(false)); // Ensure reset
        return () => {
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", () => setIsHovering(false));
        };
    }, []);

    // Animate hover state
    useGSAP(() => {
        const ufo = ufoRef.current;
        if (!ufo) return;

        if (isHovering) {
            gsap.to(ufo, { scale: 1.5, filter: "drop-shadow(0 0 15px rgba(0, 245, 255, 0.9))", duration: 0.3 });
        } else {
            gsap.to(ufo, { scale: 1, filter: "drop-shadow(0 0 5px rgba(0, 245, 255, 0.5))", duration: 0.3 });
        }
    }, [isHovering]);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:block"
            style={{ opacity: 0 }} // Correct inline style for hydration safety
        >
            <div ref={ufoRef} className="ufo-icon relative w-12 h-12">
                <span className="text-6xl select-none filter drop-shadow-[0_0_10px_rgba(0,245,255,0.7)]">
                    🛸
                </span>
            </div>
        </div>
    );
}
