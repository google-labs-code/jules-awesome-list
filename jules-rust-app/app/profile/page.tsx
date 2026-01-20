"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";
import NextImage from "next/image";

export default function ProfilePage() {
    const { username, logout, updateUsername, isLoggedIn, mounted } = useCourseProgress();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [error, setError] = useState("");

    // Hidden file input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mounted && !isLoggedIn) {
            router.push("/login"); // Redirect if not logged in
        }
    }, [mounted, isLoggedIn, router]);

    useEffect(() => {
        if (username) setNewUsername(username);
        // Load profile pic from local storage
        const storedPic = localStorage.getItem("jules_rust_pfp");
        if (storedPic) setProfilePic(storedPic);
    }, [username]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleSaveProfile = () => {
        if (!newUsername.trim()) {
            setError("Username cannot be empty");
            return;
        }
        updateUsername(newUsername);
        setIsEditing(false);
        setError("");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            // Check dimensions
            if (img.width > 500 || img.height > 500) {
                setError("Image dimensions must be max 500x500px");
                URL.revokeObjectURL(img.src);
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfilePic(base64String);
                localStorage.setItem("jules_rust_pfp", base64String);
                setError("");
            };
            reader.readAsDataURL(file);
            URL.revokeObjectURL(img.src);
        };

        img.onerror = () => {
            setError("Failed to load image");
        };
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pt-24">
            <BackgroundCanvas />

            <div className="relative z-10 w-full max-w-2xl p-8 bg-black/80 border border-accent-purple/50 backdrop-blur-xl shadow-[0_0_50px_rgba(157,78,221,0.2)] rounded-lg">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-white mb-2 fluid-hover">
                        USER_PROFILE
                    </h1>
                    <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
                        Manage Your Identity
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-48 h-48 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center overflow-hidden bg-black relative group">
                            {profilePic ? (
                                <NextImage
                                    src={profilePic}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="text-6xl text-gray-700">👾</div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}>
                                <span className="text-accent-cyan font-bold text-sm">UPLOAD</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 max-w-[150px] text-center">
                            Max 500x500px. Click image to upload.
                        </p>
                    </div>

                    {/* Check for error */}
                    {error && (
                        <div className="w-full md:w-auto p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-xs font-mono text-center animate-pulse mb-4 md:mb-0">
                            {error}
                        </div>
                    )}


                    {/* User Details Section */}
                    <div className="flex-1 w-full space-y-6">

                        <div className="space-y-2">
                            <label className="text-xs text-accent-orange font-bold tracking-widest">USERNAME</label>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="bg-black/50 border-b border-gray-500 text-white font-mono p-2 flex-1 focus:border-accent-cyan outline-none"
                                    />
                                    <button onClick={handleSaveProfile} className="text-accent-green hover:text-white px-3 py-1 border border-accent-green hover:bg-accent-green/20 text-xs">
                                        SAVE
                                    </button>
                                    <button onClick={() => { setIsEditing(false); setNewUsername(username); setError(""); }} className="text-gray-500 hover:text-white px-3 py-1 text-xs">
                                        CANCEL
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded border border-white/10">
                                    <span className="text-xl font-mono text-white tracking-wider">{username || "UNKNOWN_USER"}</span>
                                    <button onClick={() => setIsEditing(true)} className="text-accent-cyan hover:text-white text-xs uppercase tracking-widest border border-accent-cyan/30 px-2 py-1 hover:bg-accent-cyan/10 transition-all">
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold tracking-widest">STATUS</label>
                            <div className="text-accent-green font-mono text-sm">
                                ● ONLINE
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 border border-red-500/50 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                            >
                                TERMINATE SESSION
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}
