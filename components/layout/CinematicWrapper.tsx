"use client";

import { useCinematicTransitions } from "@/hooks/useCinematicTransitions";
import { ReactNode } from "react";

interface CinematicWrapperProps {
    children: ReactNode;
}

export default function CinematicWrapper({ children }: CinematicWrapperProps) {
    // Initialize cinematic transitions between sections
    // This hook selects all .cinematic-section elements and applies GSAP animations
    useCinematicTransitions();

    return <>{children}</>;
}
