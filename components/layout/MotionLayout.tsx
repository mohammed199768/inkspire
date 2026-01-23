// ============================================================================
// ARCHITECTURAL INTENT: Page Transition Wrapper
// ============================================================================
// Provides page-level entrance animation on Next.js route changes.
// Uses GSAP for fade-in effect when pathname changes.
//
// DATA FLOW:
// - INPUT: pathname from Next.js router
// - OUTPUT: Animated wrapper div with fade-in effect on mount/route change
//
// LIFECYCLE:
// - useEffect triggered on every pathname change
// - Creates new GSAP animation on each route transition
// - No explicit cleanup (animation auto-completes)
//
// TRADE-OFF NOTES:
// - No gsap.context() scoping (animation is short-lived, unlikely to leak)
// - No cleanup function (GSAP auto-removes completed tweens from ticker)
// - FOR LONG-RUNNING ANIMATIONS: Would need context + revert pattern
// ============================================================================

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MotionLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // ARCHITECTURAL INTENT: Create entrance animation on route change
        // GSAP imperatively mutates DOM styles (opacity, y transform)
        // Animation duration: 0.5s (short enough to not require explicit cleanup)
        gsap.fromTo(
            wrapperRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
    }, [pathname]);

    return (
        <div ref={wrapperRef} data-page className="min-h-[100dvh]">
            {children}
        </div>
    );
}
