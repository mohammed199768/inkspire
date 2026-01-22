"use client";

import { siteContent } from "@/data/siteContent";

export default function FinalCTA() {
    return (
        <section id="contact" className="scroll-mt-24 w-full min-h-[100svh] relative z-10 flex flex-col items-center justify-start lg:justify-center text-center pt-12 sm:pt-14 md:pt-16 pb-8 lg:pb-0 overflow-visible">
            {/* Background - Fully integrated with tunnel darkness */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none overflow-hidden" />

            {/* Main Content - Centered but feels boundless */}
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold text-white mb-10 leading-none tracking-tight">
                    {siteContent.finalCta.title}
                </h2>
                <p className="text-xl md:text-2xl text-white/60 font-light mb-16 max-w-2xl mx-auto">
                    {siteContent.finalCta.description}
                </p>

                <a
                    href={siteContent.finalCta.buttonHref}
                    className="inline-flex items-center justify-center px-12 py-6 bg-white text-black rounded-full text-xl font-bold tracking-wide hover:scale-105 hover:bg-inkspirePurple hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)]"
                >
                    {siteContent.finalCta.buttonLabel}
                </a>
            </div>

            <footer className="absolute bottom-6 w-full text-center text-white/30 text-sm">
                {siteContent.global.footerText}
            </footer>
        </section>
    );
}
