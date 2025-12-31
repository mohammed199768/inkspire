"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePopup } from "@/hooks/usePopup";
import { X, Facebook, Instagram, Twitter, Linkedin, ExternalLink, Zap, Target, Layers } from "lucide-react";
import Image from "next/image";

// --- Premium UI Support Components ---

const GlassCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const classes = {
        tl: "top-0 left-0 border-t border-l rounded-tl-2xl",
        tr: "top-0 right-0 border-t border-r rounded-tr-2xl",
        bl: "bottom-0 left-0 border-b border-l rounded-bl-2xl",
        br: "bottom-0 right-0 border-b border-r rounded-br-2xl",
    };
    return (
        <div className={`absolute w-8 h-8 border-white/20 z-20 pointer-events-none ${classes[position]}`} />
    );
};

const SocialLink = ({ href, icon: Icon, label }: { href?: string; icon: any; label: string }) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:bg-purple-500/10 shadow-lg"
            aria-label={label}
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Icon size={18} className="text-white/40 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-500 relative z-10" />
        </a>
    );
};

export default function InsightPopup() {
    const { isOpen, currentPopup, closePopup } = usePopup();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closePopup();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, closePopup]);

    return (
        <AnimatePresence>
            {isOpen && currentPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">

                    {/* Cinematic Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl overflow-hidden"
                        onClick={closePopup}
                    >
                        {/* Animated Grain/Noise for Texture */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                        {/* Ambient Glows */}
                        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />
                    </motion.div>

                    {/* Main Popup: Beast Mode UI */}
                    <motion.div
                        layoutId={currentPopup.id}
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: "spring", damping: 28, stiffness: 350 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-[#050507]/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row z-10 group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative HUD Elements */}
                        <GlassCorner position="tl" />
                        <GlassCorner position="tr" />
                        <GlassCorner position="bl" />
                        <GlassCorner position="br" />

                        {/* Animated Floating Glow Border */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 pointer-events-none" />

                        {/* Technical Close Button */}
                        <button
                            onClick={closePopup}
                            aria-label="Close Case Study"
                            className="absolute top-6 right-6 z-50 p-2 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-lg group/close"
                        >
                            <X size={20} className="group-hover/close:rotate-90 transition-transform duration-500" />
                        </button>

                        {/* --- LEFT: Visual Intel --- */}
                        {currentPopup.imageUrl && (
                            <div className="w-full md:w-[45%] h-56 sm:h-72 md:h-auto relative overflow-hidden bg-zinc-950 border-b md:border-b-0 md:border-r border-white/5">
                                <Image
                                    src={currentPopup.imageUrl}
                                    alt={currentPopup.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 scale-[1.01] group-hover:scale-105"
                                    quality={100}
                                    priority
                                />
                                {/* Dynamic Overlays */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent md:hidden" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#050507] hidden md:block" />

                                {/* Technical HUD Scanning Line (Subtle) */}
                                <div className="absolute inset-x-0 top-0 h-px bg-white/20 animate-scanline pointer-events-none opacity-40" />
                            </div>
                        )}

                        {/* --- RIGHT: Content Core --- */}
                        <div className={`w-full ${currentPopup.imageUrl ? 'md:w-[55%]' : 'w-full'} flex flex-col relative min-h-0`}>

                            {/* Technical Header Area */}
                            <div className="px-6 pt-10 md:px-14 md:pt-14 relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px w-6 md:w-8 bg-purple-500" />
                                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-purple-400 uppercase">
                                        Project Insight // {currentPopup.source || "Featured"}
                                    </span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-2 leading-[1] md:leading-[0.9] brand-font tracking-tighter">
                                    {currentPopup.title}
                                </h2>
                                {currentPopup.subtitle && (
                                    <p className="text-sm md:text-xl text-white/40 font-medium font-outfit uppercase tracking-[0.15em] md:tracking-widest mt-1 md:mt-2">
                                        {currentPopup.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Scrollable Intelligence Body */}
                            <div className="flex-1 overflow-y-auto px-6 md:px-14 py-6 md:py-8 custom-scrollbar relative z-10">
                                <div className="text-white/70 text-base md:text-xl leading-relaxed font-light font-sans max-w-2xl border-l-2 border-purple-500/20 pl-4 md:pl-6 py-2">
                                    {currentPopup.description}
                                </div>

                                {/* Dynamic Service Chips */}
                                {currentPopup.tags && (
                                    <div className="flex flex-wrap gap-2 mt-8 md:mt-10">
                                        {currentPopup.tags.map((tag, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-[11px] font-bold text-white/40 hover:text-white hover:border-purple-500/40 transition-all cursor-default group/tag backdrop-blur-sm">
                                                <Target size={10} className="text-purple-500/60 group-hover/tag:scale-110 transition-transform" />
                                                {tag.toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer: Action nexus */}
                            <div className="px-6 pb-8 md:px-14 md:pb-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8 z-20 mt-auto">

                                <div className="flex flex-col gap-3 w-full sm:w-auto items-center sm:items-start">
                                    <span className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase">Connect Protocol</span>
                                    <div className="flex items-center gap-2">
                                        <SocialLink href={currentPopup.social?.facebookUrl} icon={Facebook} label="FB" />
                                        <SocialLink href={currentPopup.social?.instagramUrl} icon={Instagram} label="IG" />
                                        <SocialLink href={currentPopup.social?.twitterUrl} icon={Twitter} label="TW" />
                                        <SocialLink href={currentPopup.social?.linkedinUrl} icon={Linkedin} label="LI" />
                                        <SocialLink href={currentPopup.social?.behanceUrl} icon={ExternalLink} label="BE" />
                                    </div>
                                </div>

                                {currentPopup.projectSlug && (
                                    <a
                                        href={`/portfolio/${currentPopup.projectSlug}`}
                                        className="w-full sm:w-auto relative group/btn flex items-center justify-center gap-3 px-8 py-4 md:px-12 md:py-5 bg-white text-black overflow-hidden rounded-xl transition-all duration-300 active:scale-95"
                                        onClick={closePopup}
                                    >
                                        {/* Cinematic Button Hover Effect */}
                                        <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />

                                        <span className="relative z-10 font-bold text-xs md:text-sm uppercase tracking-wider group-hover/btn:text-white transition-colors duration-300">
                                            Explore Full Case Study
                                        </span>
                                        <Layers size={16} className="relative z-10 group-hover/btn:text-white transition-colors duration-300 group-hover/btn:rotate-12 transition-transform" />
                                    </a>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(168, 85, 247, 0.2);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(168, 85, 247, 0.5);
                }
            `}</style>
        </AnimatePresence>
    );
}