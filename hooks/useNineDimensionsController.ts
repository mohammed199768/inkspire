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

    // --- DESKTOP EVENTS ---
    useEffect(() => {
        if (isTouch) return;

        const handleWheel = (e: WheelEvent) => {
            if (isAnimating) return;
            // Threshold logic similar to request
            if (Math.abs(e.deltaY) < 30) return;

            if (e.deltaY > 0) {
                navigate(currentSection + 1);
            } else {
                navigate(currentSection - 1);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isAnimating) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(currentSection + 1);
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigate(currentSection - 1);
        };

        window.addEventListener('wheel', handleWheel);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTouch, isAnimating, currentSection, navigate]);

    return {
        isTouch,
        currentSection,
        isAnimating,
        navigate
    };
}
