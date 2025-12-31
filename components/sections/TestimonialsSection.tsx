"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGSAPFade } from "@/hooks/useGSAPFade";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";

// Data Structure
import { useRouter } from "next/navigation";
import { HIGHLIGHTS } from "@/data/stories";

const IMG_DURATION = 4500;

export default function TestimonialsSection() {
    const containerRef = useGSAPFade();
    const router = useRouter();
    const [activeClient, setActiveClient] = useState<number | null>(null);
    const [activeStory, setActiveStory] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [seen, setSeen] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close stories
    const closeStories = useCallback(() => {
        if (activeClient !== null) {
            setSeen(prev => new Set(prev).add(HIGHLIGHTS[activeClient].id));
        }
        setActiveClient(null);
        setActiveStory(0);
        setIsPaused(false);
    }, [activeClient]);

    // Next story logic
    const nextStory = useCallback(() => {
        if (activeClient === null) return;
        const currentHighlight = HIGHLIGHTS[activeClient];
        if (activeStory < currentHighlight.stories.length - 1) {
            setActiveStory(prev => prev + 1);
        } else {
            if (activeClient < HIGHLIGHTS.length - 1) {
                setSeen(prev => new Set(prev).add(HIGHLIGHTS[activeClient].id));
                setActiveClient(activeClient + 1);
                setActiveStory(0);
            } else {
                closeStories();
            }
        }
    }, [activeClient, activeStory, closeStories]);

    // Prev story logic
    const prevStory = useCallback(() => {
        if (activeStory > 0) {
            setActiveStory(prev => prev - 1);
        } else if (activeClient !== null && activeClient > 0) {
            setActiveClient(activeClient - 1);
            setActiveStory(HIGHLIGHTS[activeClient - 1].stories.length - 1);
        }
    }, [activeClient, activeStory]);

    // Timer logic
    useEffect(() => {
        if (activeClient !== null && !isPaused) {
            timerRef.current = setTimeout(nextStory, IMG_DURATION);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [activeClient, activeStory, isPaused, nextStory]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeClient === null) return;
            if (e.key === "Escape") closeStories();
            if (e.key === "ArrowRight") nextStory();
            if (e.key === "ArrowLeft") prevStory();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeClient, closeStories, nextStory, prevStory]);

    // Robust Body Scroll Lock
    useEffect(() => {
        if (activeClient !== null) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none"; // Extra lock for mobile
            return () => {
                document.body.style.overflow = originalStyle;
                document.body.style.touchAction = "";
            };
        }
    }, [activeClient]);

    const renderModal = () => {
        if (!mounted || activeClient === null) return null;

        return createPortal(
            <AnimatePresence>
                <div
                    className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden overscroll-none touch-none bg-black md:bg-black/60 md:backdrop-blur-3xl"
                    onClick={closeStories}
                >
                    {/* Cinematic Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 cursor-pointer"
                    />

                    {/* Story Card Wrapper */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full h-[100dvh] md:w-[410px] md:h-[85vh] md:max-h-[850px] md:aspect-[9/16] bg-black md:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] md:border md:border-white/10"
                        onMouseDown={() => setIsPaused(true)}
                        onMouseUp={() => setIsPaused(false)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >
                        {/* Media Layer */}
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                            <motion.img
                                key={`${activeClient}-${activeStory}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                src={HIGHLIGHTS[activeClient].stories[activeStory].src}
                                alt="Story Content"
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 pointer-events-none" />
                        </div>

                        {/* Top UI Overlay */}
                        <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 pt-10 md:pt-8 bg-gradient-to-b from-black/80 to-transparent pb-12">
                            {/* Progress Bars */}
                            <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6">
                                {HIGHLIGHTS[activeClient].stories.map((_, i) => (
                                    <div key={i} className="flex-1 h-[2px] md:h-[3px] bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                        <div
                                            className={`h-full bg-white transition-all linear shadow-[0_0_8px_rgba(255,255,255,0.4)]
                                                ${i <= activeStory ? 'w-full opacity-100' : 'w-0 opacity-30'}
                                                ${i === activeStory ? (isPaused ? 'duration-[99999s]' : 'duration-[4500ms]') : 'duration-0'}
                                            `}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Header Info */}
                            <div className="flex items-center justify-between gap-3 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="p-[2px] bg-gradient-to-tr from-[#f09433] to-[#bc1888] rounded-full shadow-lg">
                                        <img
                                            src={HIGHLIGHTS[activeClient].avatar}
                                            className="w-9 h-9 md:w-11 md:h-11 rounded-full border border-black/20 object-cover"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[14px] md:text-[15px] font-bold tracking-wide drop-shadow-md leading-tight">{HIGHLIGHTS[activeClient].name}</p>
                                        <p className="text-[11px] md:text-[12px] text-white/80 font-medium drop-shadow-sm">{HIGHLIGHTS[activeClient].sub}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); closeStories(); }}
                                    className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-90 backdrop-blur-xl rounded-full transition-all border border-white/5 relative z-[60]"
                                    aria-label="Close"
                                >
                                    <X size={20} className="drop-shadow-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Stealth Navigation Zones */}
                        <div className="absolute inset-0 z-30 flex">
                            <div
                                className="w-[35%] h-full cursor-pointer touch-manipulation active:bg-white/5 transition-colors"
                                onClick={(e) => { e.stopPropagation(); prevStory(); }}
                            />
                            <div className="flex-1 h-full" />
                            <div
                                className="w-[35%] h-full cursor-pointer touch-manipulation active:bg-white/5 transition-colors"
                                onClick={(e) => { e.stopPropagation(); nextStory(); }}
                            />
                        </div>

                        {/* Tag & Action Overlay */}
                        <div className="absolute bottom-[env(safe-area-inset-bottom,30px)] left-0 right-0 z-40 flex flex-col items-center gap-4 px-4 mb-4 md:mb-8">
                            <motion.div
                                key={`tag-${activeClient}-${activeStory}`}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-6 py-2.5 rounded-full bg-black/30 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                            >
                                <span className="text-[12px] font-bold text-white tracking-widest uppercase">
                                    {HIGHLIGHTS[activeClient].stories[activeStory].tag}
                                </span>
                            </motion.div>

                            {HIGHLIGHTS[activeClient].projectSlug && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const slug = HIGHLIGHTS[activeClient].projectSlug;
                                        closeStories();
                                        router.push(`/portfolio/${slug}`);
                                    }}
                                    className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
                                >
                                    <Info size={18} />
                                    View Project
                                </motion.button>
                            )}
                        </div>
                    </motion.div>

                    {/* Cinematic Navigation Arrows */}
                    <div className="hidden lg:flex absolute inset-0 items-center justify-between px-20 pointer-events-none z-[100]">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -8 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); prevStory(); }}
                            className={`w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center text-white pointer-events-auto transition-all shadow-2xl ${activeClient === 0 && activeStory === 0 ? "opacity-10 cursor-not-allowed" : "opacity-100"}`}
                        >
                            <ChevronLeft size={28} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, x: 8 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); nextStory(); }}
                            className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center text-white pointer-events-auto transition-all shadow-2xl"
                        >
                            <ChevronRight size={28} />
                        </motion.button>
                    </div>
                </div>
            </AnimatePresence>,
            document.body
        );
    };

    return (
        <div ref={containerRef} className="min-h-[70vh] flex flex-col justify-center py-16 md:py-24 px-4 md:px-6 relative z-10" dir="ltr">
            <SectionTitle title="Client" highlight="Stories" highlightColor="text-yellow-400" />

            {/* Highlights Row */}
            <div className="max-w-6xl mx-auto w-full flex gap-4 md:gap-10 overflow-x-auto pb-8 md:pb-12 scrollbar-none px-2 md:px-4 justify-start md:justify-center items-center -mx-4 md:mx-auto">
                {HIGHLIGHTS.map((client, idx) => (
                    <button
                        key={client.id}
                        onClick={() => setActiveClient(idx)}
                        className="flex flex-col items-center gap-3 md:gap-4 group flex-shrink-0"
                        aria-label={`Watch ${client.name} stories`}
                        title={client.name}
                    >
                        <div className={`ring-container p-[3px] md:p-[4px] rounded-full transition-all duration-500 group-hover:scale-105 active:scale-95
                            ${seen.has(client.id) ? "seen opacity-50" : "unseen"}`}
                        >
                            <div className="w-[75px] h-[75px] md:w-[110px] md:h-[110px] rounded-full bg-black p-[2px] md:p-[3px] overflow-hidden relative">
                                <img
                                    src={client.avatar}
                                    alt={client.name}
                                    className="w-full h-full rounded-full object-cover transition-all duration-700 brightness-110 group-hover:brightness-125"
                                />
                                {seen.has(client.id) && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                                )}
                            </div>
                        </div>
                        <span className={`text-[12px] md:text-[14px] font-semibold tracking-wide transition-all duration-300 ${seen.has(client.id) ? "text-gray-500" : "text-gray-300 group-hover:text-white"}`}>
                            {client.name}
                        </span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center mt-4 text-gray-400 md:text-gray-500 gap-4 opacity-70 hover:opacity-100 transition-all duration-500 hidden md:flex">
                <div className="flex gap-4 flex-wrap justify-center">
                    <div className="flex items-center gap-2 text-[12px] border border-white/10 bg-white/5 pr-4 pl-3 py-2 rounded-full backdrop-blur-md">
                        <Info size={14} className="text-yellow-400" />
                        <span>Tap circles to view stories</span>
                    </div>
                    <span className="text-[12px] border border-white/10 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">Left/Right to navigate</span>
                    <span className="text-[12px] border border-white/10 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">Hold to pause</span>
                </div>
            </div>

            {renderModal()}

            <style jsx>{`
                .ring-container {
                    position: relative;
                }
                .ring-container.unseen {
                    background: conic-gradient(from 180deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888, #f09433);
                    box-shadow: 0 12px 35px rgba(220, 39, 67, 0.35);
                }
                .ring-container.seen {
                    background: rgba(255, 255, 255, 0.15);
                }
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @media (max-width: 768px) {
                    .ring-container.unseen {
                        box-shadow: 0 8px 20px rgba(220, 39, 67, 0.25);
                    }
                }
            `}</style>
        </div>
    );
}
