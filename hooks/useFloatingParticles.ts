"use client";

import { useRef } from "react";

export interface ParticleConfig {
    id: string;
    img: string;
    left: string;
    top: string;
    size: number;
    rotation: number;
    baseOpacity: number;
    baseScale: number;
    floatSpeed: number;
    floatAmp: number;
    floatPhase: number;
    parallaxFactor: number;
}

export function useFloatingParticles(imageSources: string[]) {
    return {
        containerRef: useRef<HTMLDivElement>(null),
        particles: [],
        isReady: false,
        isTouch: false
    };
}
