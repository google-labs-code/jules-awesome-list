"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";
import RetroEditor from "@/components/RetroEditor";
import { useState } from "react";
import Link from "next/link";
import PixelCharacter from "@/components/PixelCharacter";

const LESSON_CONTENT = `
# Lesson 1: Hello World

Welcome to Rust! Let's write your first program.
In Rust, the \`main\` function is the entry point of every executable program.

## Task
1. Define a function named \`main\`.
2. Inside it, use the \`println!\` macro to print "Hello, world!".

## Hint
Macros in Rust end with an exclamation mark \`!\`.
`;

const INITIAL_CODE = `fn main() {
    // Your code here
}`;

export default function IDE() {
    const [output, setOutput] = useState("");
    const [code, setCode] = useState(INITIAL_CODE);

    const runCode = () => {
        setOutput("Compiling...");
        setTimeout(() => {
            if (code.includes('println!("Hello, world!")') || code.includes("println!(\"Hello, world!\")")) {
                setOutput("Compiling... Success!\nRunning `target/debug/hello_world`\n\nHello, world!");
            } else {
                setOutput("Compiling... Error!\n\nDid you forget `println!(\"Hello, world!\");`?");
            }
        }, 1000);
    };

    return (
        <main className="relative min-h-screen flex flex-col bg-background">
            <BackgroundCanvas />

            {/* Header */}
            <header className="z-10 h-16 border-b border-accent-purple/30 flex items-center justify-between px-6 bg-background/80 backdrop-blur">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <PixelCharacter type="notebook" size={40} className="hover:animate-spin cursor-pointer" float={false} />
                    </Link>
                    <h1 className="text-accent-cyan font-bold tracking-widest">RUST_TUTOR::IDE</h1>
                </div>
                <div className="flex gap-4">
                    <div className="px-3 py-1 border border-accent-yellow text-accent-yellow text-xs flex items-center gap-2">
                        <span className="w-2 h-2 bg-accent-yellow rounded-full animate-pulse"></span>
                        ONLINE
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="z-10 flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden h-[calc(100vh-64px)]">

                {/* Left Panel: Instructions */}
                <div className="w-full md:w-1/3 bg-code-bg/50 border border-accent-purple/30 rounded-lg p-6 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold text-accent-orange mb-4">Exercise 01</h2>
                    <div className="prose prose-invert prose-code:text-accent-yellow prose-headings:text-accent-cyan text-sm leading-relaxed whitespace-pre-line">
                        {LESSON_CONTENT}
                    </div>

                    <div className="mt-8 p-4 bg-accent-purple/10 border border-accent-purple/30 rounded">
                        <p className="text-xs text-accent-purple uppercase tracking-wider mb-2">Objective</p>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <span>[ ]</span> Print &quot;Hello, world!&quot;
                        </div>
                    </div>
                </div>

                {/* Right Panel: Editor & Output */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Editor */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <RetroEditor
                            initialCode={code}
                            onChange={setCode}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setCode(INITIAL_CODE)}
                            className="px-4 py-2 text-accent-orange border border-accent-orange hover:bg-accent-orange/10 text-sm uppercase tracking-wider"
                        >
                            Reset
                        </button>
                        <button
                            onClick={runCode}
                            className="px-6 py-2 bg-accent-cyan text-background font-bold uppercase tracking-wider hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                        >
                            Run Code ▶
                        </button>
                    </div>

                    {/* Output Console */}
                    <div className="h-48 bg-black/80 border-t-2 border-accent-purple/50 font-mono text-sm p-4 text-green-400 overflow-y-auto shadow-inner rounded-b-lg">
                        <div className="opacity-50 text-xs mb-2 border-b border-white/10 pb-1">TERMINAL OUTPUT</div>
                        <pre className="whitespace-pre-wrap">{output || "Waiting for execution..."}</pre>
                    </div>
                </div>

            </div>
        </main>
    );
}
