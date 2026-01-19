"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MotionLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        // Simple fade in animation on route change
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
