"use client";

import { useNineDimensionsController } from "@/hooks/useNineDimensionsController";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import NineDimensionsBackground from "./NineDimensionsBackground";
import NineDimensionsHUD from "./NineDimensionsHUD";

// Import mapping sections
import HeroScene from "@/components/hero/HeroScene";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
// Heavy sections dynamic
const SelectedWorkSection = dynamic(() => import("@/components/sections/SelectedWorkSection"));
const TeamSection = dynamic(() => import("@/components/sections/TeamSection"));
const ClientsMarquee = dynamic(() => import("@/components/sections/ClientsMarquee"));
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

// Define the 9 sections in order
const SECTIONS = [
    { id: 'genesis', component: <HeroScene /> },         // 0: Genesis (Chaos)
    { id: 'tunnel', component: <StatsSection /> },       // 1: Tunnel
    { id: 'sphere', component: <AboutSection /> },       // 2: Sphere
    { id: 'cube', component: <ServicesSection /> },      // 3: Cube
    { id: 'helix', component: <SelectedWorkSection /> }, // 4: Helix
    { id: 'grid', component: <TeamSection /> },          // 5: Grid
    { id: 'ring', component: <ClientsMarquee /> },       // 6: Ring
    { id: 'vortex', component: <TestimonialsSection /> },// 7: Vortex
    { id: 'harmony', component: <FinalCTA /> }           // 8: Harmony
];

export default function NineDimensionsLayout() {
    const totalSections = SECTIONS.length;
    const { isTouch, currentSection, isAnimating, navigate } = useNineDimensionsController(totalSections);
   
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
   
    // --- MOBILE LAYOUT (Phone Only) ---
    if (isMobile) {
        return (
            <main className="w-full min-h-screen relative bg-[#09060f] text-white">
                 {/* Light static gradient for mobile - ultra-lite background if tablet? 
                     Actually if it is tablet it shouldn't be here based on isMobile check.
                 */}
                 <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0d0e22] to-[#09060f] pointer-events-none" />
                 
                 <div className="relative z-10 flex flex-col w-full">
                    {SECTIONS.map((item, idx) => (
                        <div key={idx} className="w-full relative min-h-[100dvh] flex flex-col justify-center">
                            {item.component}
                        </div>
                    ))}
                 </div>
            </main>
        );
    }
    
    // --- DESKTOP RENDER SHOULD BE NULL UNTIL TOUCH CHECK IS COMPLETE ---
    if (isTouch === undefined) return null;

    return (
        <main className="overflow-hidden fixed inset-0 w-full h-full">
            {/* 1. Background Layer */}
            <NineDimensionsBackground targetShapeIndex={currentSection} />

            {/* 2. HUD Layer */}
            <NineDimensionsHUD 
                currentSection={currentSection}
                totalSections={totalSections}
                onDotClick={navigate}
                isAnimating={isAnimating}
            />

            {/* 3. Content Layer */}
            <AnimatePresence mode="wait">
                <motion.section
                    key={currentSection}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 1.1 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className={`absolute inset-0 z-50 w-full h-full flex flex-col items-center justify-center pointer-events-none ${(currentSection === 0 || currentSection === 2 || currentSection === 6 || currentSection === 7 || currentSection === 8) ? 'p-0' : 'p-8'}`}
                >
                    <div className={`w-full pointer-events-auto ${(currentSection === 0 || currentSection === 2 || currentSection === 6 || currentSection === 7 || currentSection === 8) ? 'h-full' : 'max-w-[1400px]'}`}>
                        {SECTIONS[currentSection].component}
                    </div>
                </motion.section>
            </AnimatePresence>
        </main>
    );
}
