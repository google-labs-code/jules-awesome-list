"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BentoCardProps {
    title: string;
    description: string;
    icon: string;
    difficulty: string;
    colSpan?: number;
    className?: string;
    onClick?: () => void;
}

export default function BentoCard({
    title,
    description,
    icon,
    difficulty,
    colSpan = 1,
    className = "",
    onClick
}: BentoCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.02,
                transformPerspective: 1000,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                ease: "power2.out"
            });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: cardRef });

    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-green-400 border-green-400/30';
            case 'medium': return 'text-yellow-400 border-yellow-400/30';
            case 'hard': return 'text-red-400 border-red-400/30';
            case 'expert': return 'text-purple-400 border-purple-400/30';
            default: return 'text-gray-400 border-gray-400/30';
        }
    };

    return (
        <div
            ref={cardRef}
            onClick={onClick}
            className={`
                group relative
                bg-white/5 backdrop-blur-md 
                border-white/10 border
                rounded-3xl p-8 
                overflow-hidden cursor-pointer
                transition-shadow duration-500
                hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]
                flex flex-col justify-between
                ${colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'}
                ${colSpan === 3 ? 'md:col-span-3' : ''}
                ${className}
            `}
        >
            {/* Gradient Blob Background */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl group-hover:bg-accent-cyan/20 transition-all duration-500" />

            <div ref={contentRef} className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <span className="text-5xl">{icon}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono uppercase border ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                    </span>
                </div>

                <div>
                    <h3 className="text-3xl font-bold mb-3 text-white group-hover:text-accent-cyan transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            <div className="relative z-10 mt-8 flex items-center text-sm font-mono text-accent-cyan opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                START HACKING &rarr;
            </div>
        </div>
    );
}
