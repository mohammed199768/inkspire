"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePageVisibility } from "@/hooks/usePageVisibility";

interface TypewriterTextProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
}

export default function TypewriterText({ 
    text, 
    speed = 50, 
    delay = 1000,
    className = "" 
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const isPageActive = usePageVisibility();

    useEffect(() => {
        if (!isPageActive) return;
        const startTimeout = setTimeout(() => {
            setIsStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay, isPageActive]);

    useEffect(() => {
        if (!isStarted || !isPageActive) return;

        if (displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [displayedText, text, speed, isStarted]);

    // Split text into lines if it contains <br /> or similar (passed as \n or just let HTML handle it)
    // For simplicity, we just type the string. If the user wants specific line breaks, they can pass them.

    return (
        <span className={className}>
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[3px] h-[0.9em] bg-white align-middle ml-1"
            />
        </span>
    );
}
