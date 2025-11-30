"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FloatingVectorParticles() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            const particles = gsap.utils.toArray<HTMLDivElement>(".vector-particle");

            particles.forEach((p, i) => {
                // 3D Depth Effect Calculation
                const depth = Math.random(); // 0 to 1, where 1 is closest
                const scale = 0.8 + depth * 1.2; // Scale: 0.8 to 2.0
                const blur = (1 - depth) * 10; // Blur: 0px (close) to 10px (far)
                const opacity = 0.8 + depth * 0.2; // Opacity: 0.8 to 1.0

                // Initial random position
                gsap.set(p, {
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                    opacity: 0,
                    scale: 0,
                    filter: `blur(${blur}px)`
                });

                // Fade in
                gsap.to(p, {
                    opacity: opacity,
                    scale: scale,
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    ease: "power2.out"
                });

                // Simplified floating animation - less CPU intensive
                gsap.to(p, {
                    x: "random(-80, 80)",
                    y: "random(-80, 80)",
                    duration: 25 + Math.random() * 15,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 3
                });

                // Single optimized scroll animation combining all movements
                const verticalSpeed = 150 + depth * 300; // Reduced from 200-600 to 150-450
                const horizontalSpeed = 80 + depth * 150; // Reduced from 100-300 to 80-230
                const direction = i % 2 === 0 ? 1 : -1;
                const horizontalDirection = i % 3 === 0 ? 1 : -1;

                // Combine all scroll-based transforms in ONE ScrollTrigger
                gsap.to(p, {
                    y: direction * verticalSpeed,
                    x: horizontalDirection * horizontalSpeed,
                    rotation: direction * (120 + i * 20), // Reduced rotation
                    ease: "none",
                    scrollTrigger: {
                        trigger: document.body,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2, // Single optimized scrub value
                        invalidateOnRefresh: false // Performance boost
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Reduced particle count for better performance
    const particles = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        src: i % 2 === 0 ? "/Vector1.png" : "/Vector2.png",
        size: 350 + Math.random() * 150 // Slightly larger but fewer particles
    }));

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="vector-particle absolute will-change-transform"
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                    }}
                >
                    <img
                        src={p.src}
                        alt=""
                        className="w-full h-full object-contain mix-blend-screen"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
}
