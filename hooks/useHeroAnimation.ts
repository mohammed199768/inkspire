"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";

export function useHeroAnimation(
    containerRef: RefObject<HTMLElement>,
    titleRef: RefObject<HTMLElement>,
    ctaRef: RefObject<HTMLElement>,
    scrollLabelRef: RefObject<HTMLElement>
) {
    useEffect(() => {
        if (!containerRef.current) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            if (titleRef.current) {
                const logo = titleRef.current.querySelector(".hero-logo");
                const tagline = titleRef.current.querySelector(".hero-tagline");
                if (logo) gsap.set(logo, { y: 0, opacity: 1 });
                if (tagline) gsap.set(tagline, { y: 0, opacity: 1 });
            }
            if (ctaRef.current) gsap.set(ctaRef.current, { y: 0, opacity: 1 });
            if (scrollLabelRef.current) gsap.set(scrollLabelRef.current, { y: 0, opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Logo and Tagline animation
            const logo = titleRef.current?.querySelector(".hero-logo");
            const tagline = titleRef.current?.querySelector(".hero-tagline");

            if (logo || tagline) {
                // Ensure they start invisible to avoid flash
                const elements = [logo, tagline].filter(Boolean);
                if (elements.length > 0) {
                    tl.from(elements, {
                        y: 60,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.15,
                    });
                }
            }

            // CTA - quicker entrance
            if (ctaRef.current) {
                tl.from(
                    ctaRef.current,
                    {
                        y: 15,
                        opacity: 0,
                        duration: 0.5,
                    },
                    "-=0.4"
                );
            }

            // Scroll label
            if (scrollLabelRef.current) {
                tl.from(
                    scrollLabelRef.current,
                    {
                        y: 8,
                        opacity: 0,
                        duration: 0.5,
                    },
                    "-=0.4"
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, [containerRef, titleRef, ctaRef, scrollLabelRef]);
}
