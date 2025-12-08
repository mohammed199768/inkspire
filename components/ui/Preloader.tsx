"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState<{ left: string; top: string; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate particles only on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 20 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
        }));
        setParticles(newParticles);

        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Animated Logo */}
                    <motion.div
                        className="mb-8 relative w-48 h-48 md:w-64 md:h-64"
                        initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            filter: "blur(0px)",
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            duration: 0.8,
                            rotate: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                        <Image
                            src="/logos/Inkspire%20logos/Untitled-2-01.webp"
                            alt="Inkspire Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            priority
                            sizes="(max-width: 768px) 192px, 256px"
                        />
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Progress Text */}
                    <motion.p
                        className="mt-4 text-white/60 text-sm tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {progress}%
                    </motion.p>

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((p, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-purple-500 rounded-full"
                                style={{
                                    left: p.left,
                                    top: p.top,
                                }}
                                animate={{
                                    y: [0, -30, 0],
                                    opacity: [0.2, 1, 0.2],
                                }}
                                transition={{
                                    duration: p.duration,
                                    repeat: Infinity,
                                    delay: p.delay,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
