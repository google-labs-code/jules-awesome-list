"use client";

import React, { useMemo } from "react";

interface AlienAvatarProps {
    name: string;
    size?: number;
    className?: string;
}

export default function AlienAvatar({ name, size = 100, className = "" }: AlienAvatarProps) {
    // Simple deterministic random generator based on string seed
    const seededRandom = (seed: string) => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        const pseudoRandom = (min: number, max: number, salt: number) => {
            const x = Math.sin(hash + salt) * 10000;
            const result = Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
            return result;
        };
        return pseudoRandom;
    };

    const features = useMemo(() => {
        const random = seededRandom(name);

        // Color Palettes (Bright & Alien-like)
        const colors = [
            "#4CC9F0", // Blue
            "#4361EE", // Deep Blue
            "#3A0CA3", // Purple
            "#7209B7", // Violet
            "#FF9F1C", // Orange (Jules accent)
            "#00F5FF", // Cyan (Jules accent)
            "#FF9F1C", // Orange (Jules accent)
            "#EBD401", // Yellow (Jules accent)
            "#7E50A3", // Jules Purple
            "#50FA7B", // Green
        ];

        const skinColor = colors[random(0, colors.length - 1, 1)] || colors[0];
        const eyeCount = random(1, 3, 2); // 1, 2, or 3 eyes
        const eyeSize = random(8, 14, 3);
        const antennaType = random(0, 2, 4); // 0: none, 1: straight, 2: curly
        const mouthType = random(0, 3, 5); // 0: smile, 1: flat, 2: o-mouth, 3: squiggle

        return { skinColor, eyeCount, eyeSize, antennaType, mouthType };
    }, [name]);

    const { skinColor, eyeCount, eyeSize, antennaType, mouthType } = features;

    // Render Eyes
    const renderEyes = () => {
        const eyes = [];
        const centerX = 50;
        const centerY = 45;
        const spacing = 18;

        if (eyeCount === 1) {
            eyes.push(<circle key="eye-1" cx={centerX} cy={centerY} r={eyeSize * 1.2} fill="white" />);
            eyes.push(<circle key="pupil-1" cx={centerX} cy={centerY} r={eyeSize * 0.5} fill="black" />);
        } else if (eyeCount === 2) {
            eyes.push(<circle key="eye-l" cx={centerX - spacing / 2 - 2} cy={centerY} r={eyeSize} fill="white" />);
            eyes.push(<circle key="pupil-l" cx={centerX - spacing / 2 - 2} cy={centerY} r={eyeSize * 0.4} fill="black" />);
            eyes.push(<circle key="eye-r" cx={centerX + spacing / 2 + 2} cy={centerY} r={eyeSize} fill="white" />);
            eyes.push(<circle key="pupil-r" cx={centerX + spacing / 2 + 2} cy={centerY} r={eyeSize * 0.4} fill="black" />);
        } else {
            // 3 eyes
            eyes.push(<circle key="eye-l" cx={centerX - spacing} cy={centerY + 5} r={eyeSize * 0.8} fill="white" />);
            eyes.push(<circle key="pupil-l" cx={centerX - spacing} cy={centerY + 5} r={eyeSize * 0.3} fill="black" />);
            eyes.push(<circle key="eye-c" cx={centerX} cy={centerY - 8} r={eyeSize * 0.9} fill="white" />);
            eyes.push(<circle key="pupil-c" cx={centerX} cy={centerY - 8} r={eyeSize * 0.35} fill="black" />);
            eyes.push(<circle key="eye-r" cx={centerX + spacing} cy={centerY + 5} r={eyeSize * 0.8} fill="white" />);
            eyes.push(<circle key="pupil-r" cx={centerX + spacing} cy={centerY + 5} r={eyeSize * 0.3} fill="black" />);
        }
        return eyes;
    };

    // Render Antennae
    const renderAntennae = () => {
        if (antennaType === 0) return null;
        if (antennaType === 1) {
            // Straight
            return (
                <>
                    <line x1="30" y1="25" x2="20" y2="10" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
                    <circle cx="20" cy="10" r="4" fill={skinColor} />
                    <line x1="70" y1="25" x2="80" y2="10" stroke={skinColor} strokeWidth="4" strokeLinecap="round" />
                    <circle cx="80" cy="10" r="4" fill={skinColor} />
                </>
            );
        }
        // Curly/Weird
        return (
            <>
                <path d="M35 25 Q 30 5 15 15" stroke={skinColor} strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="15" cy="15" r="4" fill={skinColor} />
                <path d="M65 25 Q 70 5 85 15" stroke={skinColor} strokeWidth="4" fill="none" strokeLinecap="round" />
                <circle cx="85" cy="15" r="4" fill={skinColor} />
            </>
        );
    };

    // Render Mouth
    const renderMouth = () => {
        const y = 70;
        if (mouthType === 0) return <path d={`M35 ${y} Q 50 ${y + 10} 65 ${y}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />; // Smile
        if (mouthType === 1) return <line x1="35" y1={y + 5} x2="65" y2={y + 5} stroke="black" strokeWidth="3" strokeLinecap="round" />; // Flat
        if (mouthType === 2) return <circle cx="50" cy={y + 5} r="6" fill="black" />; // O-mouth
        return <path d={`M35 ${y + 5} Q 42 ${y} 50 ${y + 5} T 65 ${y + 5}`} stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />; // Squiggle
    };

    return (
        <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-lg transition-transform hover:scale-110 duration-300"
            >
                {/* Antennae (behind head) */}
                {renderAntennae()}

                {/* Head */}
                <rect x="20" y="25" width="60" height="60" rx="20" fill={skinColor} />

                {/* Eyes */}
                {renderEyes()}

                {/* Mouth */}
                {renderMouth()}
            </svg>
        </div>
    );
}
