"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useCourseProgress();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            if (username === "admin" && password === "admin") {
                // Success
                login(username);
                router.push("/learn");
            } else {
                setError("ACCESS DENIED: Invalid Credentials");
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <BackgroundCanvas />

            <div className="relative z-10 w-full max-w-md p-8 bg-black/80 border border-accent-cyan/50 backdrop-blur-xl shadow-[0_0_50px_rgba(0,245,255,0.2)] rounded-lg">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white mb-2 fluid-hover">
                        SYSTEM_LOGIN
                    </h1>
                    <p className="text-accent-orange font-mono text-xs tracking-widest uppercase">
                        Secure Access Terminal v9.0
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="USERNAME"
                            className="w-full bg-black/50 border-b-2 border-gray-700 p-4 text-white font-mono focus:border-accent-cyan focus:outline-none focus:bg-accent-cyan/5 transition-all outline-none"
                        />
                        <div className="absolute right-4 top-4 text-gray-500 group-focus-within:text-accent-cyan transition-colors">
                            _USR
                        </div>
                    </div>

                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="PASSWORD"
                            className="w-full bg-black/50 border-b-2 border-gray-700 p-4 text-white font-mono focus:border-accent-orange focus:outline-none focus:bg-accent-orange/5 transition-all outline-none"
                        />
                        <div className="absolute right-4 top-4 text-gray-500 group-focus-within:text-accent-orange transition-colors">
                            ***
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-xs font-mono text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 text-lg font-bold uppercase tracking-widest transition-all
                    ${loading
                                ? "bg-gray-800 text-gray-500 cursor-wait"
                                : "bg-accent-cyan text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,245,255,0.6)]"
                            }`}
                    >
                        {loading ? "AUTHENTICATING..." : "GRANT ACCESS >"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600 font-mono">
                        FORGOT CREDENTIALS? <span className="text-accent-cyan cursor-pointer hover:underline">CONTACT ADMIN</span>
                    </p>
                </div>
            </div>
        </main>
    );
}
