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
        <div ref={containerRef} className="counter-item p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:scale-105 hover:border-purple-500/30 transition-all duration-300 cursor-default group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 ref={countRef} className="text-5xl md:text-6xl font-black text-white mb-2 relative z-10">
                0{suffix}
            </h3>
            <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold relative z-10 group-hover:text-white transition-colors">{label}</p>
        </div>
    );
}
