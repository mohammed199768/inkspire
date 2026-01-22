"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import CinematicRevealGrid from "./CinematicRevealGrid";
import { motion } from "framer-motion";
import TypewriterText from "@/components/ui/TypewriterText";

export default function HeroScene() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const scrollLabelRef = useRef<HTMLDivElement>(null);

    // Use the custom hook for animations
    useHeroAnimation(containerRef, titleRef, ctaRef, scrollLabelRef);

    // Safari detection for performance optimization
    const isSafari = typeof navigator !== 'undefined' && 
                     /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    return (
        <section 
            ref={containerRef}
            id="home"
            className="relative min-h-[100svh] flex flex-col justify-center lg:justify-end items-center pt-20 pb-16 md:pb-24 lg:pb-32 overflow-hidden scroll-mt-24"
            style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}
        >
            {/* Tablet-only readability veil background */}
            <div className="absolute inset-x-0 bottom-0 h-[55vh] md:h-[45vh] tablet-text-veil pointer-events-none z-20 md:block lg:hidden hidden" />

            {/* 1. Images Row - Background Everywhere */}
            <div className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-10">
                <CinematicRevealGrid />
            </div>

            {/* Main Title Container with Glassmorphism - Centered on mobile/tablet */}
            <div ref={titleRef} className="relative z-30 flex flex-col items-center text-center max-w-[95vw] md:max-w-7xl mx-auto mb-4 md:mb-6 mt-0 lg:translate-y-12">
                {/* Premium Clean Glass Capsule (No Blur) - Visual depth via layered transparency */}
                <div className="relative px-8 py-8 md:px-12 md:py-10 rounded-full overflow-hidden w-full"
                     style={{ 
                         background: `
                            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)),
                            linear-gradient(180deg, rgba(167,139,250,0.08), rgba(109,40,217,0.04))
                         `,
                         boxShadow: `
                            inset 0 0 0 1px rgba(255,255,255,0.12),
                            0 20px 60px rgba(0,0,0,0.35)
                         `,
                         transition: 'all 0.5s ease'
                     }}
                >
                    {/* Atmospheric Glow inside glass - Clean & subtle */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 blur-[100px] pointer-events-none" />

                    {/* Main Heading - Clean White */}
                    <h1 className="hero-tagline relative z-10 font-black leading-[1.3] drop-shadow-lg text-balance tracking-tighter uppercase text-white"
                        style={{ fontSize: 'var(--fs-h3)' }}
                    >
                        <TypewriterText 
                            text="From ink we started, to make people Inkspired." 
                            speed={35}
                            delay={1500}
                        />
                    </h1>
                </div>

                {/* Elite CTA Button - Positioned near bottom */}
                <a
                    ref={ctaRef}
                    href={siteContent.hero.primaryCtaHref}
                    className="group relative mt-3 md:mt-4 block interactive z-[60]" 
                >
                    <div className="elite-cta-glow !bg-white/10 !blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="conic-border-wrap shadow-[0_0_50px_rgba(255,255,255,0.1)] !p-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent">
                        <div 
                            className="relative flex items-center gap-4 md:gap-6 px-10 py-5 md:px-16 md:py-8 bg-[#ffffff]/05 rounded-full border border-white/20 group-hover:bg-white/10 transition-all duration-700 overflow-hidden will-change-transform"
                            style={{ 
                                backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)',
                                backdropFilter: 'blur(6px)',
                                WebkitBackdropFilter: 'blur(6px)',
                                transform: 'translateZ(0)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                            <span className="relative text-white font-black uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-700 italic"
                                  style={{ fontSize: 'var(--fs-sm)' }}
                            >
                                {siteContent.hero.primaryCtaLabel}
                            </span>

                            <div className="relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 group-hover:bg-white group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 shadow-xl">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-4 h-4 md:w-6 md:h-6 text-white group-hover:text-black transition-colors"
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3.5"
                                >
                                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 4. Floating Reflection Layer */}
                    <div className="absolute inset-x-10 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-[2px] group-hover:blur-none" />
                </a>
            </div>
        </section>
    );
}
