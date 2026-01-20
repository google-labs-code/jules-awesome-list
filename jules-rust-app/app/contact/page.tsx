"use client";

import BackgroundCanvas from "@/components/BackgroundCanvas";

export default function ContactPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-mono">
            <BackgroundCanvas />

            <div className="relative z-10 w-full max-w-2xl bg-black/90 border border-green-500/30 p-8 shadow-[0_0_40px_rgba(0,255,0,0.1)]">
                <div className="mb-8 border-b border-green-500/30 pb-4">
                    <h1 className="text-3xl font-bold text-green-500 mb-2">
                        &gt; ESTABLISH_UPLINK
                    </h1>
                    <p className="text-green-500/70 text-sm">
                        Enter your message frequency below.
                    </p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-xs uppercase tracking-widest text-green-500 mb-2">Identity / Name</label>
                            <input id="name" className="w-full bg-green-500/5 border border-green-500/30 p-3 text-green-500 focus:outline-none focus:border-green-400 focus:bg-green-500/10 transition-all placeholder-green-900" placeholder="Agent Name..." />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-green-500 mb-2">Frequency / Email</label>
                            <input id="email" className="w-full bg-green-500/5 border border-green-500/30 p-3 text-green-500 focus:outline-none focus:border-green-400 focus:bg-green-500/10 transition-all placeholder-green-900" placeholder="encrypted@comms.net" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-green-500 mb-2">Payload / Message</label>
                        <textarea id="message" rows={6} className="w-full bg-green-500/5 border border-green-500/30 p-3 text-green-500 focus:outline-none focus:border-green-400 focus:bg-green-500/10 transition-all placeholder-green-900" placeholder="Enter transmission data..."></textarea>
                    </div>

                    <button className="px-8 py-3 bg-green-500 text-black font-bold uppercase hover:bg-green-400 hover:shadow-[0_0_20px_rgba(0,255,0,0.5)] transition-all w-full md:w-auto">
                        Transmit Data &gt;
                    </button>
                </form>
            </div>
        </main>
    );
}
