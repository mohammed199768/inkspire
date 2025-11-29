"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
    const cursorInnerRef = useRef<HTMLDivElement>(null);
    const cursorOuterRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ inner: { x: 0, y: 0 }, outer: { x: 0, y: 0 } });

    useEffect(() => {
        const inner = cursorInnerRef.current;
        const outer = cursorOuterRef.current;

        if (!inner || !outer) return;

        const moveCursor = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            // Smooth following with different speeds for inner and outer
            cursorPos.current.inner.x += (mousePos.current.x - cursorPos.current.inner.x) * 0.95;
            cursorPos.current.inner.y += (mousePos.current.y - cursorPos.current.inner.y) * 0.95;

            cursorPos.current.outer.x += (mousePos.current.x - cursorPos.current.outer.x) * 0.15;
            cursorPos.current.outer.y += (mousePos.current.y - cursorPos.current.outer.y) * 0.15;

            if (inner && outer) {
                inner.style.transform = `translate(${cursorPos.current.inner.x}px, ${cursorPos.current.inner.y}px)`;
                outer.style.transform = `translate(${cursorPos.current.outer.x}px, ${cursorPos.current.outer.y}px)`;
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        const handleMouseEnter = () => {
            inner.classList.add("cursor-hover");
            outer.classList.add("cursor-hover");
        };

        const handleMouseLeave = () => {
            inner.classList.remove("cursor-hover");
            outer.classList.remove("cursor-hover");
        };

        window.addEventListener("mousemove", moveCursor);
        requestRef.current = requestAnimationFrame(animate);

        // Add hover effect to interactive elements
        const updateInteractiveElements = () => {
            const links = document.querySelectorAll("a, button, .interactive");
            links.forEach((link) => {
                link.addEventListener("mouseenter", handleMouseEnter);
                link.addEventListener("mouseleave", handleMouseLeave);
            });
        };

        updateInteractiveElements();

        // Re-check for new elements periodically
        const intervalId = setInterval(updateInteractiveElements, 1000);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorInnerRef}
                className="cursor-inner fixed top-0 left-0 w-3 h-3 bg-inkspirePurple rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-200 ease-out will-change-transform"
            />
            <div
                ref={cursorOuterRef}
                className="cursor-outer fixed top-0 left-0 w-8 h-8 border border-inkspireIndigo rounded-full pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out opacity-50 will-change-transform"
            />
            <style jsx global>{`
        .cursor-hover.cursor-inner {
          transform: scale(2.5) translate(-20%, -20%) !important;
          background-color: transparent !important;
          opacity: 0.8 !important;
        }
        .cursor-hover.cursor-outer {
          transform: scale(1.5) translate(-33%, -33%) !important;
          border-color: #fff !important;
          opacity: 0.8 !important;
        }
      `}</style>
        </>
    );
}
