"use client";

import { useGSAPFade } from "@/hooks/useGSAPFade";
import SectionTitle from "@/components/ui/SectionTitle";

export default function AboutSection() {
    const containerRef = useGSAPFade();

    return (
        <section 
            ref={containerRef} 
            className="scroll-mt-24 w-full min-h-[100svh] flex flex-col items-center justify-start pt-12 sm:pt-14 md:pt-16 pb-8 px-4 md:px-6 relative isolate z-10 overflow-visible"
        >
            {/* 1. Precise Title Layer - Tightened Spacing */}
            <div className="relative z-50 mb-2 md:mb-4 isolate">
                <SectionTitle 
                    title="About" 
                    highlight="Us" 
                    highlightColor="text-accentPurple"
                    className="!mb-0 !opacity-100 !visible" 
                />
            </div>

            {/* 2. Responsive Content Card - Width controlled for cinematic focus */}
            <div className="w-full md:w-[min(90vw,900px)] lg:w-[min(70vw,1100px)] -translate-y-2 md:-translate-y-4 mx-auto border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-[clamp(1.25rem,4vw,3.5rem)] relative overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar
                bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))]
                shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.45)]
                before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(167,139,250,0.08),rgba(109,40,217,0.04))] before:opacity-100 before:pointer-events-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    
                    {/* Text Column - Calibrated Typography */}
                    <div className="fade-up space-y-4 md:space-y-6 text-left">
                        <h3 className="font-bold tracking-tight text-white/90 leading-tight" style={{ fontSize: 'var(--fs-h3)' }}>
                            Inspired by <span className="text-accentPurple">Ink</span>
                        </h3>
                        
                        <div className="space-y-4 md:space-y-5 max-w-xl">
                            <p className="text-white/90 font-bold leading-tight" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                                we craft brands with intention every line, every word, every visual.
                            </p>
                            <p className="text-white/65 leading-relaxed font-medium" style={{ fontSize: 'var(--fs-body)' }}>
                                Inkspire is a creative studio built on intuition, emotion, and strategy. 
                                We turn blank pages into brands with identity, businesses into stories with meaning, and social feeds into experiences people actually engage with.
                                <br /><br className="hidden md:block"/>
                                Whether you’re launching something new, leveling up your brand, level of search, you’re in the perfect place.
                            </p>
                        </div>
                    </div>

                    {/* Video Column - Aspect-controlled for mobile density */}
                    <div className="fade-up relative rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-2xl shadow-purple-900/10 aspect-video lg:aspect-square xl:aspect-video grayscale hover:grayscale-0 transition-all duration-700 w-full group isolate max-h-[25vh] lg:max-h-none">
                        <video
                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                            src="/1_2.webm"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09060f]/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 border border-white/5 rounded-[1rem] md:rounded-[1.5rem] pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
