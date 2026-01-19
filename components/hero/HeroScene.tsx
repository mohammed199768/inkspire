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
            className="relative min-h-[100dvh] flex flex-col justify-center md:justify-end items-center pb-0 pt-16 md:pt-0 overflow-hidden"
            style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}
        >
            {/* 1. Images Row - Top on mobile, Background on desktop */}
            <div className="relative md:absolute inset-0 w-full h-auto md:h-full overflow-visible pointer-events-none z-10">
                <CinematicRevealGrid />
            </div>

            {/* Main Title Container with Glassmorphism */}
            <div ref={titleRef} className="relative z-30 flex flex-col items-center text-center max-w-[95vw] md:max-w-7xl mx-auto mb-0 mt-8 md:mt-0">
                {/* Premium Glass Box - Tightened and Safari Optimized */}
                <div className={`relative px-4 py-6 md:px-12 md:py-8 rounded-[2rem] md:rounded-[4rem] border shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-full ${
                    isSafari ? 'safari-no-backdrop premium-glass-performance' : 'border-white/10 bg-[#0a0a0f]/40'
                }`}
                     style={!isSafari ? { 
                         backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                         backgroundBlendMode: 'overlay',
                         backdropFilter: 'blur(10px)',
                         WebkitBackdropFilter: 'blur(10px)'
                     } : {}}
                >
                    {/* Atmospheric Glow inside glass - Reduced for Safari */}
                    <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/5 ${isSafari ? 'blur-[60px]' : 'blur-[100px]'} pointer-events-none`} />
                    <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 ${isSafari ? 'blur-[60px]' : 'blur-[100px]'} pointer-events-none`} />

                    {/* Main Heading (Promoted Tagline with Typewriter) */}
                    <h1 className="hero-tagline relative z-10 font-black leading-[1.3] drop-shadow-lg text-balance animated-gradient-text tracking-tighter uppercase"
                        style={{ fontSize: 'var(--fs-h2)' }}
                    >
                        <TypewriterText 
                            text="From ink we started, to make people Inkspired." 
                            speed={35}
                            delay={1500}
                        />
                    </h1>
                </div>

                {/* Elite CTA Button */}
                <a
                    ref={ctaRef}
                    href={siteContent.hero.primaryCtaHref}
                    className="group relative mt-2 md:mt-4 block interactive z-[60]" 
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
