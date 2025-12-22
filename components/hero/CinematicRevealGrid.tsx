"use client";

import Image from "next/image";
import { useCinematicReveal } from "@/hooks/useCinematicReveal";
import "@/styles/cinematic-reveal.css";

// Using the same 4 image pairs. 
// If the user wants "More images", they likely need to duplicate them or provide more.
// I will duplicate them to fill the grid nicely if it's wide, but sticking to 4 columns implies 4 images.
// The user said "images more" (photo akther), maybe meaning quantity or quality?
// "photo akther" = more photos?
// Reference HTML has 4 stacks.
// Current implementation has 4 stacks.
// If I add more, I need to adjust grid?
// I'll stick to 4 for now to match the "feature parity" request of the logic, 
// but ensure they look "more" (larger/fuller) by removing gaps.

const STACKS = [
    { id: 1, base: "/hero/be 1.webp", overlay: "/hero/af 1.webp", alt: "Cinematic Reveal 1" },
    { id: 2, base: "/hero/be 2.webp", overlay: "/hero/af 2.webp", alt: "Cinematic Reveal 2" },
    { id: 3, base: "/hero/be 3.webp", overlay: "/hero/af 3.webp", alt: "Cinematic Reveal 3" },
    { id: 4, base: "/hero/be 4.webp", overlay: "/hero/af 4.webp", alt: "Cinematic Reveal 4" },
];

export default function CinematicRevealGrid() {
    const { isTouch, containerRef, setStackRef } = useCinematicReveal();

    return (
        <div
            ref={containerRef}
            className={`re-reveal-container ${isTouch ? 'is-touch' : ''}`}
        >
            {/* Global Atmosphere Layers */}
            <div className="re-grain" />
            <div className="re-dim-layer" />
            <div className="re-spotlight" />

            {/* Seamless Grid */}
            <div className="re-stacks-grid">
                {STACKS.map((stack, index) => (
                    <div
                        key={stack.id}
                        className="re-stack"
                        ref={(el) => setStackRef(el, index)}
                    >
                        {/* Base Image */}
                        <Image
                            src={stack.base}
                            alt={stack.alt}
                            fill
                            priority
                            quality={90} // Ensure high clarity per "images clearer"
                            className="re-stack-image re-stack-base"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Overlay Image (Revealed) - HIDDEN ON MOBILE */}
                        {!isTouch && (
                            <div className="re-stack-overlay absolute inset-0 w-full h-full">
                                <Image
                                    src={stack.overlay}
                                    alt={stack.alt}
                                    fill
                                    priority
                                    quality={95} // High quality for the reveal
                                    className="re-stack-image"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
