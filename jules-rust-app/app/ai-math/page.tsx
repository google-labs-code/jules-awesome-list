"use client";

import Link from "next/link";
import CosmicBackground from "@/components/CosmicBackground";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const MODULES = [
    {
        id: 1,
        title: "Linear Algebra",
        description: "Initialize your knowledge base with the language of data.",
        icon: "📐",
        topics: [
            "Scalar Operations",
            "Dot Product",
            "Eigenvalues & Eigenvectors",
            "Singular Value Decomposition (SVD)"
        ],
        color: "accent-cyan",
        link: "/learn/ai-linear-scalar"
    },
    {
        id: 2,
        title: "Calculus",
        description: "Optimize your algorithms with the study of change.",
        icon: "∫",
        topics: [
            "Derivatives",
            "Gradient Descent",
            "Integrals & Area Under Curve",
            "Partial Derivatives"
        ],
        color: "accent-orange"
    },
    {
        id: 3,
        title: "Probability & Statistics",
        description: "Master uncertainty and predictive modeling.",
        icon: "🎲",
        topics: [
            "Gaussian (Normal) Distribution",
            "Bernoulli Distribution",
            "Expectation, Variance, Covariance",
            "Hypothesis Testing"
        ],
        color: "accent-pink"
    },
    {
        id: 4,
        title: "Optimization",
        description: "Fine-tune your models for maximum performance.",
        icon: "⚙️",
        topics: [
            "Gradient Descent Optimization",
            "Constrained Optimization",
            "Error Minimization",
            "Parameter Tuning"
        ],
        color: "accent-yellow"
    },
    {
        id: 5,
        title: "Graph Theory",
        description: "Navigate complex data structures and networks.",
        icon: "🕸️",
        topics: [
            "NetworkX",
            "Shortest Path Algorithms",
            "Data Structure Analysis",
            "Connectivity & Flows"
        ],
        color: "accent-purple"
    },
    {
        id: 6,
        title: "Information Theory",
        description: "Quantify information and uncertainty.",
        icon: "ℹ️",
        topics: [
            "Entropy",
            "Cross-Entropy",
            "KL Divergence",
            "Uncertainty Measurement"
        ],
        color: "accent-green"
    }
];

export default function AIMathPage() {
    return (
        <main className="relative min-h-screen flex flex-col items-center pt-24 p-8 overflow-hidden">
            <CosmicBackground />
            <BackgroundCanvas />

            {/* Header */}
            <div className="z-10 text-center mb-16 max-w-4xl">
                <Link
                    href="/"
                    className="absolute top-8 left-8 text-accent-cyan hover:text-white transition-colors flex items-center font-mono text-sm"
                >
                    &lt; RETURN_ROOT
                </Link>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-purple via-white to-accent-cyan mb-6 text-shadow-glow">
                    ESSENTIAL_MATH_FOR_AI
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                    Master the mathematical foundations required to build, understand, and optimize next-generation artificial intelligence systems.
                </p>
            </div>

            {/* Curriculum Grid */}
            <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full mb-20">
                {MODULES.map((module) => (
                    <Link
                        href={module.link || "#"}
                        key={module.id}
                        className={`glass-panel p-8 border border-${module.color}/30 hover:border-${module.color} transition-all duration-300 group relative overflow-hidden block`}
                    >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-${module.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <span className="text-4xl">{module.icon}</span>
                            <div className="flex flex-col items-end">
                                <span className={`font-mono text-xs opacity-50 text-${module.color} border border-${module.color} px-2 py-1 rounded mb-1`}>
                                    MOD_0{module.id}
                                </span>
                                {module.link && <span className="text-[10px] text-accent-green font-bold animate-pulse">AVAILABLE</span>}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-sm text-gray-400 mb-6 min-h-[40px]">{module.description}</p>

                        <div className="space-y-2">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3"> Curriculum:</div>
                            <ul className="space-y-2">
                                {module.topics.map((topic, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-300 group-hover:text-white transition-colors">
                                        <span className={`mr-2 text-${module.color}`}>›</span>
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`absolute inset-0 bg-${module.color}/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>
                    </Link>
                ))}
            </div>

            {/* Footer / CTA */}
            <div className="z-10 text-center mb-12">
                <p className="text-accent-cyan font-mono text-sm mb-4 animate-pulse">
                    {"// SYSTEM.READY: INITIATE_LEARNING_SEQUENCE"}
                </p>
            </div>

        </main>
    );
}
