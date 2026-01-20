"use client";

import React from "react";
import ContactCommandCenter from "@/components/contact/ContactCommandCenter";
import dynamic from "next/dynamic";
const ParticleGlobeScene = dynamic(() => import("@/components/contact/ParticleGlobeScene"), { ssr: false });
import { useCinematicTransitions } from "@/hooks/useCinematicTransitions";

export default function ContactPage() {
    // Preserve cinematic transitions for the page entry
    useCinematicTransitions();

    return (
        <main className="relative w-full min-h-screen text-white overflow-hidden flex flex-col lg:flex-row">
            
            {/* LEFT SIDE: THE COMMAND CENTER (FORM) */}
            <div className="w-full lg:w-1/2 relative z-10">
                <ContactCommandCenter />
            </div>

            {/* RIGHT SIDE: THE HOLOGRAPHIC VOID (3D) */}
            <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0 right-0 overflow-hidden">
                {/* Visual Depth Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-purple-900/10 via-transparent to-transparent opacity-50" />
                </div>
                
                {/* 3D Scene */}
                <div className="relative w-full h-full z-10">
                    <ParticleGlobeScene />
                </div>

                {/* Left Fade Overlay (for seamless split) */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09060f] to-transparent z-20 pointer-events-none" />
                
                {/* Top/Bottom Shims */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#09060f] to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09060f] to-transparent z-20 pointer-events-none" />
            </div>

            {/* Mobile Visual Background (Subtle) */}
            <div className="lg:hidden fixed inset-0 z-0 pointer-events-none">
                 <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
                 <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
            </div>
        </main>
    );
}

