"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function SimulationGame() {
    const [gameState, setGameState] = useState<"intro" | "playing" | "success" | "fail">("intro");
    const [command, setCommand] = useState("");
    const [logs, setLogs] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [hackProgress, setHackProgress] = useState(0);

    // Matrix effect canvas logic
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (gameState !== "playing" && gameState !== "intro") return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
        const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nums = "0123456789";
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = gameState === "intro" ? "#0F0" : "#F00"; // Green for intro, Red for combat
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 30);
        return () => clearInterval(interval);
    }, [gameState]);

    // Timer logic
    useEffect(() => {
        if (gameState === "playing") {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setGameState("fail");
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = command.trim().toUpperCase();
        setCommand("");

        if (cmd === "HELP") {
            addLog("> AVAILABLE COMMANDS: SCAN, BRUTEFORCE, INJECT, OVERRIDE");
        } else if (cmd === "SCAN") {
            addLog("> SCANNING PORTS... VULNERABILITY FOUND AT PORT 8080.");
        } else if (cmd === "BRUTEFORCE" || cmd === "INJECT") {
            addLog(`> EXECUTING ${cmd}... PACKETS SENT.`);
            setHackProgress((prev) => Math.min(prev + 20, 100));
        } else if (cmd === "OVERRIDE" && hackProgress >= 80) {
            setHackProgress(100);
            setGameState("success");
        } else {
            addLog(`> ERROR: UNKNOWN COMMAND OR ACCESS DENIED FOR '${cmd}'`);
        }

        if (hackProgress >= 100) {
            setGameState("success");
        }
    };

    useEffect(() => {
        if (hackProgress >= 100 && gameState === 'playing') {
            setGameState('success');
        }
    }, [hackProgress, gameState])

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev.slice(-5), msg]);
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden font-mono text-green-500">
            <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 container mx-auto p-8 flex flex-col h-screen justify-center items-center">

                {gameState === "intro" && (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="text-6xl mb-4">💀</div>
                        <h1 className="text-5xl font-black text-red-600 tracking-widest glitch-text">
                            CYBER WARFARE
                        </h1>
                        <p className="text-xl text-red-400 max-w-lg mx-auto">
                            WARNING: UNAUTHORIZED SYSTEMS DETECTED.
                            INITIATE COMBAT PROTOCOLS?
                        </p>
                        <button
                            onClick={() => setGameState("playing")}
                            className="px-8 py-4 bg-red-600 text-black font-bold text-xl uppercase tracking-wider hover:bg-white hover:shadow-[0_0_30px_rgba(255,0,0,0.8)] transition-all"
                        >
                            INITIATE SEQUENCE &gt;
                        </button>
                    </div>
                )}

                {gameState === "playing" && (
                    <div className="w-full max-w-3xl bg-black/80 border-2 border-red-600/50 p-6 rounded-lg backdrop-blur shadow-[0_0_50px_rgba(255,0,0,0.2)]">
                        {/* HUD */}
                        <div className="flex justify-between items-center mb-6 border-b border-red-900/50 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                                <span className="text-red-500 font-bold tracking-widest">SYSTEM_ALERT</span>
                            </div>
                            <div className="text-2xl font-bold text-red-500">
                                T-MINUS: {timeLeft}s
                            </div>
                        </div>

                        {/* Terminals */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Enemies */}
                            <div className="bg-red-900/10 border border-red-900/30 p-4 rounded h-48 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
                                    {Array.from({ length: 64 }).map((_, i) => <div key={i} className="bg-red-500/20 w-full h-full"></div>)}
                                </div>
                                <div className="text-center z-10">
                                    <div className="text-4xl mb-2 animate-bounce">🛡️</div>
                                    <div className="text-red-400 font-bold">MAINFRAME FIREWALL</div>
                                    <div className="w-full bg-red-900/50 h-2 mt-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 transition-all duration-300"
                                            style={{ width: `${100 - hackProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-red-500 mt-1">INTEGRITY: {100 - hackProgress}%</div>
                                </div>
                            </div>

                            {/* Logs */}
                            <div className="bg-black border border-green-900/30 p-4 rounded h-48 overflow-hidden flex flex-col text-xs font-mono">
                                <div className="text-gray-500 border-b border-gray-800 pb-1 mb-2">/var/log/syslog</div>
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1 text-green-400">{log}</div>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleCommand} className="relative">
                            <input
                                autoFocus
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                placeholder="ENTER COMMAND (Try 'HELP')"
                                className="w-full bg-black border border-red-800 p-4 pl-12 text-green-500 font-mono focus:border-green-500 focus:outline-none transition-colors uppercase"
                            />
                            <span className="absolute left-4 top-4 text-green-500 font-bold">&gt;_</span>
                        </form>
                    </div>
                )}

                {gameState === "success" && (
                    <div className="text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="text-green-500 text-6xl mb-4">🔓</div>
                        <h1 className="text-5xl font-black text-green-500 tracking-widest shadow-glow">
                            ACCESS GRANTED
                        </h1>
                        <p className="text-xl text-gray-400">
                            MAINFRAME COMPROMISED. ROOT ACCESS ACQUIRED.
                        </p>

                        <div className="p-8 bg-green-900/20 border border-green-500/50 rounded-lg backdrop-blur">
                            <p className="text-sm text-green-300 mb-4 uppercase tracking-widest">Rewards Unlocked</p>
                            <Link href="/ide" className="inline-block px-12 py-4 bg-green-600 text-black font-bold text-2xl uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,0,0.5)]">
                                LAUNCH IDE &gt;
                            </Link>
                        </div>
                    </div>
                )}

                {gameState === "fail" && (
                    <div className="text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="text-red-600 text-6xl mb-4">🚫</div>
                        <h1 className="text-5xl font-black text-red-600 tracking-widest">
                            ACCESS DENIED
                        </h1>
                        <p className="text-xl text-red-400">
                            CONNECTION TERMINATED BY HOST.
                        </p>
                        <button
                            onClick={() => {
                                setGameState("playing");
                                setTimeLeft(60);
                                setHackProgress(0);
                                setLogs([]);
                            }}
                            className="px-8 py-4 border border-red-600 text-red-600 font-bold text-xl uppercase tracking-wider hover:bg-red-600 hover:text-black transition-all"
                        >
                            RETRY CONNECTION
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
