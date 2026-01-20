"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { usePremiumStatus } from "@/lib/hooks/use-premium-status";


type Currency = "USD" | "BHT";

interface PriceConfig {
    regular: {
        USD: string;
        BHT: string;
    };
    ai: {
        USD: string;
        BHT: string;
    };
}

const PRICES: PriceConfig = {
    regular: {
        USD: "$7.99",
        BHT: "฿199",
    },
    ai: {
        USD: "$10.00",
        BHT: "฿299",
    },
};

export default function PricingSection() {
    const [currency, setCurrency] = useState<Currency>("USD");
    const { hasPurchasedBundle, purchaseBundle, mounted } = usePremiumStatus();

    useEffect(() => {
        // Simple heuristic: Use timezone to detect if user is likely in Thailand
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone === "Asia/Bangkok") {
            setCurrency("BHT");
        }
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-cyan fluid-hover">
                💎 MONTHLY_PACKAGES 💎
            </h2>
            <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                Upgrade your arsenal with premium access. Cancel anytime.
                <br />
                <span className="text-xs text-gray-500">
                    *Local pricing detected: {currency === "BHT" ? "Thailand" : "International"}
                </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Regular Course */}
                <div className="glass-panel p-8 border border-accent-cyan/30 hover:border-accent-cyan transition-all relative group rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-accent-cyan/5 group-hover:bg-accent-cyan/10 transition-colors duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-accent-cyan mb-2 tracking-widest uppercase">
                            Regular Course
                        </h3>
                        <div className="text-4xl font-black text-white mb-6">
                            {PRICES.regular[currency]}
                            <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-accent-cyan" />
                                <span>Full Course Access</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-accent-cyan" />
                                <span>Interactive Exercises</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-accent-cyan" />
                                <span>Community Discord</span>
                            </li>
                        </ul>

                        <button className="w-full py-3 bg-transparent border border-accent-cyan text-accent-cyan font-bold hover:bg-accent-cyan hover:text-black transition-all rounded uppercase tracking-wider">
                            Select Plan
                        </button>
                    </div>
                </div>

                {/* AI-Assisted Course */}
                <div className={`glass-panel p-8 border ${hasPurchasedBundle ? 'border-accent-green bg-accent-green/5' : 'border-accent-orange/30'} hover:border-accent-orange transition-all relative group rounded-xl overflow-hidden`}>
                    <div className="absolute inset-0 bg-accent-orange/5 group-hover:bg-accent-orange/10 transition-colors duration-500"></div>
                    <div className="absolute top-0 right-0 bg-accent-orange text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                        <h3 className="text-xl font-bold text-accent-orange mb-2 tracking-widest uppercase">
                            AI-Powered Bundle
                            {hasPurchasedBundle && <span className="ml-2 text-xs bg-accent-green text-black px-2 py-0.5 rounded">ACTIVE</span>}
                        </h3>
                        <div className="text-4xl font-black text-white mb-6">
                            {PRICES.ai[currency]}
                            <span className="text-lg text-gray-500 font-normal">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-accent-orange" />
                                <span>Everything in Regular</span>
                            </li>
                            <li className="flex items-center gap-3 text-white font-bold">
                                <Check className="w-5 h-5 text-accent-orange" />
                                <span>AI-Assisted Teaching 🤖</span>
                            </li>
                            <li className="flex items-center gap-3 text-white font-bold">
                                <Check className="w-5 h-5 text-accent-orange" />
                                <span>Personalized Hints</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-accent-orange" />
                                <span>Code Optimization Review</span>
                            </li>
                        </ul>

                        <button
                            onClick={purchaseBundle}
                            disabled={hasPurchasedBundle}
                            className={`w-full py-3 font-bold border rounded uppercase tracking-wider shadow-[0_0_15px_rgba(255,159,28,0.4)] hover:shadow-[0_0_25px_rgba(255,159,28,0.6)] transition-all 
                            ${hasPurchasedBundle
                                    ? 'bg-accent-green text-black border-accent-green cursor-default'
                                    : 'bg-accent-orange text-black border-accent-orange hover:bg-transparent hover:text-accent-orange'}`}
                        >
                            {hasPurchasedBundle ? "Purchased ✓" : "Select Plan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
