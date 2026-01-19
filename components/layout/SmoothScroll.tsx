"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const isTouch = useIsTouchDevice();
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Condition for Lenis: 
        // 1. Not a touch device (handled by useIsTouchDevice)
        // 2. Fine pointer, hover support
        // 3. No reduced motion
        
        if (isTouch === true || isTouch === undefined) return;

        const isFinePointer = window.matchMedia("(pointer: fine)").matches;
        const hasHover = window.matchMedia("(hover: hover)").matches;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!isFinePointer || !hasHover || prefersReducedMotion) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1, // Minimize interference if touch is somehow triggered
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            if (lenisRef.current) {
                lenisRef.current.raf(time);
            }
            rafIdRef.current = requestAnimationFrame(raf);
        }

        rafIdRef.current = requestAnimationFrame(raf);

        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, [isTouch]);

    return <>{children}</>;
}
