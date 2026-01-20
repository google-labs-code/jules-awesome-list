"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSE_TRACKS } from "@/lib/course-data";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import PixelCharacter from "@/components/PixelCharacter";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";

export default function LearnPage() {
    const { isUnlocked, mounted } = useCourseProgress();
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    if (!mounted) {
        return <div className="min-h-screen bg-background text-foreground font-mono flex items-center justify-center">Loading...</div>;
    }

    const selectedTrack = selectedTrackId ? COURSE_TRACKS.find(t => t.id === selectedTrackId) : null;

    return (
        <div className="min-h-screen bg-background text-foreground font-mono relative overflow-hidden">
            <BackgroundCanvas />

            <div className="relative z-10 container mx-auto px-4 py-8">
                <header className="mb-12 text-center">
                    <Link href="/" className="inline-block mb-4 text-accent-cyan hover:text-accent-orange transition-colors">
                        &lt; Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-orange to-accent-cyan text-shadow-glow mb-4">
                        {selectedTrack ? selectedTrack.title : "Select a Track"}
                    </h1>
                    <p className="text-xl text-accent-purple">
                        {selectedTrack ? selectedTrack.description : "Choose your path to mastery."}
                    </p>
                </header>

                {/* Track Selection View */}
                {!selectedTrack && (
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {COURSE_TRACKS.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => setSelectedTrackId(track.id)}
                                className="relative group block w-full text-left bg-black border border-gray-800 hover:border-white transition-all duration-300 p-6 rounded-lg overflow-hidden flex items-center gap-6"
                            >
                                <span className="text-3xl shrink-0">{track.icon}</span>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors font-mono">
                                        {track.title}
                                    </h3>
                                    {/* Optional: Description could be hidden or subtle to match the clean image look 
                                        The image just has Title. Let's keep description but subtle.
                                    */}
                                    {/* <p className="text-xs text-gray-500 mt-1">{track.description}</p> */}
                                </div>
                                <div className="text-gray-600 group-hover:text-white transition-colors">
                                    &gt;
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Module List View */}
                {selectedTrack && (
                    <div>
                        <button
                            onClick={() => setSelectedTrackId(null)}
                            className="mb-8 px-6 py-2 border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white transition-all uppercase tracking-wider text-sm flex items-center gap-2"
                        >
                            ← Back to Tracks
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedTrack.modules.map((module, index) => {
                                // Logic for unlocking: Check against ALL modules or just track?
                                // Ideally, unlocking is sequential per track or global?
                                // For now, let's keep the global sequential logic but scoped to the module's ID.
                                // NOTE: This simple index check only works if modules are done in order.
                                // Since we flattened COURSE_MODULES, existing isUnlocked logic checks pure ID existence.
                                // However, strictly sequential locking might be confusing if tracks are parallel.
                                // Let's simplify: Any module in a new track is locked until previous is done?
                                // Or maybe assume first module of any track is unlocked?
                                // For "Fundamentals", it works. For others, let's assume index 0 of the track is unlocked if it's a new track.

                                // To properly use useCourseProgress, we need the "previous module ID".
                                // If index > 0, prev is current track[index-1].
                                // If index == 0, is it unlocked? Yes, let's unlock first lesson of every track.

                                const prevModuleId = index > 0 ? selectedTrack.modules[index - 1].id : undefined;
                                const unlocked = index === 0 ? true : isUnlocked(module.id, prevModuleId);

                                return (
                                    <div key={module.id} className="relative group block h-full">
                                        {unlocked ? (
                                            <Link
                                                href={`/learn/${module.id}`}
                                                className="relative block h-full bg-accent-purple/10 border border-accent-purple/30 hover:bg-accent-purple/20 hover:border-accent-cyan transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                                            >
                                                <div className="p-6 h-full flex flex-col">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-accent-cyan font-bold text-lg">0{index + 1}</span>
                                                        <div className="w-2 h-2 bg-accent-orange animate-pulse"></div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-foreground group-hover:text-accent-cyan mb-2 transition-colors">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 flex-grow">
                                                        {module.description}
                                                    </p>
                                                    <div className="mt-4 flex items-center text-accent-orange text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Start Module &gt;
                                                    </div>
                                                </div>
                                                {/* Decorative corners */}
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-cyan opacity-50"></div>
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-cyan opacity-50"></div>
                                            </Link>
                                        ) : (
                                            <div className="relative h-full bg-gray-900/50 border border-gray-800 opacity-70 cursor-not-allowed grayscale">
                                                <div className="p-6 h-full flex flex-col">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-gray-500 font-bold text-lg">0{index + 1}</span>
                                                        <div className="w-2 h-2 bg-gray-600"></div>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-500 mb-2">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 flex-grow">
                                                        {module.description}
                                                    </p>
                                                    <div className="mt-4 flex items-center text-gray-500 text-sm uppercase tracking-wider">
                                                        Locked
                                                    </div>
                                                </div>

                                                {/* Lock Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                                    <PixelCharacter type="lock" size={64} float={true} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
