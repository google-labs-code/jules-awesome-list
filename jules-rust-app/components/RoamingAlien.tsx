"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function RoamingAlien() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className="fixed z-0 pointer-events-none animate-roam"
            style={{
                bottom: "10%",
                left: "-100px", // Start off-screen
                animationDuration: "20s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
            }}
        >
            <Image
                src="/assets/alien.png"
                alt="Roaming Alien"
                width={64}
                height={64}
                className="pixelated"
            />
        </div>
    );
}
