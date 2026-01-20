"use client";

import { useState, useEffect } from "react";
import TunnelBackground from "./TunnelBackground";
import { motion, AnimatePresence } from "framer-motion";
import { usePageVisibility } from "@/hooks/usePageVisibility";

const sections = [
    {
        id: "hero",
        title: "Inkspire Studio",
        text: "Where ideas turn into stories that move people and build brands.",
        color: "text-cyan-400 shadow-cyan-400/50"
    },
    {
        id: "strategy",
        title: "Strategy First",
        text: "We don’t design for looks. We design for purpose, growth, and results.",
        color: "text-fuchsia-500 shadow-fuchsia-500/50"
    },
    {
        id: "impact",
        title: "Impact & Emotion",
        text: "Creativity isn’t noise. It’s emotion, meaning, and action built into every frame.",
        color: "text-yellow-400 shadow-yellow-400/50"
    }
];

export default function TunnelExperience() {
    const [currentSection, setCurrentSection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const isPageActive = usePageVisibility();

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isAnimating || !isPageActive) return;

            // Threshold to prevent accidental double-skips
            if (Math.abs(e.deltaY) < 50) return;

            if (e.deltaY > 0 && currentSection < sections.length - 1) {
                navigate(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                navigate(currentSection - 1);
            }
        };

        window.addEventListener("wheel", handleWheel);
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentSection, isAnimating]);

    const navigate = (nextIndex: number) => {
        setIsAnimating(true);
        setCurrentSection(nextIndex);
        // Allow time for the tunnel animation to do its "warp" transition
        // The tunnel animations take about 3s total, but visual impact is early.
        // We unlock input a bit earlier to feel responsive, but not too early.
        setTimeout(() => setIsAnimating(false), 2000);
    };

    return (
        <main className="w-full h-[100dvh] overflow-hidden bg-black text-white relative font-sans selection:bg-white/30">
            <TunnelBackground sectionIndex={currentSection} />

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 text-xs md:text-sm tracking-[0.2em] text-white/60 animate-bounce pointer-events-none select-none uppercase">
                Scroll to Travel
            </div>

            <AnimatePresence mode="wait">
                <motion.section
                    key={currentSection}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                >
                    <h1
                        className={`text-5xl md:text-8xl font-black uppercase tracking-widest mb-6 text-center transition-colors duration-500 ${sections[currentSection].color}`}
                        style={{ textShadow: `0 0 40px currentColor` }}
                    >
                        {sections[currentSection].title}
                    </h1>
                    <p className="text-lg md:text-2xl text-center text-gray-300 max-w-2xl px-6 leading-relaxed font-light tracking-wide">
                        {sections[currentSection].text}
                    </p>
                </motion.section>
            </AnimatePresence>

            {/* Navigation Indicators */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-30">
                {sections.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (!isAnimating && idx !== currentSection) navigate(idx);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-500 border border-white/40 cursor-pointer hover:border-white hover:scale-125 ${currentSection === idx ? 'bg-white scale-125 shadow-[0_0_15px_white]' : 'bg-transparent'}`}
                        aria-label={`Go to section ${idx + 1}`}
                    />
                ))}
            </div>
        </main>
    );
}
