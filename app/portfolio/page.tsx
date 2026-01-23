"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import PageHero from "@/components/hero/PageHero";
import { useCinematicTransitions } from "@/hooks/useCinematicTransitions";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Dynamic imports for better performance
const WorksTunnel = dynamic(() => import("@/components/sections/WorksTunnel/WorksTunnel"), {
    loading: () => (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-white/50 animate-pulse text-lg tracking-widest uppercase font-light">Loading Gallery...</div>
        </div>
    )
});
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function PortfolioPage() {
    const mainRef = useRef<HTMLElement>(null);
    
    // Pass scope to isolate animations to this page
    useCinematicTransitions(mainRef);

    return (
        <main ref={mainRef} className="flex flex-col w-full min-h-screen">
            <PageHero
                title="Our Work"
                subtitle="A curated selection of our finest digital creations."
            />
            <div className="cinematic-section relative z-10">
                <ErrorBoundary fallback={
                    <div className="min-h-[50vh] flex items-center justify-center text-white/50">
                        Gallery unavailable. Please refresh.
                    </div>
                }>
                    <WorksTunnel />
                </ErrorBoundary>
            </div>
            <div className="cinematic-section relative z-10">
                <FinalCTA />
            </div>
        </main>
    );
}
