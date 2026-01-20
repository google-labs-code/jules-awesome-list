"use client";

import { useEffect, useState } from "react";
import RetroEditor from "@/components/RetroEditor";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const scriptLines = [
    "fn main() {",
    "    let target = \"World\";",
    "    println!(\"Hello, {}!\", target);",
    "}"
];

export default function DemoPage() {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);



    useEffect(() => {
        let currentLine = 0;
        let charIndex = 0;
        let currentCode = "";
        let timeoutId: ReturnType<typeof setTimeout>;

        const typeChar = () => {
            if (currentLine >= scriptLines.length) {
                // Finished typing, simulate run
                setTimeout(() => {
                    setIsRunning(true);
                    setTimeout(() => {
                        setIsRunning(false);
                        setOutput("Hello, World!");
                    }, 1000);
                }, 500);
                return;
            }

            const line = scriptLines[currentLine];

            // Add next char
            if (charIndex < line.length) {
                currentCode = currentCode + line[charIndex];
                setCode(currentCode);
                charIndex++;
                timeoutId = setTimeout(typeChar, 50 + Math.random() * 50); // Random typing speed
            } else {
                // Line finished, new line
                currentCode += "\n";
                setCode(currentCode);
                currentLine++;
                charIndex = 0;
                timeoutId = setTimeout(typeChar, 300); // Pause between lines
            }
        };

        // Start delay
        timeoutId = setTimeout(typeChar, 1000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="min-h-screen bg-black text-foreground font-mono flex items-center justify-center p-8 overflow-hidden">
            <BackgroundCanvas />
            <div className="relative z-10 w-full max-w-2xl border-2 border-accent-cyan bg-black/90 shadow-[0_0_40px_rgba(0,245,255,0.3)] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-accent-cyan/10 border-b border-accent-cyan p-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-xs text-accent-cyan tracking-widest">demo_mode.rs</span>
                </div>

                <div className="p-6">
                    <RetroEditor initialCode={code} readOnly={true} />
                </div>

                <div className={`p-4 border-t border-accent-cyan/30 flex justify-between items-center transition-all ${output ? "bg-accent-green/10" : ""}`}>
                    <button className={`px-4 py-2 bg-accent-orange text-white font-bold rounded ${isRunning ? "opacity-50" : ""}`}>
                        {isRunning ? "Running..." : "RUN CODE >"}
                    </button>

                    {output && (
                        <div className="font-mono text-accent-green animate-pulse">
                            &gt; {output}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
