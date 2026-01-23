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
        // GSAP CONTEXT - Scoped animation cleanup
        // ====================================================================
        // Benefits:
        // - All animations created inside are tracked
        // - ctx.revert() removes ALL at once
        // - Prevents ScrollTrigger memory leaks
        const ctx = gsap.context(() => {
            // ================================================================
            // CONTAINER REVEAL ANIMATION
            // ================================================================
            gsap.from(container, {
                scrollTrigger: {
                    trigger: container,
                    start: "top 70%",  // When container's top hits 70% of viewport
                    once: true          // Only trigger once, not on re-scroll
                },
                y: 40,            // Slide up from 40px below
                opacity: 0,       // Fade in
                scale: 0.95,      // Slight zoom in
                duration: 0.6,
                ease: "power3.out"
            });

            // ================================================================
            // NUMBER COUNTING ANIMATION - Proxy pattern
            // ================================================================
            // PATTERN: Animate plain object, update DOM in onUpdate
            // WHY: GSAP cannot directly animate DOM text properties
            const proxy = { val: 0 };  // Proxy object (0 → numValue)
            gsap.to(proxy, {
                val: numValue,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 70%",
                    once: true,
                },
                onUpdate: () => {
                    // Read proxy.val (interpolated value) and update DOM
                    el.innerText = Math.ceil(proxy.val) + suffix;
                }
            });
        }, container); // Scope to container

        // ====================================================================
        // CLEANUP - Revert ALL animations in context
        // ====================================================================
        // Removes:
        // - Both gsap.from and gsap.to animations
        // - Both ScrollTrigger instances
        // - Restores DOM to pre-animation state
        return () => ctx.revert();
    }, [containerRef, countRef, numValue, suffix, isPageActive]);

    return { suffix }; // Expose suffix for consumer if needed
}
