"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to track page visibility and window focus.
 * Returns true only when the tab is active and the window is focused.
 */
export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const checkVisibility = () => {
            setIsVisible(document.visibilityState === 'visible' && document.hasFocus());
        };

        const handleFocus = () => setIsVisible(true);
        const handleBlur = () => setIsVisible(false);

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', checkVisibility);

        // Initial call
        checkVisibility();

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', checkVisibility);
        };
    }, []);

    return isVisible;
}
