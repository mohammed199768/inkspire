"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPFade() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            const fadeElements = gsap.utils.toArray<HTMLElement>(".fade-up");
            
            if (prefersReducedMotion) {
                 fadeElements.forEach((el) => {
                     gsap.set(el, { opacity: 1, y: 0 });
                 });
                 return;
            }
            
            fadeElements.forEach((el, index) => {
                // ARCHITECTURAL CHANGE: Explicitly set initial hidden state in JS
                // This replaces the dangerous global CSS .fade-up { opacity: 0 }
                gsap.set(el, { opacity: 0, y: 30, visibility: "hidden" });

                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    visibility: "visible",
                    duration: 0.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 70%",
                        once: true,
                        toggleActions: "play none none none"
                    },
                    delay: (index % 4) * 0.08,
                    onStart: () => {
                        (el as HTMLElement).style.willChange = "transform, opacity";
                    },
                    onComplete: () => {
                        (el as HTMLElement).style.willChange = "auto";
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return containerRef;
}
