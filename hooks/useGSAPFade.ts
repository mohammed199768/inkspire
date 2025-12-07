"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPFade() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const fadeElements = gsap.utils.toArray(".fade-up");

            fadeElements.forEach((el: any, index) => {
                gsap.fromTo(el,
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            once: true,
                            toggleActions: "play none none none"
                        },
                        delay: (index % 4) * 0.05
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return containerRef;
}
