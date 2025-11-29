"use client";

import { siteContent } from "@/data/siteContent";

export default function FinalCTA() {
    return (
        <section id="contact" className="py-32 px-6 relative z-10 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                    {siteContent.finalCta.title}
                </h2>
                <p className="text-xl text-white/70 font-light mb-12">
                    {siteContent.finalCta.description}
                </p>

                <a
                    href={siteContent.finalCta.buttonHref}
                    className="inline-flex items-center justify-center px-10 py-5 bg-white text-inkspirePurple rounded-full text-lg font-bold tracking-wide hover:bg-inkspirePurple hover:text-white transition-all duration-300 interactive shadow-lg hover:shadow-inkspirePurple/50"
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
