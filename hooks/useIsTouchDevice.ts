"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkTouch = () => {
            return (
                window.matchMedia("(pointer: coarse)").matches ||
                window.matchMedia("(hover: none)").matches ||
                navigator.maxTouchPoints > 0
            );
        };

        setIsTouch(checkTouch());
    }, []);

    return isTouch;
}
