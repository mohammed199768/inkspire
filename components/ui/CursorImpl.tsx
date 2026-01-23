// ============================================================================
// ARCHITECTURAL INTENT: Custom Arrow Cursor Implementation
// ============================================================================
// Replaces default cursor with animated arrow that follows mouse.
//
// VISUAL BEHAVIOR:
// - Arrow rotates to follow mouse direction
// - Smooth 250ms transition for position/rotation
// - Anchor point shifts based on rotation quadrant (keeps tip at pointer)
//
// MATH LOGIC:
// - atan() calculates angle from dx/dy deltas
// - Quadrant detection (4 cases) determines anchor point offset
// - angleDisplace accumulates to handle 360° wrapping
//
// PERFORMANCE:
// - Passive event listener (browser can optimize)
// - Direct style manipulation (no React re-renders)
// - Only runs on desktop (wrapper guards touch devices)
//
// GOTCHA: Global cursor override
// - CSS: * { cursor: none !important }
// - Only applies on (pointer: fine) media query
// - Hides ALL native cursors (let custom arrow replace them)
//
// EVIDENCE: Part of UX enhancements, documented in ARCHITECTURE_MEMORY.txt
// ============================================================================

"use client";

import { useEffect, useRef } from "react";

export default function ArrowCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ARCHITECTURAL GUARD: Double-check capabilities
        // Wrapper component (Cursor.tsx) already filtered for desktop,
        // but check again as defensive programming
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (coarse || reduce) return;

        const el = cursorRef.current;
        if (!el) return;

        const root = document.body;

        // state
        let prevX = 0;
        let prevY = 0;
        let pointerX = 0;
        let pointerY = 0;

        let angle = 0;
        let prevAngle = 0;
        let angleDisplace = 0;

        const degrees = 57.296;
        const cursorSize = 20;

        // init styles (same spirit as your snippet)
        Object.assign(el.style, {
            boxSizing: "border-box",
            position: "fixed",
            top: "0px",
            left: `${-cursorSize / 2}px`,
            zIndex: "2147483647",
            width: `${cursorSize}px`,
            height: `${cursorSize}px`,
            transition: "250ms, transform 100ms",
            userSelect: "none",
            pointerEvents: "none",
            opacity: "1",
            transform: "translate3d(-9999px,-9999px,0)",
        } as CSSStyleDeclaration);

        const move = (e: MouseEvent) => {
            // Check if element is still mounted
            if (!el) return;

            prevX = pointerX;
            prevY = pointerY;

            // similar to original (pageX + rect offsets)
            const rect = root.getBoundingClientRect();
            pointerX = e.pageX + rect.x;
            pointerY = e.pageY + rect.y;

            const dx = prevX - pointerX;
            const dy = prevY - pointerY;
            const dist = Math.sqrt(dy * dy + dx * dx);

            el.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;

            if (dist > 1) rotate(dx, dy);
            else el.style.transform += ` rotate(${angleDisplace}deg)`;
        };

        const rotate = (dx: number, dy: number) => {
            const unsortedAngle = Math.atan(Math.abs(dy) / Math.abs(dx)) * degrees;
            prevAngle = angle;

            if (dx <= 0 && dy >= 0) angle = 90 - unsortedAngle + 0;
            else if (dx < 0 && dy < 0) angle = unsortedAngle + 90;
            else if (dx >= 0 && dy <= 0) angle = 90 - unsortedAngle + 180;
            else if (dx > 0 && dy > 0) angle = unsortedAngle + 270;

            if (Number.isNaN(angle)) angle = prevAngle;
            else {
                const diff = angle - prevAngle;
                if (diff <= -270) angleDisplace += 360 + diff;
                else if (diff >= 270) angleDisplace += diff - 360;
                else angleDisplace += diff;
            }

            el.style.transform += ` rotate(${angleDisplace}deg)`;

            // Adjust anchor points based on rotation quadrant (copied behavior)
            const modAngle = angleDisplace >= 0 ? angleDisplace % 360 : 360 + (angleDisplace % 360);

            if (modAngle >= 45 && modAngle < 135) {
                el.style.left = `${-cursorSize}px`;
                el.style.top = `${-cursorSize / 2}px`;
            } else if (modAngle >= 135 && modAngle < 225) {
                el.style.left = `${-cursorSize / 2}px`;
                el.style.top = `${-cursorSize}px`;
            } else if (modAngle >= 225 && modAngle < 315) {
                el.style.left = `0px`;
                el.style.top = `${-cursorSize / 2}px`;
            } else {
                el.style.left = `${-cursorSize / 2}px`;
                el.style.top = `0px`;
            }
        };

        window.addEventListener("mousemove", move, { passive: true });

        return () => {
            window.removeEventListener("mousemove", move);
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="curzr" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path
                        className="inner"
                        d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
                        fill="#F2F5F8"
                    />
                    <path
                        className="outer"
                        d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
                        fill="#111920"
                    />
                </svg>
            </div>

            <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
        </>
    );
}
