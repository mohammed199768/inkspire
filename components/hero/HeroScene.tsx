"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import CinematicRevealGrid from "./CinematicRevealGrid";

export default function HeroScene() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const scrollLabelRef = useRef<HTMLDivElement>(null);

    // Use the custom hook for animations
    useHeroAnimation(containerRef, titleRef, ctaRef, scrollLabelRef);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col justify-start md:justify-end items-center px-6 md:px-24 overflow-hidden pb-0 md:pb-4 pt-32 md:pt-0"
        >
            <CinematicRevealGrid />

            {/* Wave Transition - Magic Site Gradient Match */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-1 h-[160px] md:h-[260px] scale-x-[-1]">
                <div className="hero-wave-container" />
            </div>

            {/* Main Title - Centered Bottom */}
            <div ref={titleRef} className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto mb-4 md:mb-8">
                <div className="relative w-[180px] md:w-[220px] h-[80px] md:h-[100px] mb-6">
                    <Image
                        src="/logos/Inkspire logos/Untitled-2-03.webp"
                        alt="Inkspire Studio"
                        fill
                        className="object-contain drop-shadow-2xl hero-logo"
                        priority
                        sizes="(max-width: 768px) 180px, 220px"
                    />
                </div>
                <h1 className="sr-only">Inkspire Studio - {siteContent.hero.primaryCtaLabel}</h1>

                {/* Elevated Tagline styling */}
                <p
                    className="hero-tagline font-semibold leading-tight drop-shadow-lg text-balance animated-gradient-text tracking-wide text-[clamp(1.25rem,2.5vw,1.75rem)]"
                >
                    Where ideas turn into stories <br className="hidden md:block" /> that move people and build brands.
                </p>

                {/* CTA Button */}
                <a
                    ref={ctaRef}
                    href={siteContent.hero.primaryCtaHref}
                    className="mt-6 w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/30 flex items-center justify-center text-white text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-inkspirePurple transition-colors duration-300 interactive backdrop-blur-sm"
                >
                    <span className="text-center">{siteContent.hero.primaryCtaLabel}</span>
                </a>
            </div>

            {/* Scroll Indicator */}
            <div
                ref={scrollLabelRef}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest z-30"
            >
                <span>{siteContent.hero.scrollLabelTop}</span>
                <div className="w-[1px] h-4 bg-white/20" />
            </div>
        </section>
    );
}
