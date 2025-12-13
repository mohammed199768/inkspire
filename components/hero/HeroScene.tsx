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
            {/* Animated Background Images */}
            {/* Optimized: We use CSS opacity-50 directly to ensure no flash of full brightness if JS is slow */}
            <div className="absolute inset-0 z-0">
                {/* Image 1 - Slides from left. High Priority for LCP. */}
                <div className="absolute w-[50%] h-full opacity-50 -left-10 overflow-hidden animate-slide-right">
                    {siteContent.gallery.items[0]?.imageUrl && (
                        <Image
                            src={siteContent.gallery.items[0].imageUrl}
                            alt="Background Art 1"
                            fill
                            className="object-cover"
                            priority
                            sizes="50vw"
                        />
                    )}
                </div>

                {/* Image 2 - Slides from right. Lower priority as it's secondary. */}
                <div className="absolute w-[50%] h-full opacity-50 -right-10 overflow-hidden animate-slide-left">
                    {siteContent.gallery.items[1]?.imageUrl && (
                        <Image
                            src={siteContent.gallery.items[1].imageUrl}
                            alt="Background Art 2"
                            fill
                            className="object-cover"
                            priority={false}
                            sizes="50vw"
                        />
                    )}
                </div>

                {/* Image 3 - Slower vertical movement. */}
                <div className="absolute w-full h-[60%] opacity-30 -top-10 overflow-hidden animate-slide-down">
                    {siteContent.gallery.items[2]?.imageUrl && (
                        <Image
                            src={siteContent.gallery.items[2].imageUrl}
                            alt="Background Art 3"
                            fill
                            className="object-cover"
                            priority={false}
                            sizes="100vw"
                        />
                    )}
                </div>

                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-inkspirePurple/30 to-inkspireIndigo/30 z-0" />

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
