"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const isTouch = useIsTouchDevice();
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling on all devices (Desktop & Mobile)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            lenisRef.current = requestAnimationFrame(raf) as any;
        }

        lenisRef.current = requestAnimationFrame(raf) as any;

        return () => {
            if (lenisRef.current) cancelAnimationFrame(lenisRef.current as any);
            lenis.destroy();
        };
    }, [isTouch]);

    return <>{children}</>;
}
