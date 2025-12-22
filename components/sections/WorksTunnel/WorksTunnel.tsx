"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, ExternalLink } from 'lucide-react';
import styles from './WorksTunnel.module.css';
import { works } from '@/data/staticData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Work {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    socials?: {
        behanceUrl?: string;
        instagramUrl?: string;
        facebookUrl?: string;
        twitterUrl?: string;
    };
    // The actual data structure from staticData.ts has social (singular)
    social: {
        behanceUrl?: string;
        instagramUrl?: string;
        facebookUrl?: string;
        twitterUrl?: string;
    };
}

const ringRadius = 600;
const ringGap = 200; // Tighter vertical gap for continuous feel
const imagesPerRing = 12; // Far more items per ring for density

// Massive duplication to fill the depth
const massiveWorks = Array(10).fill(works).flat();

const WorksTunnel: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);
    const [hoverActive, setHoverActive] = useState(false);

    // Animation refs
    const scrollTargetRef = useRef(0);
    const scrollCurrentRef = useRef(0);
    const hoverActiveRef = useRef(false);
    const requestRef = useRef<number>();

    // Refs for DOM elements to animate
    const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rotRefs = useRef<number[]>([]);
    // Refs for panels to set initial transforms
    const panelRefs = useRef<(HTMLDivElement | null)[][]>([]);

    useEffect(() => {
        hoverActiveRef.current = hoverActive;
    }, [hoverActive]);

    const ringsCount = Math.ceil(massiveWorks.length / imagesPerRing);
    const rings = Array.from({ length: ringsCount });

    useEffect(() => {
        // Initialize rotations
        const ringsCount = Math.ceil(massiveWorks.length / imagesPerRing);
        rotRefs.current = Array.from({ length: ringsCount }).map(() => Math.random() * 360);

        // Adjust for mobile screens
        const isMobile = window.innerWidth < 768;
        const currentRadius = isMobile ? 350 : ringRadius;

        // Initialize panel positions
        panelRefs.current.forEach((ringPanels, ringIndex) => {
            ringPanels.forEach((panel, panelIndex) => {
                if (!panel) return;
                const angle = (360 / imagesPerRing) * panelIndex;
                // Move panel setup here to handle mobile radius
                panel.style.transform = `rotateY(${angle}deg) translateZ(${currentRadius}px) translate(-50%, -50%)`;
            });
        });

        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate relative scroll progress
            const progress = -rect.top;
            scrollTargetRef.current = progress;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        // Refresh ScrollTrigger to account for new container height
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
        });

        const animate = () => {
            // Much smoother interpolation (0.04 instead of 0.08)
            scrollCurrentRef.current += (scrollTargetRef.current - scrollCurrentRef.current) * 0.04;

            ringRefs.current.forEach((ring, i) => {
                if (!ring) return;

                const baseY = -i * ringGap;
                // Slower multiplier (1.2 instead of 1.5) to keep items on screen longer
                const y = baseY + (scrollCurrentRef.current * 1.1);

                const speed = hoverActiveRef.current ? 0.08 : 0.2;
                rotRefs.current[i] += speed;

                ring.style.transform = `translate3d(0, ${y}px, 0) rotateY(${rotRefs.current[i]}deg)`;
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const closeOverlay = () => setSelectedWork(null);

    return (
        <section ref={containerRef} className={styles.container}>
            <div className={styles.sceneWrapper}>
                <div className={styles.stack}>
                    <div className={styles.centerBrand}>INKSPIRE</div>

                    {rings.map((_, ringIndex) => (
                        <div
                            key={ringIndex}
                            className={styles.ring}
                            ref={el => { ringRefs.current[ringIndex] = el; }}
                        >
                            {Array.from({ length: imagesPerRing }).map((__, panelIndex) => {
                                const workIndex = ringIndex * imagesPerRing + panelIndex;
                                if (workIndex >= massiveWorks.length) return null;

                                const work = massiveWorks[workIndex] as unknown as Work;

                                return (
                                    <div
                                        key={`${work.id}-${ringIndex}-${panelIndex}`}
                                        className={styles.panel}
                                        ref={el => {
                                            if (!panelRefs.current[ringIndex]) panelRefs.current[ringIndex] = [];
                                            panelRefs.current[ringIndex][panelIndex] = el;
                                        }}
                                        onMouseEnter={() => setHoverActive(true)}
                                        onMouseLeave={() => setHoverActive(false)}
                                        onClick={() => setSelectedWork(work)}
                                    >
                                        <div className={styles.thumb}>
                                            <Image
                                                src={work.imageUrl}
                                                alt={work.title}
                                                className={styles.img}
                                                fill
                                                sizes="220px"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Overlay */}
            <div
                className={cn(styles.overlay, selectedWork && styles.overlayActive)}
                onClick={(e) => e.target === e.currentTarget && closeOverlay()}
            >
                {selectedWork && (
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{selectedWork.title}</h2>
                        <div className={styles.cardSubtitle}>{selectedWork.subtitle}</div>
                        <p className={styles.cardDesc}>{selectedWork.description}</p>

                        <div className={styles.socials}>
                            {selectedWork.social?.behanceUrl && selectedWork.social.behanceUrl !== "#" && (
                                <a href={selectedWork.social.behanceUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Behance">
                                    <ExternalLink size={20} />
                                </a>
                            )}
                            {selectedWork.social?.instagramUrl && selectedWork.social.instagramUrl !== "#" && (
                                <a href={selectedWork.social.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Instagram">
                                    <Instagram size={20} />
                                </a>
                            )}
                            {selectedWork.social?.facebookUrl && selectedWork.social.facebookUrl !== "#" && (
                                <a href={selectedWork.social.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Facebook">
                                    <Facebook size={20} />
                                </a>
                            )}
                            {selectedWork.social?.twitterUrl && selectedWork.social.twitterUrl !== "#" && (
                                <a href={selectedWork.social.twitterUrl} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} title="Twitter">
                                    <Twitter size={20} />
                                </a>
                            )}
                        </div>

                        <button className={styles.closeBtn} onClick={closeOverlay}>
                            Close Project
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default WorksTunnel;
