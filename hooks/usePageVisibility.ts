"use client";

import { useState, useEffect } from 'react';

// ============================================================================
// ARCHITECTURAL NOTE: PAGE VISIBILITY & FOCUS DETECTION
// ============================================================================
// Tracks whether the page is actually visible to the user.
// Used by useCinematicScroll to pause Lenis when tab is hidden/unfocused.
//
// DUAL CHECK:
// 1. document.visibilityState === 'visible' (tab is active)
// 2. document.hasFocus() (window has focus)
//
// WHY BOTH:
// - visibilityState detects tab switches
// - hasFocus() detects window minimize/blur
// - Only returns true when BOTH conditions met
//
// PERFORMANCE BENEFIT:
// Animations/scroll interpolation paused when user can't see the page.
// Saves CPU/battery, especially important on mobile devices.
// ============================================================================

/**
 * Hook to track page visibility and window focus.
 * Returns true only when the tab is active and the window is focused.
 */
export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(true); // Optimistic default (assume visible)

    useEffect(() => {
        // ========================================================================
        // VISIBILITY CHECK - Dual condition (visibility + focus)
        // ========================================================================
        const checkVisibility = () => {
            // TRUE only if: tab is visible AND window has focus
            setIsVisible(document.visibilityState === 'visible' && document.hasFocus());
        };

        // ========================================================================
        // EVENT HANDLERS
        // ========================================================================
        // OPTIMIZATION: Simplified handlers for focus/blur (no need to check)
        // Focus = definitely visible, Blur = definitely not visible
        const handleFocus = () => setIsVisible(true);
        const handleBlur = () => setIsVisible(false);

        // ATTACH LISTENERS
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', checkVisibility);

        // Initial check (synchronize state with actual visibility)
        checkVisibility();

        // ========================================================================
        // CLEANUP - Remove all event listeners
        // ========================================================================
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', checkVisibility);
        };
    }, []);

    return isVisible; // Boolean: true = page visible and focused
}
