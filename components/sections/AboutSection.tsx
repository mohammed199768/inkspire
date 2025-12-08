"use client";

import { ArrowRight } from "lucide-react";
import { useGSAPFade } from "@/hooks/useGSAPFade";

export default function AboutSection() {
    const containerRef = useGSAPFade();

    return (
        <div ref={containerRef} className="lg:min-h-screen flex items-center py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="fade-up will-change-transform">
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Inspired by <span className="text-purple-500">Ink</span>
                    </h2>
                    <p className="text-xl text-white mb-8 leading-relaxed font-bold">
                        we craft brands with intention every line, every word, every visual.
                    </p>
                    <p className="text-xl text-white mb-8 leading-relaxed font-bold">
                        Inkspire is a creative studio built on intuition, emotion, and strategy.
                        We turn blank pages into brands with identity, businesses into stories with meaning, and social feeds into experiences people actually engage with.<br />
                        Whether you’re launching something new, leveling up your brand, or searching for content that finally feels right, you’re in the perfect place.
                    </p>
                    <button className="px-8 py-4 bg-white/10 text-black font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
                        Learn More <ArrowRight size={20} />
                    </button>
                </div>
                <div className="fade-up will-change-transform relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/20 aspect-video">
                    <video
                        className="w-full h-full object-cover"
                        src="/1_2.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
