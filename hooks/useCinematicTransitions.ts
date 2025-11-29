"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useCinematicTransitions() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Get all major sections
        const sections = gsap.utils.toArray<HTMLElement>(".cinematic-section");

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
                        // markers: true, // Uncomment for debugging
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

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);
}
