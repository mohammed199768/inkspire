"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useAnimatedCounter(
    containerRef: RefObject<HTMLElement>,
    countRef: RefObject<HTMLElement>,
    value: string
) {
    const numValue = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        const el = countRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        // Initial state
        el.innerText = "0" + suffix;

        const ctx = gsap.context(() => {
            gsap.from(container, {
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    once: true
                },
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            const proxy = { val: 0 };
            gsap.to(proxy, {
                val: numValue,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    once: true,
                },
                onUpdate: () => {
                    el.innerText = Math.ceil(proxy.val) + suffix;
                }
            });
        }, container);

        return () => ctx.revert();
    }, [containerRef, countRef, numValue, suffix]);

    return { suffix };
}
