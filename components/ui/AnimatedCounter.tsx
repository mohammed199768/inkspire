"use client";

import { useRef } from "react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";

interface AnimatedCounterProps {
    value: string;
    label: string;
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
    const countRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { suffix } = useAnimatedCounter(containerRef, countRef, value);

    return (
        <div ref={containerRef} className="counter-item p-4 sm:p-6 md:p-8 bg-[#0B0F1A]/90 rounded-2xl border border-white/10 hover:bg-zinc-900/90 hover:scale-[1.02] md:hover:scale-105 hover:border-purple-500/30 transition-all duration-300 cursor-default group relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[140px] md:min-h-[180px]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 ref={countRef} className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 relative z-10">
                0{suffix}
            </h3>
            <p className="text-gray-400 uppercase tracking-widest text-xs sm:text-sm font-semibold relative z-10 group-hover:text-white transition-colors">{label}</p>
        </div>
    );
}
