"use client";

import Image from "next/image";
import { useFloatingParticles } from "@/hooks/useFloatingParticles";

const VECTOR_IMAGES = [
    "/vectors/Vector Smart Object-01.webp",
    "/vectors/Vector Smart Object-02.webp"
];

export default function FloatingVectorParticles() {
    const { containerRef, particles, isReady } = useFloatingParticles(VECTOR_IMAGES);

    if (!isReady) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        >
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="vector-particle absolute will-change-transform opacity-0 mix-blend-screen"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.left,
                        top: p.top,
                        opacity: p.baseOpacity, // Initial opacity before animation takes over
                    }}
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
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
}
