"use client"; import { useEffect, useState } from "react";

// ============================================================================
// ARCHITECTURAL NOTE: SIMPLE TOUCH DETECTION
// ============================================================================
// Lightweight hook for components that ONLY need touch detection.
//
// vs useResponsiveMode:
// - THIS HOOK: Only checks if device has touch capability (boolean)
// - useResponsiveMode: Full singleton with breakpoints, scrollMode, render3D, etc.
//
// WHEN TO USE:
// - Use THIS if you only need hasTouch (e.g., hiding cursor on touch devices)
// - Use useResponsiveMode if you need ANY other responsive data
//
// DETECTION METHOD (same as useResponsiveMode):
// 1. matchMedia("(pointer: coarse)") - touch is primary input
// 2. matchMedia("(hover: none)") - no hover capability
// 3. navigator.maxTouchPoints > 0 - supports touch points
//
// HYDRATION:
// - undefined during SSR (typeof window === undefined)
// - Set to actual value after client mount
// - Components should handle undefined state
// ============================================================================

export function useIsTouchDevice() {
    // ========================================================================
    // HYDRATION SAFETY: undefined during SSR, set after mount
    // ========================================================================
    const [isTouch, setIsTouch] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // ====================================================================
        // TOUCH DETECTION - Triple check for maximum compatibility
        // ====================================================================
        const checkTouch = () => {
            return (
                window.matchMedia("(pointer: coarse)").matches ||  // Touch is primary pointer
                window.matchMedia("(hover: none)").matches ||      // No hover capability
                navigator.maxTouchPoints > 0                        // Supports touch points
            );
        };

        setIsTouch(checkTouch()); // Set once on mount (no listeners needed)
    }, []);

    return isTouch; // boolean | undefined (undefined = not hydrated yet)
}
