"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { Instagram, Facebook, Twitter, ExternalLink, Globe, ArrowLeft, Target, ShieldCheck, Zap, Maximize, Share2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- Specialized UI Components for "God Mode" ---

const RevealText = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
    <div className={`relative overflow-hidden ${className}`}>
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
        >
            {children}
        </motion.div>
    </div>
);

const MetaItem = ({ label, value, icon: Icon, delay }: { label: string, value: string, icon: any, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className="group flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-500"
    >
        <div className="mt-1 p-1.5 md:p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
            <Icon size={14} className="md:w-4 md:h-4" />
        </div>
        <div>
            <span className="block text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 mb-1 font-bold">{label}</span>
            <span className="block text-base md:text-lg font-bold tracking-tight text-white/90">{value}</span>
        </div>
    </motion.div>
);

const InteractiveImage = ({ src, alt, priority = false, className = "" }: { src: string, alt: string, priority?: boolean, className?: string }) => (
    <motion.div
        whileHover="hover"
        className={`relative overflow-hidden group/img ${className}`}
    >
        <motion.div
            variants={{
                hover: { scale: 1.05 }
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover opacity-90 group-hover/img:opacity-100 transition-opacity duration-700"
                priority={priority}
                quality={100}
            />
        </motion.div>
        {/* Shine Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-purple-500/10 via-transparent to-white/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
        {/* Border Glow */}
        <div className="absolute inset-0 border border-white/10 group-hover/img:border-purple-500/30 transition-colors duration-700 rounded-[inherit]" />
    </motion.div>
);

export default function ProjectPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const project = useMemo(() => getProjectBySlug(slug), [slug]);
    const { scrollYProgress } = useScroll();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        window.scrollTo(0, 0);
    }, []);

    if (!project) {
        notFound();
    }

    const {
        title,
        subtitle,
        description,
        coverImage,
        logo,
        gallery,
        clientName,
        year,
        services,
        links
    } = project;

    // Parallax values for decorative elements
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

    if (!isMounted) return <div className="min-h-screen bg-black" />;

    return (
        <main className="relative min-h-screen bg-[#020204] text-white selection:bg-purple-500/40 overflow-x-hidden">

            {/* --- Global Decorative Layer --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-soft-light" />
                <motion.div style={{ y: y1 }} className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[150px]" />
                <motion.div style={{ y: y2 }} className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            {/* --- TOP HUD: Navigation & Progress --- */}
            <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 flex justify-between items-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="pointer-events-auto"
                >
                    <Link href="/portfolio" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full bg-black/20 backdrop-blur-md group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-500">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] hidden md:block">Exit Archive</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-6 pointer-events-auto"
                >
                    <button
                        title="Share Project"
                        aria-label="Share Project"
                        className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full bg-black/20 backdrop-blur-md hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                    >
                        <Share2 size={18} />
                    </button>
                </motion.div>
            </nav>

            <div className="relative z-10 max-w-[1600px] mx-auto pt-32 md:pt-44 pb-32 px-6 md:px-12 lg:px-20">

                {/* --- HERO SECTION --- */}
                <header className="mb-20 lg:mb-40 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "80px" }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="h-1 bg-purple-500 mb-8 md:mb-10"
                        />
                        <div className="space-y-4">
                            <RevealText delay={0.2} className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black brand-font leading-[0.9] md:leading-[0.82] tracking-tighter italic uppercase">
                                {title}
                            </RevealText>
                            {subtitle && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className="flex items-center gap-3 md:gap-4 text-purple-400 font-medium font-outfit uppercase tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-xl"
                                >
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 animate-pulse" />
                                    {subtitle}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Unified Logo Plate */}
                    <div className="lg:col-span-4 flex justify-start lg:justify-end mt-8 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.8, type: "spring" }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 bg-[#0a0a0f] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 flex items-center justify-center overflow-hidden">
                                {logo ? (
                                    <Image src={logo} alt={`${title} Logo`} width={120} height={120} className="object-contain transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <span className="text-4xl md:text-6xl font-black text-purple-500/40 italic">{title[0]}</span>
                                )}
                                {/* HUD Decorative Lines */}
                                <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/20" />
                                <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/20" />
                                <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-white/20" />
                                <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-white/20" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-2 border border-dashed border-white/5 rounded-[2.5rem] md:rounded-[3rem] pointer-events-none"
                            />
                        </motion.div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

                    {/* --- LEFT: Information Hub --- */}
                    <div className="lg:col-span-5 space-y-16 lg:space-y-20">
                        {/* Summary */}
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <SectionTitle num="01" label="Mission Intel" />
                            <p className="text-lg md:text-3xl text-white/70 leading-relaxed font-light font-sans mt-8 border-l-2 border-purple-500/30 pl-6 md:pl-10 italic">
                                {description}
                            </p>
                        </motion.section>

                        {/* Intelligence Metrics */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MetaItem label="Strategic Patron" value={clientName || "Confidential"} icon={ShieldCheck} delay={0.4} />
                            <MetaItem label="Era Released" value={year || "Year Unknown"} icon={Target} delay={0.5} />
                            {services && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="col-span-full mt-4"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 block font-black">Augmented Services</span>
                                    <div className="flex flex-wrap gap-2">
                                        {services.map((s, i) => (
                                            <div key={i} className="px-4 py-2 md:px-6 md:py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs font-bold hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-md shadow-2xl flex items-center gap-2">
                                                <Zap size={10} className="text-purple-500" />
                                                {s.toUpperCase()}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </section>

                        {/* Action Command Nexus */}
                        {links && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="pt-10 flex flex-col sm:flex-row flex-wrap gap-6 md:gap-8 items-center"
                            >
                                {links.website && (
                                    <a
                                        href={links.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-full sm:w-auto px-10 py-5 md:px-12 md:py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.25em] overflow-hidden transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_70px_rgba(168,85,247,0.4)]"
                                    >
                                        <div className="absolute inset-0 bg-[#020204] translate-y-full group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)" />
                                        <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-4">
                                            Initiate Platform <Globe size={18} />
                                        </span>
                                    </a>
                                )}
                                <div className="flex items-center gap-4">
                                    {[
                                        { icon: Instagram, href: links.instagram, label: "Instagram" },
                                        { icon: ExternalLink, href: links.behance, label: "Behance" }
                                    ].map((social, i) => social.href && (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.label}
                                            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white/30 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500"
                                        >
                                            <social.icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* --- RIGHT: Media Archives --- */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Hero Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative group/mainimg"
                        >
                            <SectionTitle num="02" label="Visual Evidence" className="mb-6 md:mb-8" />
                            <div className="relative aspect-[16/10] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border border-white/10 group-hover/mainimg:border-purple-500/30 transition-colors duration-700">
                                <InteractiveImage
                                    src={coverImage || "/works/placeholder.webp"}
                                    alt={title}
                                    priority
                                    className="h-full w-full"
                                />
                                {/* Bottom HUD Label */}
                                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold tracking-widest text-white/60">
                                    <Maximize size={10} className="text-purple-500" /> FULL_HD_ARCHIVE_SRC
                                </div>
                            </div>
                        </motion.div>

                        {/* Gallery Mosaic Grid */}
                        {gallery && gallery.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {gallery.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                                        className={`rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl ${i % 3 === 0 ? 'md:col-span-2 aspect-[16/8]' : 'aspect-square'}`}
                                    >
                                        <InteractiveImage src={img} alt={`${title} Fragment ${i}`} className="h-full w-full" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Aesthetic Fine Grain Global */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light z-[1000]" />
        </main>
    );
}

// --- Internal Helper Components ---

function SectionTitle({ num, label, className = "" }: { num: string, label: string, className?: string }) {
    return (
        <div className={`flex items-center gap-3 md:gap-4 ${className}`}>
            <span className="text-purple-500 font-black text-xs md:text-sm italic">{num}</span>
            <div className="h-px w-6 md:w-10 bg-purple-500/30" />
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black text-white/30">{label}</span>
        </div>
    );
}
