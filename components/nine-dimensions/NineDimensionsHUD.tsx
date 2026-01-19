"use client";

import React from "react";

interface NineDimensionsHUDProps {
    currentSection: number;
    totalSections: number;
    onDotClick: (index: number) => void;
    isAnimating: boolean;
}

export default function NineDimensionsHUD({ 
    currentSection, 
    totalSections, 
    onDotClick,
    isAnimating 
}: NineDimensionsHUDProps) {
    return (
        <>
            {/* Scroll Hint - Desktop Only */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-50'}`}>
                <div className="text-[10px] tracking-[3px] text-white/50 uppercase select-none animate-pulse">
                    Scroll / Arrow Keys
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
                {Array.from({ length: totalSections }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => !isAnimating && onDotClick(idx)}
                        className={`group relative flex items-center justify-center w-3 h-3 rounded-full transition-all duration-300`}
                        aria-label={`Go to section ${idx + 1}`}
                    >
                        {/* Dot */}
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 
                            ${currentSection === idx 
                                ? 'bg-[#a0a0ff] scale-150 shadow-[0_0_10px_#a0a0ff]' 
                                : 'bg-white/20 group-hover:bg-white/50'}`} 
                        />
                        
                        {/* Optional Tooltip/Number (Hidden by default, reveal on hover) */}
                        <span className={`absolute right-6 text-[10px] text-white/80 tracking-widest opacity-0 -translate-x-2 transition-all duration-300
                            ${currentSection === idx ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}`}>
                            0{idx + 1}
                        </span>
                    </button>
                ))}
            </div>
        </>
    );
}
