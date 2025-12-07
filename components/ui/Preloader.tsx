"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
                        className="mb-8"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl font-black tracking-tighter brand-font"
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{
                                background: "linear-gradient(90deg, #ffffff, #f2e9ff, #6b4092, #404f96, #f2e9ff, #ffffff)",
                                backgroundSize: "300% 300%",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            INKSPIRE
                        </motion.h1>
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
