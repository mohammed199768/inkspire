import React from 'react';

interface SectionTitleProps {
    title: string;
    highlight: string;
    highlightColor?: string;
    className?: string;
}

export default function SectionTitle({ title, highlight, highlightColor = "text-purple-400", className = "" }: SectionTitleProps) {
    return (
        <h2 
            className={`fade-up text-center ${className}`}
            style={{ marginBottom: 'var(--space-xl)' }}
        >
            {title} <span className={highlightColor}>{highlight}</span>
        </h2>
    );
}
