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
            className="relative min-h-screen flex flex-col justify-end items-center px-6 md:px-24 overflow-hidden pb-0 md:pb-4"
        >
            <CinematicRevealGrid />

            {/* Wave Transition - Magic Site Gradient Match */}
            <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none translate-y-1 h-[120px] md:h-[220px]">
                <div className="hero-wave-container" />
            </div>

            {/* Main Title - Centered Bottom */}
            <div ref={titleRef} className="relative z-30 flex flex-col items-center text-center max-w-4xl mx-auto mb-16 md:mb-20">
                <Image
                    src="/logos/Inkspire logos/Untitled-2-03.webp"
                    alt="Inkspire Studio"
                    width={320}
                    height={100}
                    className="hero-logo drop-shadow-2xl h-auto w-auto mb-6"
                    priority
                />
                <h1 className="sr-only">Inkspire Studio - {siteContent.hero.primaryCtaLabel}</h1>

                {/* Elevated Tagline styling */}
                <p className="hero-tagline text-xl md:text-2xl font-semibold leading-tight drop-shadow-lg text-balance animated-gradient-text tracking-wide">
                    Where ideas turn into stories <br className="hidden md:block" /> that move people and build brands.
                </p>

                {/* CTA Button */}
                <a
                    ref={ctaRef}
                    href={siteContent.hero.primaryCtaHref}
                    className="mt-6 w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/30 flex items-center justify-center text-white text-[10px] md:text-xs font-medium uppercase tracking-widest hover:bg-white hover:text-inkspirePurple transition-colors duration-300 interactive backdrop-blur-sm"
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
