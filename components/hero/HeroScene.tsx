"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteContent } from "@/data/siteContent";

export default function HeroScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const helperTopRef = useRef<HTMLParagraphElement>(null);
    const helperBottomRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const scrollLabelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Title animation - faster and punchier
            const chunks = titleRef.current?.querySelectorAll(".title-chunk");
            if (chunks) {
                tl.from(chunks, {
                    y: 80,
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.08,
                });
            }

            // Helpers and CTA - quicker entrance
            tl.from(
                [helperTopRef.current, helperBottomRef.current, ctaRef.current],
                {
                    y: 15,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                },
                "-=0.4"
            );

            // Scroll label
            tl.from(
                scrollLabelRef.current,
                {
                    y: 8,
                    opacity: 0,
                    duration: 0.5,
                },
                "-=0.4"
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden"
        >
            {/* Animated Background Images */}
            <div className="absolute inset-0 z-0">
                {/* Image 1 - Slides from left */}
                <div
                    className="absolute w-[50%] h-full opacity-50"
                    style={{
                        backgroundImage: `url(${siteContent.gallery.items[0]?.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: 'slideRight 20s ease-in-out infinite alternate',
                        left: '-10%',
                    }}
                />

                {/* Image 2 - Slides from right */}
                <div
                    className="absolute w-[50%] h-full opacity-50"
                    style={{
                        backgroundImage: `url(${siteContent.gallery.items[1]?.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: 'slideLeft 25s ease-in-out infinite alternate',
                        right: '-10%',
                    }}
                />

                {/* Image 3 - Slower vertical movement */}
                <div
                    className="absolute w-full h-[60%] opacity-30"
                    style={{
                        backgroundImage: `url(${siteContent.gallery.items[2]?.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        animation: 'slideDown 30s ease-in-out infinite alternate',
                        top: '-10%',
                    }}
                />

                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-inkspirePurple/30 to-inkspireIndigo/30 z-0" />

            {/* Top Helper */}
            <p
                ref={helperTopRef}
                className="absolute top-24 right-6 md:right-12 text-sm md:text-base text-white/90 font-light tracking-wider z-10"
            >
                {siteContent.hero.helperTop}
            </p>

            {/* Main Title */}
            <div ref={titleRef} className="relative z-10 flex flex-col items-center">
                {siteContent.hero.titleLines.map((row, i) => (
                    <div key={i} className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 overflow-hidden">
                        {row.map((chunk, j) => (
                            <span
                                key={j}
                                className="title-chunk text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter inline-block drop-shadow-2xl group cursor-default"
                            >
                                <span className="animated-gradient-text">
                                    {chunk}
                                </span>
                            </span>
                        ))}
                    </div>
                ))}
                <p className="mt-6 text-lg md:text-xl text-white/90 max-w-lg text-center font-light drop-shadow-lg">
                    {siteContent.hero.subtitle}
                </p>
            </div>

            {/* Bottom Helper */}
            <p
                ref={helperBottomRef}
                className="absolute bottom-32 left-6 md:left-12 text-sm md:text-base text-white/90 font-light tracking-wider max-w-xs z-10"
            >
                {siteContent.hero.helperBottom}
            </p>

            {/* CTA Button */}
            <a
                ref={ctaRef}
                href={siteContent.hero.primaryCtaHref}
                className="absolute bottom-24 right-6 md:right-12 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/40 flex items-center justify-center text-white text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-inkspirePurple transition-colors duration-300 interactive backdrop-blur-sm z-10"
            >
                <span className="text-center">{siteContent.hero.primaryCtaLabel}</span>
            </a>

            {/* Scroll Indicator */}
            <div
                ref={scrollLabelRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs uppercase tracking-widest z-10"
            >
                <span>{siteContent.hero.scrollLabelTop}</span>
                <div className="w-[1px] h-8 bg-white/30" />
                <span>{siteContent.hero.scrollLabelBottom}</span>
            </div>

            <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(20%); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20%); }
        }
        
        @keyframes slideDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(15%); }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
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
          transition: all 0.3s ease;
        }

        .group:hover .animated-gradient-text {
          animation: gradientShift 2s ease infinite;
          filter: brightness(1.2);
          transform: scale(1.05);
        }
      `}</style>
        </section>
    );
}
