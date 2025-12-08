"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePopup } from "@/hooks/usePopup";
import { X, Facebook, Instagram, Twitter, Linkedin, ExternalLink } from "lucide-react";
import Image from "next/image";

// Helper to render social icons if they exist
const SocialLink = ({ href, icon: Icon, label }: { href?: string; icon: any; label: string }) => {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white/5 rounded-full hover:bg-white/15 text-white/60 hover:text-purple-400 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-transparent hover:border-purple-500/30"
            aria-label={label}
        >
            <Icon size={20} className="stroke-[1.5]" />
        </a>
    );
};

export default function InsightPopup() {
    const { isOpen, currentPopup, closePopup } = usePopup();

    // Close on ESC
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
                    {/* Darker Overlay with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={closePopup}
                    />

                    {/* Card container */}
                    <motion.div
                        layoutId={currentPopup.id}
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
                        className="relative w-full max-w-5xl max-h-[85vh] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_60px_-15px_rgba(120,50,255,0.3)] overflow-hidden flex flex-col md:flex-row z-10 group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all duration-300 backdrop-blur-md border border-white/10 group-hover:rotate-90"
                            aria-label="Close popup"
                        >
                            <X size={20} />
                        </button>

                        {/* Left Side: Image (if available) */}
                        {currentPopup.imageUrl && (
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                                <Image
                                    src={currentPopup.imageUrl}
                                    alt={currentPopup.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-black/80 md:via-transparent md:to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                            </div>
                        )}

                        {/* Right Side: Content */}
                        <div className={`w-full ${currentPopup.imageUrl ? 'md:w-1/2' : 'w-full'} p-8 md:p-12 flex flex-col overflow-y-auto custom-scrollbar relative z-10`}>
                            {/* Header */}
                            <div className="mb-8 relative">
                                {currentPopup.source && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-purple-300 uppercase bg-purple-500/10 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 animate-pulse" />
                                        {currentPopup.source}
                                    </motion.span>
                                )}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight brand-font"
                                >
                                    {currentPopup.title}
                                </motion.h2>
                                {currentPopup.subtitle && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xl text-white/60 font-medium font-outfit"
                                    >
                                        {currentPopup.subtitle}
                                    </motion.p>
                                )}
                            </div>

                            {/* Divider with gradient */}
                            <div className="w-full h-px bg-gradient-to-r from-purple-500/50 via-white/10 to-transparent mb-8" />

                            {/* Body Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex-grow prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed space-y-4 font-light text-base md:text-lg"
                            >
                                <p>{currentPopup.description}</p>
                            </motion.div>

                            {/* Footer / Socials */}
                            {currentPopup.social && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-10 pt-8 flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-semibold">Connect</span>
                                        <div className="h-px w-12 bg-white/10" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <SocialLink href={currentPopup.social.facebookUrl} icon={Facebook} label="Facebook" />
                                        <SocialLink href={currentPopup.social.instagramUrl} icon={Instagram} label="Instagram" />
                                        <SocialLink href={currentPopup.social.twitterUrl} icon={Twitter} label="Twitter" />
                                        <SocialLink href={currentPopup.social.linkedinUrl} icon={Linkedin} label="LinkedIn" />
                                        <SocialLink href={currentPopup.social.behanceUrl} icon={ExternalLink} label="Behance" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
