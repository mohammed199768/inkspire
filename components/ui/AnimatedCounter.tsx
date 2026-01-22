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
        <div ref={containerRef} className="counter-item p-4 sm:p-6 md:p-8 rounded-2xl hover:scale-[1.02] md:hover:scale-105 transition-all duration-500 cursor-default group relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[140px] md:min-h-[180px]
            bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))]
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.35)]
            before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(167,139,250,0.08),rgba(109,40,217,0.04))] before:opacity-100 before:pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 ref={countRef} className="text-4xl sm:text-5xl md:text-6xl font-black text-white/85 group-hover:text-white transition-colors mb-2 relative z-10">
                0{suffix}
            </h3>
            <p className="text-white/65 uppercase tracking-widest text-xs sm:text-sm font-semibold relative z-10 group-hover:text-white transition-colors">{label}</p>
        </div>
    );
}
