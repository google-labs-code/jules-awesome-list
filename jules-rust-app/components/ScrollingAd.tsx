"use client";



export default function ScrollingAd() {
    return (
        <div className="w-full bg-black/40 border-y border-accent-cyan/50 backdrop-blur-sm overflow-hidden py-4 relative group shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-accent-cyan/10 to-accent-purple/20"></div>

            <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white font-black font-mono text-xl tracking-[0.2em] uppercase flex items-center gap-8 text-shadow-glow">
                    ⚡ NEXT GEN HACKING TOOLS
                    <span className="text-accent-green animate-pulse">👾</span>
                    ADVANCED CYBER-WARFARE SIMULATION
                    <span className="text-accent-green animate-pulse">👾</span>
                    PENETRATION TESTING ARSENAL
                    <span className="text-accent-green animate-pulse">👾</span>
                    ZERO-DAY EXPLOIT MASTERY
                    <span className="text-accent-green animate-pulse">👾</span>
                    RUST-POWERED OFFENSIVE SECURITY
                    <span className="text-accent-green animate-pulse">👾</span>
                    STEALTH OPERATIONAL SECURITY
                    <span className="text-accent-green animate-pulse">👾</span>
                    KERNEL LEVEL CONTROL
                </span>
                {/* Duplicate for seamless loop */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white font-black font-mono text-xl tracking-[0.2em] uppercase flex items-center gap-8 text-shadow-glow">
                    ⚡ NEXT GEN HACKING TOOLS
                    <span className="text-accent-green animate-pulse">👾</span>
                    ADVANCED CYBER-WARFARE SIMULATION
                    <span className="text-accent-green animate-pulse">👾</span>
                    PENETRATION TESTING ARSENAL
                    <span className="text-accent-green animate-pulse">👾</span>
                    ZERO-DAY EXPLOIT MASTERY
                    <span className="text-accent-green animate-pulse">👾</span>
                    RUST-POWERED OFFENSIVE SECURITY
                    <span className="text-accent-green animate-pulse">👾</span>
                    STEALTH OPERATIONAL SECURITY
                    <span className="text-accent-green animate-pulse">👾</span>
                    KERNEL LEVEL CONTROL
                </span>
            </div>
        </div>
    );
}
