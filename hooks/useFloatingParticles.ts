"use client";

import { useEffect, useRef, useState, useMemo } from "react";

// Reduced particle count as requested (2-4)
const PARTICLE_COUNT = 3;

export interface ParticleConfig {
    id: string;
    img: string;
    // Initial CSS positions (random %)
    left: string;
    top: string;

    // Physical properties
    size: number;
    rotation: number;

    // Animation Inputs
    baseOpacity: number;
    baseScale: number;

    floatSpeed: number; // How fast it idles
    floatAmp: number;   // How far it moves in idle
    floatPhase: number; // Random start time offset

    parallaxFactor: number; // How much it moves with scroll
}

export function useFloatingParticles(imageSources: string[]) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Generate stable particle configuration once
    const particles = useMemo<ParticleConfig[]>(() => {
        return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            // One simplified layer

            // Opacity: Subtle visibility
            const baseOpacity = 0.3 + Math.random() * 0.2;

            // Size: Large enough to be decorative
            const size = 300 + Math.random() * 200;

            // Parallax: Small smooth movement affected by scrolling
            const parallaxFactor = 0.05 + Math.random() * 0.05;

            return {
                id: `p-${i}`,
                img: imageSources[i % imageSources.length],
                left: `${10 + Math.random() * 80}%`, // Keep broadly within screen width
                top: `${10 + Math.random() * 80}%`,  // Keep broadly within screen height

                size,
                rotation: Math.random() * 360,

                baseOpacity,
                baseScale: 1,

                floatSpeed: 0.0005 + Math.random() * 0.0005, // very slow float
                floatAmp: 20 + Math.random() * 10,
                floatPhase: Math.random() * Math.PI * 2,

                parallaxFactor,
            };
        });
    }, [imageSources]);

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady || !containerRef.current) return;

        const container = containerRef.current;
        const particleNodes = Array.from(container.children).filter(child =>
            child.classList.contains("vector-particle")
        ) as HTMLElement[];

        if (particleNodes.length === 0) return;

        let animationFrameId: number;
        let viewportHeight = window.innerHeight;

        const onResize = () => {
            viewportHeight = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        // Calculate initial pixel positions from percentages
        const initialYPositions = particles.map(p => {
            const pct = parseFloat(p.top);
            return (pct / 100) * viewportHeight;
        });

        const animate = (time: number) => {
            const scrollY = window.scrollY;

            particleNodes.forEach((node, i) => {
                const p = particles[i];
                if (!p) return;

                // 1. Idle Float (Small smooth movement)
                const floatY = Math.sin(time * p.floatSpeed + p.floatPhase) * p.floatAmp;
                // Add a bit of X movement too
                const floatX = Math.cos(time * p.floatSpeed * 0.8 + p.floatPhase) * (p.floatAmp * 0.5);

                // 2. Scroll Interaction
                // Move based on scroll * parallaxFactor
                // This creates the effect of them moving slightly when you scroll
                const scrollOffset = scrollY * p.parallaxFactor;
                const basePixelY = initialYPositions[i];

                // Calculate position relative to viewport
                // We want them to drift slightly as we scroll.
                // Standard parallax: if we scroll down (cY increases), object moves up relative to viewport.
                // relativeY = baseY - scrollY (fixed obj) - (parallax gap)
                // Since container is fixed, `top:0` is viewport top.
                // To mimic "in the world but distant": 
                // Y = (baseY - scrollY * p.parallaxFactor) // wrapping logic below

                // Let's use a wrapping logic so they stay in view roughly
                // But since there are only 3, maybe we just want them to shift?
                // User said "render 2-4 particles ... effected by scrolling"
                // If we don't wrap, they might scroll off screen if parallax is high.
                // But with low parallax factor (0.05), they move very slowly.
                // Let's keep wrapping to be safe so they are always around.

                let currentY = basePixelY - scrollOffset;

                const buffer = 400;
                const range = viewportHeight + buffer * 2;

                // Wrap around logic
                // Center the wrap around the scroll position so they don't all disappear
                // Actually, if container is fixed, we just wrap around the viewport height.
                // BUT, if `scrollOffset` keeps growing, `currentY` keeps shrinking.
                // Eventually it goes to -infinity.
                // So modulo is essential.

                const wrappedY = (((currentY + buffer) % range) + range) % range - buffer;

                // 3. Apply Transform
                // We need to calculate the delta from the CSS `top` (initialYPositions[i])
                // so that the final position is `wrappedY`.
                // FinalY = InitialCSSY + TranslateY -> TranslateY = FinalY - InitialCSSY

                // However, the `floatY` is an offset on top of that base position.

                const translateY = (wrappedY + floatY) - initialYPositions[i];

                // Gentle rotation
                const rotate = p.rotation + Math.sin(time * 0.0001) * 10;

                node.style.transform = `translate3d(${floatX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${p.baseScale})`;
                node.style.opacity = p.baseOpacity.toFixed(3);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", onResize);
        };
    }, [isReady, particles]);

    return { containerRef, particles, isReady };
}

