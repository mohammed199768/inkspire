"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Particle {
    id: number;
    img: string;
    size: number;
    left: string;
    top: string;
    rotation: number;
    depth: number; // For parallax effect
}

interface Config {
    particleCount: number;
    maxSize: number;
    enableScrollParallax: boolean;
}

export function useFloatingParticles(vectorImages: string[]) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    // Initialize config based on device
    const [config, setConfig] = useState<Config>({
        particleCount: 0, // Start with 0 to match server
        maxSize: 800,
        enableScrollParallax: true
    });

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const newConfig = {
            particleCount: isMobile ? 3 : 6,
            maxSize: isMobile ? 400 : 800,
            enableScrollParallax: !isMobile
        };
        setConfig(newConfig);

        // Generate particles deterministically for this session
        const newParticles = Array.from({ length: newConfig.particleCount }).map((_, i) => ({
            id: i,
            img: vectorImages[i % vectorImages.length],
            size: 300 + Math.random() * (newConfig.maxSize - 300),
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            rotation: Math.random() * 360,
            depth: Math.random() // 0 to 1
        }));
        setParticles(newParticles);
    }, []); // Run once on mount

    useEffect(() => {
        if (!containerRef.current || particles.length === 0) return;

        const ctx = gsap.context(() => {
            const particleElements = gsap.utils.toArray<HTMLElement>(".vector-particle");

            particleElements.forEach((el, i) => {
                const p = particles[i];
                if (!p) return;

                // Initial State
                gsap.set(el, {
                    opacity: 0,
                    scale: 0,
                });

                // Entrance
                gsap.to(el, {
                    opacity: gsap.utils.random(0.4, 0.8),
                    scale: gsap.utils.random(0.5, 1.2),
                    duration: 2.5,
                    ease: "power2.out",
                    delay: i * 0.3
                });

                // Ambient Float (Continuous)
                gsap.to(el, {
                    x: `random(-50, 50)`,
                    y: `random(-50, 50)`,
                    rotation: `random(-45, 45)`,
                    duration: gsap.utils.random(10, 20),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 5
                });

                // Scroll Parallax (Optimized)
                if (config.enableScrollParallax) {
                    const movementY = (i % 2 === 0 ? -1 : 1) * 200 * (1 + p.depth);

                    gsap.to(el, {
                        y: `+=${movementY}`, // Relative movement from current floating position
                        rotation: `+=${i % 2 === 0 ? 45 : -45}`,
                        ease: "none",
                        scrollTrigger: {
                            trigger: document.body,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1, // Smooth scrubbing
                            invalidateOnRefresh: true
                        }
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [particles, config]);

    return { containerRef, particles, isReady: particles.length > 0 };
}
