"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
    const cursorInnerRef = useRef<HTMLDivElement>(null);
    const cursorOuterRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const inner = cursorInnerRef.current;
        const outer = cursorOuterRef.current;

        if (!inner || !outer) return;

        // Center the cursor initially
        gsap.set(inner, { xPercent: -50, yPercent: -50 });
        gsap.set(outer, { xPercent: -50, yPercent: -50 });

        const moveCursor = (e: MouseEvent) => {
            // Inner cursor follows immediately
            gsap.to(inner, {
                x: e.clientX,
                y: e.clientY,
                duration: 0,
            });

            // Outer cursor follows with delay (fluid effect)
            gsap.to(outer, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power2.out",
            });
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", moveCursor);

        // Add hover effect to interactive elements
        const updateInteractiveElements = () => {
            const links = document.querySelectorAll("a, button, .interactive, input, textarea");
            links.forEach((link) => {
                link.addEventListener("mouseenter", handleMouseEnter);
                link.addEventListener("mouseleave", handleMouseLeave);
            });
        };

        updateInteractiveElements();

        // Re-check for new elements periodically (for dynamic content)
        const intervalId = setInterval(updateInteractiveElements, 1000);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const inner = cursorInnerRef.current;
        const outer = cursorOuterRef.current;

        if (isHovering) {
            gsap.to(inner, { scale: 0, duration: 0.3 });
            gsap.to(outer, {
                scale: 2.5,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderColor: "transparent",
                mixBlendMode: "difference",
                duration: 0.3
            });
        } else {
            gsap.to(inner, { scale: 1, duration: 0.3 });
            gsap.to(outer, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "#8b5cf6", // inkspirePurple
                mixBlendMode: "normal",
                duration: 0.3
            });
        }
    }, [isHovering]);

    return (
        <>
            <div
                ref={cursorInnerRef}
                className="fixed top-0 left-0 w-3 h-3 bg-inkspirePurple rounded-full pointer-events-none z-[10001] mix-blend-difference"
            />
            <div
                ref={cursorOuterRef}
                className="fixed top-0 left-0 w-8 h-8 border border-inkspirePurple rounded-full pointer-events-none z-[10001] transition-opacity duration-300"
            />
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
                /* Restore cursor for iframes or specific areas if needed */
                iframe {
                    cursor: auto !important;
                }
            `}</style>
        </>
    );
}
