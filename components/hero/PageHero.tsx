"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageHeroProps {
    title: string;
    subtitle: string;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(titleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
            });

            tl.from(subtitleRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            }, "-=0.6");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="cinematic-section relative h-[60vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-20"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-0" />

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl parallax-content">
                <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
                    <span className="animated-gradient-text">
                        {title}
                    </span>
                </h1>
                <p ref={subtitleRef} className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .animated-gradient-text {
                    background: linear-gradient(
                        90deg,
                        #ffffff,
                        #f2e9ff,
                        #6b4092,
                        #404f96,
                        #f2e9ff,
                        #ffffff
                    );
                    background-size: 300% 300%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradientShift 8s ease infinite;
                }
            `}</style>
        </section>
    );
}
