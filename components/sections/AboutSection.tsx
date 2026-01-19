"use client";

import { ArrowRight } from "lucide-react";
import { useGSAPFade } from "@/hooks/useGSAPFade";

export default function AboutSection() {
    const containerRef = useGSAPFade();

    return (
        <div ref={containerRef} className="w-full min-h-[100dvh] flex items-center justify-center py-10 px-4 md:px-12 relative z-10">
            <div className="w-full max-w-[1600px] mx-auto bg-[#0E1324]/90 border border-white/10 rounded-[2.5rem] p-10 md:p-14 lg:p-20 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="fade-up">
                        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white">
                            Inspired by <span className="text-purple-500">Ink</span>
                        </h2>
                        <div className="space-y-8 max-w-xl">
                            <p className="text-xl md:text-2xl text-white font-bold leading-tight">
                                we craft brands with intention every line, every word, every visual.
                            </p>
                            <p className="text-lg text-white leading-relaxed font-medium">
                                Inkspire is a creative studio built on intuition, emotion, and strategy. 
                                We turn blank pages into brands with identity, businesses into stories with meaning, and social feeds into experiences people actually engage with.
                                <br /><br />
                                Whether you’re launching something new, leveling up your brand, or searching for content that finally feels right, you’re in the perfect place.
                            </p>
                        </div>
                    </div>
                    <div className="fade-up relative rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20 aspect-video lg:aspect-square xl:aspect-video grayscale hover:grayscale-0 transition-all duration-700 w-full group">
                        <video
                            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                            src="/1_2.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
