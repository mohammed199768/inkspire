"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

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
            className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-24 overflow-hidden"
        >




            {/* Main Title */}
            <div ref={titleRef} className="relative z-10 flex flex-col items-start md:items-start max-w-3xl -mt-32">
                <Image
                    src="/logos/Inkspire logos/Untitled-2-03.webp"
                    alt="Inkspire Studio"
                    width={260}
                    height={80}
                    className="hero-logo drop-shadow-2xl h-auto w-auto"
                    priority // Logo is critical
                />
                <h1 className="sr-only">Inkspire Studio - {siteContent.hero.primaryCtaLabel}</h1>
                <p className="hero-tagline mt-6 text-2xl md:text-4xl text-white/90 font-bold leading-relaxed drop-shadow-xl">
                    Where ideas turn into stories <br /> that move people and build brands.
                </p>
            </div>

            {/* CTA Button */}
            <a
                ref={ctaRef}
                href={siteContent.hero.primaryCtaHref}
                className="absolute bottom-24 right-6 md:right-12 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/40 flex items-center justify-center text-white text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-inkspirePurple transition-colors duration-300 interactive backdrop-blur-sm z-10"
            >
                <span className="text-center">{siteContent.hero.primaryCtaLabel}</span>
            </a>

            {/* Scroll Indicator */}
            <div
                ref={scrollLabelRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest z-10"
            >
                <span>{siteContent.hero.scrollLabelTop}</span>
                <div className="w-[1px] h-8 bg-white/30" />
                <span>{siteContent.hero.scrollLabelBottom}</span>
            </div>
        </section>
    );
}
