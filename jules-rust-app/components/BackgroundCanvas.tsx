"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    fadeSpeed: number;
}

export default function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.floor((width * height) / 10000); // Density

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2 + 1, // 1-3px squares
                    speedX: (Math.random() - 0.5) * 0.2,
                    speedY: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random(),
                    fadeSpeed: (Math.random() - 0.5) * 0.02,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw standard particles
            particles.forEach((p) => {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around screen
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Update opacity (twinkle)
                p.opacity += p.fadeSpeed;
                if (p.opacity <= 0 || p.opacity >= 1) {
                    p.fadeSpeed = -p.fadeSpeed;
                }

                // Mouse interaction (glow/repel nearby particles)
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let alpha = p.opacity;
                if (distance < 150) {
                    alpha = Math.min(1, alpha + (150 - distance) / 300);
                    // Slight push away from mouse
                    // p.x -= dx * 0.01;
                    // p.y -= dy * 0.01;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, alpha * 0.7))})`; // White/Blueish tint

                // Draw square pixels for retro feel
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            // Draw mouse trail/glow
            const gradient = ctx.createRadialGradient(
                mouseRef.current.x, mouseRef.current.y, 0,
                mouseRef.current.x, mouseRef.current.y, 200
            );
            gradient.addColorStop(0, "rgba(29, 2, 69, 0)"); // Transparent center
            gradient.addColorStop(1, "rgba(29, 2, 69, 0)"); // Transparent edge
            // Actually, let's just use the particles to show the mouse. 
            // The background color is handled by CSS.

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ background: "transparent" }}
        />
    );
}
