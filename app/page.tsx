"use client";

import HeroScene from "@/components/hero/HeroScene";
import StoryScrollytelling from "@/components/sections/StoryScrollytelling";
import CreativeSlider from "@/components/sections/CreativeSlider";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import FinalCTA from "@/components/sections/FinalCTA";
import { useScrollScenes } from "@/hooks/useScrollScenes";
import { useCinematicTransitions } from "@/hooks/useCinematicTransitions";

export default function Home() {
    // Initialize scroll animations for story sections
    useScrollScenes();

    // Initialize cinematic transitions between sections
    useCinematicTransitions();

    return (
        <main className="flex flex-col w-full">
            <HeroScene />
            <div className="cinematic-section">
                <StoryScrollytelling />
            </div>
            <div className="cinematic-section">
                <CreativeSlider />
            </div>
            <div className="cinematic-section">
                <ProcessTimeline />
            </div>
            <div className="cinematic-section">
                <FinalCTA />
            </div>
        </main>
    );
}
