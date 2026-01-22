import React from 'react';

interface SectionTitleProps {
    title: string;
    highlight: string;
    highlightColor?: string;
    className?: string;
}

export default function SectionTitle({ title, highlight, highlightColor = "text-accentPurple", className = "" }: SectionTitleProps) {
    return (
        <h2 
            className={`fade-up relative z-20 text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 text-center ${className}`}
        >
            {title} <span className={highlightColor}>{highlight}</span>
        </h2>
    );
}
