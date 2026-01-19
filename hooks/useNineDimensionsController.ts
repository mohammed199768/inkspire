import { useState, useEffect, useCallback } from "react";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export function useNineDimensionsController(totalSections: number) {
    const isTouch = useIsTouchDevice();
    const [currentSection, setCurrentSection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const navigate = useCallback((nextIndex: number) => {
        if (nextIndex < 0 || nextIndex >= totalSections) return;
        
        setIsAnimating(true);
        setCurrentSection(nextIndex);
        
        // Lock interaction during transition
        // Reference says ~1.5s morph, lock for approx same time
        setTimeout(() => setIsAnimating(false), 1500);
    }, [totalSections]);

    // --- NAVIGATION EVENTS ---
    useEffect(() => {
        // Only disable all events on phone-sized devices
        const isSmallMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isSmallMobile) return;

        // 1. Wheel (Desktop)
        const handleWheel = (e: WheelEvent) => {
            if (isAnimating) return;
            if (Math.abs(e.deltaY) < 30) return;

            if (e.deltaY > 0) {
                navigate(currentSection + 1);
            } else {
                navigate(currentSection - 1);
            }
        };

        // 2. Keyboard
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isAnimating) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(currentSection + 1);
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigate(currentSection - 1);
        };

        // 3. Touch Swipe (Tablet)
        let touchStart = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStart = e.touches[0].clientY;
        };
        const handleTouchEnd = (e: TouchEvent) => {
            if (isAnimating) return;
            const touchEnd = e.changedTouches[0].clientY;
            const delta = touchStart - touchEnd;
            if (Math.abs(delta) > 50) {
                if (delta > 0) navigate(currentSection + 1);
                else navigate(currentSection - 1);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isAnimating, currentSection, navigate]);

    return {
        isTouch,
        currentSection,
        isAnimating,
        navigate
    };
}
