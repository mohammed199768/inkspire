// ============================================================================
// ARCHITECTURAL INTENT: Page Loading Screen
// ============================================================================
// Blocks interaction until page resources are loaded.
//
// LOADING PATTERN:
// - Simulated progress bar (not real asset loading)
// - Increments by 10% every 20ms = ~200ms total duration
// - Fast enough to not annoy users, slow enough to show brand
//
// VISUAL ELEMENTS:
// - Animated logo with glow effects
// - Progress bar with gradient
// - Floating particles (respects prefers-reduced-motion)
//
// ACCESSIBILITY:
// - Reduces particle count if prefers-reduced-motion
// - Still functional, just less visually busy
//
// TRADE-OFF NOTES:
// - Uses setInterval (cleanup via clearInterval)
// - AnimatePresence exit animation (Framer Motion handles cleanup)
// - No real asset tracking (could enhance with window.load listener)
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number; size: number }[]>([]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Generate fewer particles if reduced motion is requested
        const particleCount = prefersReducedMotion ? 5 : 20;

        const newParticles = Array.from({ length: particleCount }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: prefersReducedMotion ? 5 : (2 + Math.random() * 3),
            delay: Math.random() * 2,
            size: Math.random() * 3 + 1,
        }));
        setParticles(newParticles);

        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 300); // Even faster exit
                    return 100;
                }
                return prev + 10; // Significantly faster progress
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black overflow-hidden px-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Animated Logo Container */}
                    <motion.div
                        className="mb-8 md:mb-12 relative w-full max-w-[280px] sm:max-w-md aspect-square flex items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            filter: "blur(0px)",
                        }}
                        transition={{
                            duration: 1.2,
                            ease: "easeOut"
                        }}
                    >
                        {/* Magical Glow Behind Logo */}
                        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-[60px] md:blur-[100px] animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/20 rounded-full blur-[40px] md:blur-[60px] animate-pulse delay-75" />

                        <div className="relative w-full h-full p-8 sm:p-12">
                            <Image
                                src="/logos/Inkspire logos/logo.webp"
                                alt="Inkspire Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                priority
                                quality={85}
                                sizes="(max-width: 768px) 200px, 400px"
                            />
                        </div>
                    </motion.div>

                    {/* Progress Bar Container */}
                    <div className="relative group">
                        {/* External Glow for Progress Bar (not clipped) */}
                        <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full opacity-50" />
                        <div className="relative w-48 sm:w-64 h-1 md:h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>
                    </div>

                    {/* Progress Text */}
                    <motion.div
                        className="mt-6 flex flex-col items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="text-white/80 text-sm md:text-lg font-light tracking-[0.3em] md:tracking-[0.5em] uppercase">Loading</span>
                        <span className="text-purple-400 text-[10px] md:text-xs tracking-widest mt-1">{progress}%</span>
                    </motion.div>

                    {/* Magical Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((p, i) => (
                            <motion.div
                                key={i}
                                className="absolute bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                style={{
                                    left: p.left,
                                    top: p.top,
                                    width: p.size,
                                    height: p.size,
                                }}
                                animate={{
                                    y: [0, -40, 0],
                                    opacity: [0, 0.8, 0],
                                    scale: [0.5, 1.2, 0.5],
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
