"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions/auth";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black font-mono">
            <div className="w-full max-w-md p-8 border border-accent-cyan/30 rounded-lg bg-black/50 backdrop-blur-md relative overflow-hidden group">

                {/* Decorative borders */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-pink to-transparent opacity-50"></div>

                <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-pink">
                    INITIATE_PROTOCOL: SIGNUP
                </h1>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="block text-accent-cyan text-sm mb-2" htmlFor="name">
                            &gt; IDENTITY_STRING (Name)
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-accent-cyan focus:outline-none transition-colors"
                            placeholder="Enter your alias..."
                        />
                    </div>

                    <div>
                        <label className="block text-accent-cyan text-sm mb-2" htmlFor="email">
                            &gt; COMM_CHANNEL (Email)
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-accent-cyan focus:outline-none transition-colors"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-accent-cyan text-sm mb-2" htmlFor="password">
                            &gt; ACCESS_KEY (Password)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-accent-cyan focus:outline-none transition-colors"
                            placeholder="********"
                        />
                    </div>

                    {state?.error && (
                        <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-500 text-sm text-center">
                            ⚠ ERROR: {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-3 bg-accent-cyan/10 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black font-bold tracking-widest transition-all uppercase"
                    >
                        {isPending ? "PROCESSING..." : "REGISTER_USER >"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ALREADY AUTHENTICATED?{" "}
                    <Link href="/login" className="text-accent-pink hover:underline">
                        LOGIN_HERE
                    </Link>
                </div>
            </div>
        </div>
    );
}
