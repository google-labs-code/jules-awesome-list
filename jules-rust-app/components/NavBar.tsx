"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/lib/hooks/use-course-progress";
import AlienAvatar from "@/components/AlienAvatar";

export default function NavBar() {
    const pathname = usePathname();
    const { isLoggedIn, username, mounted, profilePic } = useCourseProgress();

    if (!mounted) return null;

    const isActive = (path: string) => pathname === path ? "text-accent-orange" : "text-gray-400 hover:text-accent-cyan";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
            <Link href="/" className="text-xl font-bold tracking-widest text-accent-cyan hover:text-white transition-colors">
                HACK_RUST
            </Link>

            <div className="flex items-center gap-8 font-mono text-sm uppercase tracking-wider">
                <Link href="/" className={isActive("/")}>
                    Home
                </Link>
                <Link href="/learn" className={isActive("/learn")}>
                    Course
                </Link>
                <Link href="/contact" className={isActive("/contact")}>
                    Contact
                </Link>
                <Link href="/teacher" className={isActive("/teacher")}>
                    Teacher
                </Link>
                <Link href="/party-hacker" className={isActive("/party-hacker")}>
                    Party Hacker
                </Link>
                <Link
                    href="/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-green"
                >
                    Documentation
                </Link>
                <div className="h-4 w-[1px] bg-white/20"></div>
                {isLoggedIn ? (
                    <div className="flex items-center gap-3 px-4 py-2 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-all rounded-sm cursor-pointer group">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-cyan/50 group-hover:border-accent-cyan transition-colors">
                            {profilePic ? (
                                <NextImage
                                    src={profilePic}
                                    alt={username}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <AlienAvatar name={username} size={32} />
                            )}
                        </div>
                        <span className="font-bold hidden md:inline">{username}</span>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="px-4 py-2 border border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white transition-all rounded-sm"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 bg-accent-green/10 border border-accent-green text-accent-green hover:bg-accent-green hover:text-black transition-all rounded-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
