"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageVisibility } from "@/hooks/usePageVisibility";

// ============================================================================
// ARCHITECTURAL NOTE: ANIMATED NUMBER COUNTER
// ============================================================================
// Scroll-triggered number counting animation using GSAP.
//
// PATTERN: GSAP Proxy Object Animation
// - Animate a plain object: { val: 0 } → { val: 100 }
// - onUpdate: Read proxy.val and update DOM
// WHY: Cannot directly animate DOM innerText property
//
// SCROLL TRIGGER:
// - Trigger when container enters viewport (top 70%)
// - once: true (animation plays only once, not on re-scroll)
//
// GSAP CONTEXT:
// - Scopes all GSAP animations/ScrollTriggers to container
// - ctx.revert() in cleanup removes ALL animations in scope
// - Prevents memory leaks from orphaned ScrollTriggers
// ============================================================================

gsap.registerPlugin(ScrollTrigger);

export function useAnimatedCounter(
    containerRef: RefObject<HTMLElement>,  // Container for scroll trigger
    countRef: RefObject<HTMLElement>,      // Element to update with number
    value: string                          // Value like "100+" or "50%"
) {
    const isPageActive = usePageVisibility(); // Pause when tab hidden
    
    // ========================================================================
    // PARSE VALUE - Extract number and suffix
    // ========================================================================
    // Examples: "100+" → numValue=100, suffix="+"
    //          "50%" → numValue=50, suffix="%"
    const numValue = parseInt(value.replace(/\D/g, '')); // Remove non-digits
    const suffix = value.replace(/[0-9]/g, '');          // Remove digits

    useEffect(() => {
        // ====================================================================
        // GUARD: Only run when page visible (performance optimization)
        // ====================================================================
        if (!isPageActive) return;
        
        const el = countRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        // Initial state (start from 0)
        el.innerText = "0" + suffix;

        // ====================================================================
        // DEVICE DETECTION - Use Native Observer on Small Screens
        // ====================================================================
        // WHY: ScrollTrigger behaves differently in native scroll mode (mobile).
        // IntersectionObserver is reliable for native scrolling.
        const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;
        let observer: IntersectionObserver | null = null;
        let ctx: gsap.Context | null = null;

        // Function to run the animation logic
        const runAnimation = () => {
             ctx = gsap.context(() => {
                // ================================================================
                // CONTAINER REVEAL ANIMATION
                // ================================================================
                // CONDITIONAL TRIGGER:
                // - Desktop: Uses ScrollTrigger properties
                // - Mobile: Triggered imperatively by Observer (no ScrollTrigger prop)
                gsap.from(container, {
                    ...(isSmallScreen ? {} : {
                        scrollTrigger: {
                            trigger: container,
                            start: "top 70%",
                            once: true
                        }
                    }),
                    y: 40,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: "power3.out"
                });

                // ================================================================
                // NUMBER COUNTING ANIMATION - Proxy pattern
                // ================================================================
                const proxy = { val: 0 };
                gsap.to(proxy, {
                    val: numValue,
                    duration: 2.5,
                    ease: "power2.out",
                    ...(isSmallScreen ? {} : {
                        scrollTrigger: {
                            trigger: container,
                            start: "top 70%",
                            once: true,
                        }
                    }),
                    onUpdate: () => {
                        el.innerText = Math.ceil(proxy.val) + suffix;
                    }
                });
            }, container);
        };

        if (isSmallScreen) {
            // NATIVE TRIGGER (Mobile/Tablet)
            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    runAnimation();
                    observer?.disconnect(); // Run once
                }
            }, { threshold: 0.35 }); // Trigger when 35% visible
            observer.observe(container);
        } else {
            // SCROLLTRIGGER (Desktop) - Run immediately, logic handles trigger
            runAnimation();
        }

        // ====================================================================
        // CLEANUP
        // ====================================================================
        return () => {
            if (ctx) ctx.revert();
            if (observer) observer.disconnect();
        };
    }, [containerRef, countRef, numValue, suffix, isPageActive]);

    return { suffix }; // Expose suffix for consumer if needed
}
