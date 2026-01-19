"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Mail, MapPin, Phone, Send, CheckCircle, 
    ArrowRight 
} from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { services } from "@/data/staticData";

export default function ContactCommandCenter() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        service: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => setIsSubmitted(true), 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
    };

    return (
        <div className="w-full relative z-10 flex flex-col justify-center p-6 md:p-12 lg:p-24 xl:p-32 overflow-y-auto min-h-screen">
            
            {/* Scanline Effect on the left side too for consistency */}
            <div className="scan-line opacity-[0.03] pointer-events-none" />

            {/* Header Content */}
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16 mt-20 lg:mt-0"
            >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono mb-10 tracking-[0.2em]">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                    SYSTEMS READY / ACCEPTING MISSIONS
                </div>
                <h1 className="text-cinematic-xl font-black mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-100 to-white/20">
                    LET'S TALK <br /> <span className="text-purple-500">FUTURE.</span>
                </h1>
                <p className="text-gray-400 text-xl md:text-2xl max-w-xl leading-relaxed font-light">
                    Ready to build something impossible? Fill out the intel below and we'll initiate the launch sequence.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    <motion.form 
                        key="contact-form"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.95 }}
                        onSubmit={handleSubmit}
                        className="space-y-16 max-w-3xl"
                    >
                        {/* 1. Identity Section */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="relative group">
                                <label className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 block transition-colors ${activeField === 'name' ? 'text-purple-400' : 'text-gray-500'}`}>01. Operator Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name..."
                                    className="w-full bg-transparent border-b border-white/10 py-5 text-2xl md:text-3xl focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/5 font-light"
                                    onFocus={() => setActiveField('name')}
                                    onBlur={() => setActiveField(null)}
                                    value={formState.name}
                                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                                    required
                                />
                                <div className={`absolute bottom-0 left-0 h-[2px] bg-purple-500 transition-all duration-700 ease-out ${activeField === 'name' ? 'w-full' : 'w-0'}`} />
                            </div>
                            <div className="relative group">
                                <label className={`text-xs font-mono uppercase tracking-[0.3em] mb-4 block transition-colors ${activeField === 'email' ? 'text-purple-400' : 'text-gray-500'}`}>02. Comms Channel</label>
                                <input 
                                    type="email" 
                                    placeholder="your@intel.com"
                                    className="w-full bg-transparent border-b border-white/10 py-5 text-2xl md:text-3xl focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/5 font-light"
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    value={formState.email}
                                    onChange={(e) => setFormState({...formState, email: e.target.value})}
                                    required
                                />
                                <div className={`absolute bottom-0 left-0 h-[2px] bg-purple-500 transition-all duration-700 ease-out ${activeField === 'email' ? 'w-full' : 'w-0'}`} />
                            </div>
                        </motion.div>

                        {/* 2. Service Selection */}
                        <motion.div variants={itemVariants}>
                            <label className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-8 block font-semibold">03. Select Mission Objective</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {services.slice(0, 3).map((s, idx) => (
                                    <ServiceCard 
                                        key={idx} 
                                        {...s} 
                                        selected={formState.service === s.title}
                                        onClick={() => setFormState({...formState, service: s.title})}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* 4. Message */}
                        <motion.div variants={itemVariants} className="relative">
                            <label className={`text-xs font-mono uppercase tracking-[0.3em] mb-6 block transition-colors ${activeField === 'msg' ? 'text-purple-400' : 'text-gray-500'}`}>04. Intelligence Briefing</label>
                            <textarea 
                                rows={5}
                                placeholder="Describe the mission parameters and objectives..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-xl md:text-2xl focus:outline-none focus:border-purple-500 focus:bg-white/[0.06] transition-all placeholder:text-white/5 resize-none shadow-2xl font-light"
                                onFocus={() => setActiveField('msg')}
                                onBlur={() => setActiveField(null)}
                                value={formState.message}
                                onChange={(e) => setFormState({...formState, message: e.target.value})}
                                required
                            />
                        </motion.div>

                        {/* 5. Submit Button */}
                        <motion.button 
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="group relative w-full py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-xs md:text-sm overflow-hidden rounded-2xl transition-all duration-500 shadow-[0_30px_60px_rgba(255,255,255,0.05)] hover:shadow-purple-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out opacity-10" />
                            <span className="relative z-10 flex items-center justify-center gap-4 transition-all group-hover:gap-8">
                                INITIALIZE MISSION <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                            </span>
                        </motion.button>
                    </motion.form>
                ) : (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-purple-500/5 border border-purple-500/10 p-16 md:p-24 rounded-[3rem] text-center max-w-2xl mx-auto relative overflow-hidden backdrop-blur-xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
                        <div className="w-24 h-24 bg-purple-500 text-black rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12 shadow-[0_0_60px_rgba(160,160,255,0.3)]">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">TRANSMISSION COMPLETE.</h3>
                        <p className="text-gray-400 text-xl md:text-2xl leading-relaxed mb-12 font-light">
                            Our strategic team is analyzing your intel. Expect contact within 24 hours. Stand by.
                        </p>
                        <button 
                            onClick={() => setIsSubmitted(false)}
                            className="px-10 py-4 rounded-full border border-purple-500/20 text-purple-400 text-xs font-mono tracking-[0.3em] hover:bg-purple-500 hover:text-white transition-all uppercase"
                        >
                            INITIATE NEW TRANSMISSION
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Footer / Status Bars */}
            <div className="mt-24 flex flex-wrap gap-x-16 gap-y-8 text-[12px] text-gray-500 font-mono border-t border-white/5 pt-16 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-4 hover:text-purple-400 transition-all duration-500 cursor-pointer group">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-purple-500/10 transition-colors border border-white/5 group-hover:border-purple-500/20">
                        <Mail size={16} />
                    </div>
                    hello@inkspire.agency
                </div>
                <div className="flex items-center gap-4 hover:text-purple-400 transition-all duration-500 cursor-pointer group">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-purple-500/10 transition-colors border border-white/5 group-hover:border-purple-500/20">
                        <MapPin size={16} />
                    </div>
                    GLOBAL / AMMAN
                </div>
                <div className="flex items-center gap-4 hover:text-purple-400 transition-all duration-500 cursor-pointer group">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-purple-500/10 transition-colors border border-white/5 group-hover:border-purple-500/20">
                        <Phone size={16} />
                    </div>
                    +962 779 667 168
                </div>
            </div>
        </div>
    );
}

