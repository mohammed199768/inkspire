"use client";

import { useEffect, useRef, useState, useMemo } from "react";

// Standard fixed particle count as requested (20-30)
const PARTICLE_COUNT = 25;

export interface ParticleConfig {
    id: string;
    img: string;
    // Initial CSS positions (random %)
    left: string;
    top: string;

    // Physical properties
    size: number;
    rotation: number;
    layer: "background" | "scroll";

    // Animation Inputs
    baseOpacity: number;
    baseScale: number;
    scaleDir: number; // 1 or -1

    floatSpeed: number; // How fast it idles
    floatAmp: number;   // How far it moves in idle
    floatPhase: number; // Random start time offset

    parallaxFactor: number; // How much it moves with scroll

    // World Space Base Position (logical Y in pixels relative to viewport top at scroll 0)
    // We'll calculate this dynamically or just map it from the initial `top` percentage.
}

export function useFloatingParticles(imageSources: string[]) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Generate stable particle configuration once
    const particles = useMemo<ParticleConfig[]>(() => {
        return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
            // Distribute layers: 50% background, 50% scroll
            // "A subset of particles (e.g. 40–60% of them) should always stay in the background"
            const isBackground = Math.random() < 0.5;
            const layer = isBackground ? "background" : "scroll";

            // Opacity: Background (0.08–0.18), Scroll (0.2–0.35)
            const baseOpacity = isBackground
                ? 0.08 + Math.random() * 0.10
                : 0.20 + Math.random() * 0.15;

            // Size: 200-400 roughly
            const size = 150 + Math.random() * 250;

            // Parallax: Background very low, Scroll higher
            const parallaxFactor = isBackground
                ? 0.02 + Math.random() * 0.03
                : 0.1 + Math.random() * 0.2;

            return {
                id: `p-${i}`,
                img: imageSources[i % imageSources.length],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`, // Initial distribution

                size,
                rotation: Math.random() * 360,
                layer,

                baseOpacity,
                baseScale: 1,
                scaleDir: Math.random() > 0.5 ? 1 : -1,

                floatSpeed: 0.0005 + Math.random() * 0.001,
                floatAmp: 10 + Math.random() * 20,
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
        // Map DOM elements to our particle config order
        // We rely on the index matching because React renders the array in order.
        const particleNodes = Array.from(container.children).filter(child =>
            child.classList.contains("vector-particle")
        ) as HTMLElement[];

        if (particleNodes.length === 0) return;

        let animationFrameId: number;
        let pTime = performance.now();

        // We need viewport height to handle wrapping logic
        let viewportHeight = window.innerHeight;

        // Update resizing
        const onResize = () => {
            viewportHeight = window.innerHeight;
        };
        window.addEventListener("resize", onResize);

        // Pre-calculate initial positions in pixels for logic
        // We accept the CSS 'top' % as the base, convert to pixels for the simulation
        const initialYPositions = particles.map(p => {
            const pct = parseFloat(p.top);
            return (pct / 100) * viewportHeight;
        });

        const animate = (time: number) => {
            const passed = time - pTime;
            // Limit max dt? pTime = time;

            const scrollY = window.scrollY;

            particleNodes.forEach((node, i) => {
                const p = particles[i];
                if (!p) return;

                // 1. Idle Float
                // Simple sine wave offset
                const floatY = Math.sin(time * p.floatSpeed + p.floatPhase) * p.floatAmp;
                const floatX = Math.cos(time * p.floatSpeed * 0.7 + p.floatPhase) * (p.floatAmp * 0.5);

                // 2. Scroll Logic with Wrapping
                // Base position in pixels
                let logicY = initialYPositions[i];

                // Add scroll effect (parallax)
                // If scroll layer, it moves faster/slower relative to scroll
                // "Move up/down slightly based on scrollY"
                // Usually parallax means: things move UP as we scroll DOWN (because they stay behind).
                // But we want them "reactive". 
                // Let's define movement:
                // movement = scrollY * parallaxFactor. 
                // Visual Position Y = (Initial Y + movement) - scrollY (if fixed)?
                // Wait, the container is `fixed inset-0`, so `top: 0` is always top of viewport.
                // So if we simply translate `y`, it moves relative to viewport.
                // If we want it to move WITH scroll (like it's in the page), we would do `y = -scrollY`.
                // If we want parallax (slower than page), we do `y = -scrollY * factor`.
                // But the user wants them to "Wrap".

                // Let's say: 
                // World Position = InitialY - (scrollY * p.parallaxFactor)
                // Then we wrap World Position into valid Viewport Range.

                // For Background layer: "NOT strongly follow scroll... tiny parallax".
                // So factor is tiny.

                const shift = scrollY * p.parallaxFactor;
                // Move UP as we scroll down (standard parallax)
                let currentY = logicY - shift;

                // 3. Wrapping / Clamping
                // "Do not allow a state where the screen is completely empty... clamp or modulo"
                // We'll use Modulo to loop them through the viewport + buffer.
                const buffer = 200; // Extra space so they don't pop
                const range = viewportHeight + buffer * 2;

                // Wrap logic:
                // We want ((currentY + buffer) % range) - buffer
                // JavaScript % operator can be negative, so standard modulo function:
                const wrappedY = (((currentY + buffer) % range) + range) % range - buffer;

                // 4. Scale
                let scale = p.baseScale;
                if (p.layer === "scroll") {
                    // "Scale changes subtle and smooth (e.g. from 0.9 to 1.1) with scroll"
                    const scaleOffset = Math.min(Math.max((scrollY * 0.0002) * p.scaleDir, -0.15), 0.15);
                    scale += scaleOffset;
                }

                // Apply
                // Since `top` is already set in CSS (percentage), we should either:
                // A) Unset top in CSS and rely fully on translate (preferred for control).
                // B) Calculate delta from the CSS top.
                // BUT, we calculated `initialYPositions` from that CSS top. 
                // So `wrappedY` is the ABSOLUTE pixel position from top of viewport.
                // But the CSS `top` is still applying! 
                // If we leave CSS `top: 50%`, and we set `translate(0, wrappedY)`, we get 50% + wrappedY.
                // We want TOTAL Y to be `wrappedY`.
                // So we need to cancel the CSS top or just NOT SET IT in the DOM if we are controlling it here.
                // However, for SSR/initial paint, we wanted them distributed.
                // Strategy:
                // In Render: keep `top: p.top`.
                // In Animation: 
                //   Value to translate = DesiredAbsoluteY - InitialCSSY.
                //   InitialCSSY = initialYPositions[i].
                //   TranslateY = (wrappedY + floatY) - InitialCSSY.

                const translateY = (wrappedY + floatY) - initialYPositions[i];

                node.style.transform = `translate3d(${floatX}px, ${translateY}px, 0) rotate(${p.rotation}deg) scale(${scale})`;
                node.style.opacity = p.baseOpacity.toFixed(3);

                // Ensure initial fade-in happened
                // (We set opacity-0 class in CSS, so this overrides it)
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
