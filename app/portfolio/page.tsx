"use client";

import dynamic from "next/dynamic";
import PageHero from "@/components/hero/PageHero";
import { useCinematicTransitions } from "@/hooks/useCinematicTransitions";

// Dynamic imports for better performance
const WorksTunnel = dynamic(() => import("@/components/sections/WorksTunnel/WorksTunnel"), {
    loading: () => <div className="min-h-screen" />
});
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function PortfolioPage() {
    useCinematicTransitions();

    return (
        <main className="flex flex-col w-full min-h-screen">
            <PageHero
                title="Our Work"
                subtitle="A curated selection of our finest digital creations."
            />
            <div className="cinematic-section">
                <WorksTunnel />
            </div>
            <div className="cinematic-section">
                <FinalCTA />
            </div>
        </main>
    );
}
