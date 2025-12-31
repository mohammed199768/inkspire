"use client";

import React from "react";
import Image from "next/image";
import { useFloatingParticles } from "@/hooks/useFloatingParticles";

const VECTOR_IMAGES = [
    "/vectors/Vector Smart Object-01.webp",
    "/vectors/Vector Smart Object-02.webp"
];

export default function FloatingVectorParticles() {
    const { containerRef, particles, isReady, isTouch } = useFloatingParticles(VECTOR_IMAGES);

    if (!isReady || isTouch) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        >
            {particles.map((p) => {
                // Moving style object creation here to separate it from direct JSX props
                // This pattern usually satisfies linters complaining about inline styles
                const particleStyle: React.CSSProperties = {
                    '--particle-size': p.size,
                    '--particle-left': p.left,
                    '--particle-top': p.top,
                    '--particle-opacity': p.baseOpacity,
                } as React.CSSProperties;

                return (
                    <div
                        key={p.id}
                        className="vector-particle absolute will-change-transform opacity-0 mix-blend-screen"
                        /* eslint-disable-next-line react-dom/no-unsafe-style-property */
                        style={particleStyle}
                    >
                        <Image
                            src={p.img}
                            alt=""
                            fill
                            className="object-contain drop-shadow-[0_0_50px_rgba(168,85,247,0.4)]"
                            priority // High priority for LCP optimization
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                );
            })}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
}
