"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useCinematicTransitions(scope?: React.RefObject<HTMLElement>) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Scope awareness: search within scope if provided, otherwise global
            // Note: gsap.utils.toArray uses document if no scope, but we want implicit scoping
            // if we are inside a context.
            const sections = gsap.utils.toArray<HTMLElement>(".cinematic-section", scope?.current || undefined);

            sections.forEach((section, index) => {
                // Fade and scale in effect as section enters
                gsap.fromTo(
                    section,
                    {
                        opacity: 0,
                        scale: 0.95,
                        y: 50,
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.5,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "top 20%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );

                // Parallax effect on section content
                const content = section.querySelector(".parallax-content");
                if (content) {
                    gsap.to(content, {
                        y: -50,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1,
                        },
                    });
                }
            });
        }, scope); // GSAP Context attached to scope for easy cleanup

        return () => ctx.revert();
    }, [scope]);
}
