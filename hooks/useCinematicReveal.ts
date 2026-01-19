import { useEffect, useRef, useCallback } from 'react';
import { useIsTouchDevice } from './useIsTouchDevice';

// Configuration based on the user's "Global/Premium" reference
const CONFIG = {
    lerpFactor: 0.1,      // Smooth mouse tracking
    maxDist: 400,         // Distance where effect starts
    minMaskRadius: 0,
    maxMaskRadius: 320,   // Large reveal
    maskFeather: 80,      // Soft gradient edge
};

interface StackState {
    intensity: number; // 0 to 1
    rect: DOMRect | null;
}

export function useCinematicReveal() {
    const isTouch = useIsTouchDevice();
    const containerRef = useRef<HTMLDivElement>(null);
    const stacksRef = useRef<(HTMLDivElement | null)[]>([]);
    const requestRef = useRef<number>();

    // Mutable state for physics (avoiding React renders for 60fps)
    const stateRef = useRef({
        mouse: {
            targetX: -1000, targetY: -1000,
            currentX: -1000, currentY: -1000,
            isHovering: false
        },
        stacks: [] as StackState[]
    });

    const setStackRef = useCallback((el: HTMLDivElement | null, index: number) => {
        stacksRef.current[index] = el;
        // Initialize state for this stack
        if (!stateRef.current.stacks[index]) {
            stateRef.current.stacks[index] = { intensity: 0, rect: null };
        }
    }, []);

    const updateRects = useCallback(() => {
        if (!stacksRef.current.length) return;
        stacksRef.current.forEach((stack, i) => {
            if (stack && stateRef.current.stacks[i]) {
                stateRef.current.stacks[i].rect = stack.getBoundingClientRect();
            }
        });
    }, []);

    const animate = useCallback(() => {
        const { mouse, stacks } = stateRef.current;

        // 1. Lerp Mouse
        mouse.currentX += (mouse.targetX - mouse.currentX) * CONFIG.lerpFactor;
        mouse.currentY += (mouse.targetY - mouse.currentY) * CONFIG.lerpFactor;

        // 2. Update Spotlight (Global)
        if (containerRef.current) {
            // We want the spotlight to be relative to the viewport or container?
            // The reference uses transform: translate(x,y) on a fixed spotlight.
            // Here we update CSS vars for the container to use
            const containerRect = containerRef.current.getBoundingClientRect();
            const relX = mouse.currentX - containerRect.left;
            const relY = mouse.currentY - containerRect.top;

            containerRef.current.style.setProperty('--sx', `${relX}px`);
            containerRef.current.style.setProperty('--sy', `${relY}px`);

            // Toggle global spotlight opacity
            containerRef.current.style.setProperty('--spot-op', mouse.isHovering ? '1' : '0');
        }

        // 3. Update Stacks
        stacksRef.current.forEach((stack, i) => {
            if (!stack) return;
            const stackState = stacks[i];
            if (!stackState || !stackState.rect) return;

            const rect = stackState.rect;
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Distance
            const dist = Math.sqrt(
                Math.pow(mouse.currentX - centerX, 2) +
                Math.pow(mouse.currentY - centerY, 2)
            );

            // Calculate Target Intensity
            let targetIntensity = 0;
            if (mouse.isHovering) {
                // (1 - dist/max) clamped [0,1]
                const norm = Math.max(0, 1 - dist / CONFIG.maxDist);
                // Ease In Out / Quadratic falloff for "Focus" feel
                targetIntensity = norm * norm;
            }

            // Lerp Intensity
            stackState.intensity += (targetIntensity - stackState.intensity) * CONFIG.lerpFactor;

            // --- APPLY STYLES ---
            const overlay = stack.querySelector('.re-stack-overlay') as HTMLElement;

            if (stackState.intensity > 0.001) {
                const intensity = stackState.intensity;

                // A. Scale & Z-Index
                // "Subtle Parallax / Scale" -> 1 + intensity * 0.02
                // Z-index pop
                const scale = 1 + (intensity * 0.03);
                stack.style.zIndex = intensity > 0.1 ? "20" : "2";
                stack.style.transform = `translateY(var(--y-offset, 0px)) scale(${scale})`;

                // B. Filter (Brightness/Contrast/DropShadow)
                // Base brightness 0.8 -> 1.0ish
                // Contrast 1.0 -> 1.1
                const brightness = 0.8 + (intensity * 0.3);
                const contrast = 1 + (intensity * 0.1);
                // "Shadow 0 20px 60px" logic
                const shadowOpacity = intensity * 0.4;
                stack.style.filter = `brightness(${brightness}) contrast(${contrast}) drop-shadow(0 20px 40px rgba(0,0,0,${shadowOpacity}))`;

                // C. Overlay Mask & Opacity
                if (overlay) {
                    // Opacity
                    overlay.style.opacity = intensity.toFixed(3);

                    // Mask relative to stack
                    const maskX = mouse.currentX - rect.left;
                    const maskY = mouse.currentY - rect.top;

                    // Radius grows with intensity
                    const radius = CONFIG.minMaskRadius + (intensity * CONFIG.maxMaskRadius);
                    const feather = CONFIG.maskFeather;

                    const maskValue = `radial-gradient(circle ${radius}px at ${maskX}px ${maskY}px, black 100%, transparent calc(100% + ${feather}px))`;
                    overlay.style.webkitMaskImage = maskValue;
                    overlay.style.maskImage = maskValue;
                }

            } else {
                // Reset to idle
                stack.style.zIndex = "2";
                stack.style.transform = `translateY(var(--y-offset, 0px)) scale(1)`;
                stack.style.filter = `brightness(0.7) contrast(1.0) grayscale(0.2)`; // Idle state
                if (overlay) {
                    overlay.style.opacity = '0';
                }
            }
        });

        requestRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Enhanced Guard: Disable reveal on Tablet/Mobile or Touch-only devices
        const isSmallScreen = window.innerWidth <= 1024;
        const isTouchUI = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;

        if (isSmallScreen || isTouchUI || isTouch) {
            // Treat as static state
            return;
        }

        const onMouseMove = (e: MouseEvent) => {
            stateRef.current.mouse.targetX = e.clientX;
            stateRef.current.mouse.targetY = e.clientY;
            stateRef.current.mouse.isHovering = true;
        };
        const onMouseLeave = () => {
            stateRef.current.mouse.isHovering = false;
        };
        const onResize = () => updateRects();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('resize', onResize);

        updateRects();
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('resize', onResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isTouch, updateRects, animate]);

    // Flag to disable the entire interactive reveal
    const isDisabled = isTouch === true || (typeof window !== 'undefined' && window.innerWidth <= 1024);

    return {
        isTouch: isDisabled,
        containerRef,
        setStackRef
    };
}
