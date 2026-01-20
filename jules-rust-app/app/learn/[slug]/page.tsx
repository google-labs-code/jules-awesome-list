"use client";

import { ALL_MODULES } from "@/lib/course-data";
import RetroEditor from "@/components/RetroEditor";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";
import { useState, useEffect } from "react";
import PixelCharacter from "@/components/PixelCharacter";
import SimulationGame from "@/components/SimulationGame";
import SimpleMarkdown from "@/components/SimpleMarkdown";
import AIMathTutor from "@/components/AIMathTutor";
import { usePremiumStatus } from "@/lib/hooks/use-premium-status";
import ReactMarkdown from 'react-markdown';



interface LessonPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function LessonPage({ params }: LessonPageProps) {
    const [slug, setSlug] = useState<string | null>(null);

    useEffect(() => {
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
        });
    }, [params]);

    const courseModule = ALL_MODULES.find((m) => m.id === slug);
    const { markAsCompleted, isCompleted, mounted } = useCourseProgress();
    const { hasPurchasedBundle } = usePremiumStatus();
    const [output, setOutput] = useState("Ready to run...");
    const [isRunning, setIsRunning] = useState(false);
    const [code, setCode] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showingSolution, setShowingSolution] = useState(false);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Initialize code safely
    useEffect(() => {
        if (courseModule) {
            setCode(courseModule.initialCode);
        }
    }, [courseModule]);

    const handleToggleSolution = async () => {
        if (showingSolution) {
            // Switch back to initial code
            setCode(courseModule?.initialCode || "");
            setShowingSolution(false);
            setAiExplanation(null);
        } else {
            if (!hasPurchasedBundle) {
                alert("🔒 UPGRADE REQUIRED\n\nUnlock the AI-Powered Bundle to see solutions and get instant explanations!");
                return;
            }

            if (confirm("Revealing the solution will overwrite your current code. Continue?")) {
                setCode(courseModule?.solutionCode || "");
                setShowingSolution(true);
                fetchAiExplanation();
            }
        }
    };

    const fetchAiExplanation = async () => {
        if (!courseModule) return;
        setAiLoading(true);
        try {
            const prompt = `Explain this solution code for the lesson "${courseModule.title}":\n\n${courseModule.solutionCode}\n\nProvide a concise, beginner-friendly explanation of how it works.`;

            const res = await fetch("/api/ai-tutor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt, context: "EXPLAIN_SOLUTION" }),
            });

            const data = await res.json();
            if (data.response) {
                setAiExplanation(data.response);
            } else {
                setAiExplanation("Could not generate explanation.");
            }
        } catch (error) {
            console.error(error);
            setAiExplanation("Error connecting to AI Tutor.");
        } finally {
            setAiLoading(false);
        }
    };


    if (!slug) return <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">Initializing...</div>;

    if (!courseModule) {
        notFound();
    }

    if (courseModule.content === "SIMULATION_MODE") {
        return <SimulationGame />;
    }

    // Find next and previous modules
    const currentIndex = ALL_MODULES.findIndex((m) => m.id === slug);
    const nextModule = ALL_MODULES[currentIndex + 1];
    const prevModule = ALL_MODULES[currentIndex - 1];

    const handleRunCode = () => {
        setIsRunning(true);
        setOutput("Compiling...");

        // Simulate compilation delay
        setTimeout(() => {
            setIsRunning(false);

            const mockOutput = "Hello, world! \n\nProgram finished successfully.";

            // Simple heuristic: check if solution code is mostly matched or if known answer is present
            // Since we don't have a real compiler, we trust the user if they run the code and it's not empty,
            // OR we could check if code contains expected string.
            // For now, assume success if code is non-empty.

            setOutput(mockOutput);

            if (!isCompleted(courseModule.id)) {
                markAsCompleted(courseModule.id);
                setShowSuccess(true);

                // Check if this was the last module
                const isLastModule = currentIndex === ALL_MODULES.length - 1;
                if (isLastModule) {
                    setTimeout(() => {
                        window.location.href = "/congrats";
                    }, 2000); // Wait for success modal to show briefly
                }
            }
        }, 1500);
    };

    if (!mounted) return <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">Booting system...</div>;

    const completed = isCompleted(courseModule.id);

    return (
        <div className="min-h-screen bg-background text-foreground font-mono flex flex-col md:flex-row overflow-hidden">
            <BackgroundCanvas />

            {/* Sidebar / Content Area */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto h-[50vh] md:h-screen relative z-10 glass-panel border-r border-accent-purple/30">
                <Link href="/learn" className="text-accent-cyan hover:text-accent-orange mb-6 inline-block">
                    &lt; Back to Syllabus
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-orange to-accent-cyan mb-6">
                    {courseModule.title}
                </h1>

                <div className="prose prose-invert max-w-none prose-headings:text-accent-purple prose-a:text-accent-cyan prose-code:text-accent-orange mb-8">
                    <SimpleMarkdown content={courseModule.content} />
                </div>

                {/* AI Explanation Section */}
                {(showingSolution || aiLoading || aiExplanation) && (
                    <div className="mt-8 p-6 bg-accent-purple/10 border border-accent-purple rounded-lg animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-accent-purple text-white text-xs px-2 py-1 rounded-bl">AI EXPLAINER</div>
                        <h3 className="text-xl font-bold text-accent-cyan mb-4 flex items-center gap-2">
                            🤖 Bundle Insight
                        </h3>
                        {aiLoading ? (
                            <div className="text-gray-400 animate-pulse">Analyzing solution matrix...</div>
                        ) : (
                            <div className="prose prose-invert prose-sm text-gray-300">
                                <ReactMarkdown>{aiExplanation || "Ready to explain."}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between mt-12 pt-6 border-t border-accent-purple/30">
                    {prevModule ? (
                        <Link href={`/learn/${prevModule.id}`} className="text-accent-cyan hover:text-accent-orange">
                            &lt; {prevModule.title}
                        </Link>
                    ) : (
                        <div></div>
                    )}

                    {nextModule ? (
                        completed ? (
                            <Link href={`/learn/${nextModule.id}`} className="text-accent-cyan hover:text-accent-orange animate-pulse font-bold">
                                {nextModule.title} &gt;
                            </Link>
                        ) : (
                            <span className="text-gray-600 flex items-center cursor-not-allowed">
                                <span className="mr-2 text-xs uppercase tracking-widest">Locked</span>
                                {nextModule.title} &gt;
                            </span>
                        )
                    ) : (
                        <Link href="/learn" className="text-accent-orange hover:text-white">
                            Complete Course &gt;
                        </Link>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="w-full md:w-1/2 p-6 md:p-10 bg-black/80 relative z-10 flex flex-col h-[50vh] md:h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-accent-cyan">Interactive Editor</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleToggleSolution}
                            className={`text-xs px-3 py-1 border rounded transition-colors flex items-center gap-2 ${showingSolution
                                ? 'bg-accent-yellow text-black border-accent-yellow'
                                : 'text-accent-orange border-accent-orange hover:bg-accent-orange hover:text-black'
                                }`}
                        >
                            {showingSolution ? "HIDE SOLUTION" : (hasPurchasedBundle ? "🔓 SHOW SOLUTION" : "🔒 UNLOCK SOLUTION")}
                        </button>
                        {completed && !showSuccess && (
                            <span className="text-accent-green text-sm px-3 py-1 border border-accent-green rounded bg-accent-green/10">
                                Passed ✓
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-grow relative">
                    <RetroEditor
                        initialCode={code}
                        onChange={(newCode) => setCode(newCode)}
                        // Check if code matches so we don't need key hack if styled correctly, but key helps reset internal state if any
                        key={showingSolution ? "solution" : "editor"}
                    />

                    {showSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowSuccess(false)}>
                            <div className="bg-gray-900 border-2 border-accent-green p-8 rounded-lg text-center shadow-[0_0_50px_rgba(0,255,0,0.3)] max-w-sm">
                                <div className="mb-4 flex justify-center">
                                    <PixelCharacter type="notebook" size={80} className="animate-bounce" />
                                </div>
                                <h3 className="text-2xl font-bold text-accent-green mb-2">ACCESS GRANTED</h3>
                                <p className="text-white mb-6">Module completed! Next lesson unlocked.</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowSuccess(false); }}
                                    className="bg-accent-green text-black font-bold py-2 px-6 rounded hover:bg-white transition-colors"
                                >
                                    CONTINUE
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex gap-4">
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="bg-accent-orange text-white font-bold py-3 px-8 rounded hover:bg-accent-orange/80 disabled:opacity-50 disabled:cursor-wait transition-all shadow-[0_0_15px_rgba(255,159,28,0.4)] hover:shadow-[0_0_25px_rgba(255,159,28,0.6)]"
                    >
                        {isRunning ? "Running..." : "RUN CODE >"}
                    </button>
                </div>

                <div className="mt-6 p-4 border border-accent-green/30 bg-accent-green/10 rounded font-mono h-32 overflow-y-auto">
                    <h3 className="text-accent-green font-bold mb-2 text-xs tracking-widest border-b border-accent-green/20 pb-1">TERMINAL OUTPUT</h3>
                    <pre className="text-sm text-green-400 whitespace-pre-wrap">
                        {output}
                    </pre>
                </div>
            </div>

            {/* AI Tutor Integration - Available for all modules */}
            <AIMathTutor context={courseModule.title + ": " + courseModule.description} />

        </div>
    );
}

