"use client";

import { useEffect, useState } from "react";

const EMOJIS = ["🌍", "🌎", "🌏", "🪐", "🌑", "🌕", "☀️", "☄️", "🚀", "🛸", "👾", "✨", "🌌"];

type SpaceItem = {
    id: number;
    emoji: string;
    top: string;
    size: string;
    duration: string;
    delay: string;
    opacity: number;
};

export default function CosmicBackground() {
    const [items, setItems] = useState<SpaceItem[]>([]);

    useEffect(() => {
        // Generate random space items
        const newItems = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            top: `${Math.random() * 90}%`,
            size: `${Math.random() * 1.5 + 0.5}rem`, // Reduced: 0.5rem to 2rem
            duration: `${Math.random() * 20 + 20}s`, // Slower: 20s to 40s
            delay: `${Math.random() * -30}s`, // Start mid-animation
            opacity: Math.random() * 0.5 + 0.1, // 0.1 to 0.6
        }));
        setItems(newItems);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full h-full">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="absolute animate-fly-by will-change-transform"
                    style={{
                        top: item.top,
                        fontSize: item.size,
                        animationDuration: item.duration,
                        animationDelay: item.delay,
                        opacity: item.opacity,
                        left: "100%", // Start off-screen right
                        // Note: The animation handles translation from 110vw to -20vw, 
                        // but we need to ensure the element is positionable.
                        // Actually, for keyframes to work best with varying start times, 
                        // we should probably let the keyframe control X.
                    }}
                >
                    {item.emoji}
                </div>
            ))}
        </div>
    );
}
