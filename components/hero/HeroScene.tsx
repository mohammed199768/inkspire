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

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex flex-col justify-start md:justify-end items-center px-4 md:px-24 pb-0 pt-24 md:pt-0"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <CinematicRevealGrid />
                {/* Wave Transition - Magic Site Gradient Match */}
                {/* <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1 h-[160px] md:h-[260px] scale-x-[-1]">
                    <div className="hero-wave-container" />
                </div> */}
            </div>

            {/* Main Title Container with Glassmorphism */}
            <div ref={titleRef} className="relative z-30 flex flex-col items-center text-center max-w-[90vw] md:max-w-7xl mx-auto mb-0">
                {/* Premium Glass Box - Wider and slimmer */}
                <div className="relative px-8 md:px-16 py-8 md:py-10 rounded-[2rem] md:rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden w-full"
                     style={{ WebkitBackdropFilter: 'blur(30px)' }} // Explicit Safari fix
                >
                    {/* Atmospheric Glow inside glass */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 blur-[100px] pointer-events-none" />

                    {/* Main Heading (Promoted Tagline with Typewriter) */}
                    <h1 className="hero-tagline relative z-10 font-black leading-[1.3] drop-shadow-lg text-balance animated-gradient-text tracking-tighter text-[clamp(1.25rem,3.5vw,2.5rem)] uppercase">
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
                    {/* 1. Underlying Deep Aura */}
                    <div className="elite-cta-glow !bg-white/20 !blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* 2. Container with Animated Rotating Border */}
                    <div className="conic-border-wrap shadow-[0_0_50px_rgba(255,255,255,0.1)] !p-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent">
                        {/* 3. Main Glass Surface */}
                        <div 
                            className="relative flex items-center gap-6 px-12 py-6 md:px-16 md:py-8 bg-white/10 backdrop-blur-3xl rounded-full border border-white/30 group-hover:bg-white/20 transition-all duration-700 overflow-hidden will-change-transform"
                            style={{ 
                                WebkitBackdropFilter: 'blur(40px)',
                                transform: 'translateZ(0)'
                            }}
                        >
                            
                            {/* Inner Shine Swipe Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                            <span className="relative text-white font-black text-base md:text-lg uppercase tracking-[0.4em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:tracking-[0.5em] transition-all duration-700 italic">
                                {siteContent.hero.primaryCtaLabel}
                            </span>

                            {/* Minimalist Arrow Icon */}
                            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 group-hover:bg-white group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 shadow-xl">
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-black transition-colors"
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
