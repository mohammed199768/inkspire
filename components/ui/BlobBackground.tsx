"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BlobBackground() {
    const blobRef = useRef<SVGPathElement>(null);
    const dotRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        // Gentle floating animation for the main blob
        if (blobRef.current) {
            gsap.to(blobRef.current, {
                y: 30,
                scale: 1.05,
                rotation: 2,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                transformOrigin: "center center"
            });
        }

        // Slightly different animation for the dot to create depth
        if (dotRef.current) {
            gsap.to(dotRef.current, {
                y: -25,
                x: 10,
                scale: 0.9,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 0.5
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-70 mix-blend-screen">
            <svg
                viewBox="0 0 1152 768"
                className="w-full h-full object-cover blur-[60px] opacity-90 scale-125"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="blob1Gradient" cx="40%" cy="55%" r="60%">
                        <stop offset="0%" stopColor="#bf2de1" />
                        <stop offset="45%" stopColor="#7833f9" />
                        <stop offset="100%" stopColor="#5300d5" />
                    </radialGradient>

                    <radialGradient id="blob1Dot" cx="50%" cy="40%" r="70%">
                        <stop offset="0%" stopColor="#e13ae8" />
                        <stop offset="55%" stopColor="#7833f9" />
                        <stop offset="100%" stopColor="#3b00b8" />
                    </radialGradient>
                </defs>

                {/* Main Blob */}
                <path
                    ref={blobRef}
                    fill="url(#blob1Gradient)"
                    d="M 260 470 C 260 390 330 350 440 360 C 520 370 590 380 660 380 C 780 380 860 360 910 410 C 950 450 960 510 950 570 C 940 640 900 700 830 735 C 760 770 670 770 595 745 C 520 720 470 690 410 660 C 340 625 260 560 260 470 Z"
                />

                {/* Top Dot */}
                <circle
                    ref={dotRef}
                    cx="610"
                    cy="270"
                    r="70"
                    fill="url(#blob1Dot)"
                />
            </svg>
        </div>
    );
}
