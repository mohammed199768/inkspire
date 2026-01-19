"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './WorksTunnel.module.css';
import { projects } from '@/data/projects';
import { usePopup } from '@/hooks/usePopup';
import { buildPopupFromProject } from '@/lib/popupMappers';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function easeInOutCubic(t: number) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }

import { Project } from '@/types/project';

// --- CONFIG ---
const IMAGES_PER_RING = 6;
const TILT_X = 12;
const AUTO_SPEED = 0.012;

const WorksTunnel: React.FC = () => {
    const router = useRouter();
    const { openPopup } = usePopup();
    // --- STATE ---
    const [isSceneVisible, setIsSceneVisible] = useState(false);

    // UI Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<HTMLDivElement>(null);
    const stackRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    // Animation Refs
    const requestRef = useRef<number>();
    const timeRef = useRef(0);
    const pSmoothRef = useRef(0);
    const logoRotRef = useRef(0);

    const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[][]>([]);

    const dims = useRef({
        radius: 300,
        ringSpacing: 280
    });

    // --- LOGIC: DUPLICATE WORKS FOR DENSITY ---
    const massiveWorks = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        return [...projects, ...projects, ...projects];
    }, []);

    const numRings = Math.ceil(massiveWorks.length / IMAGES_PER_RING);
    const centerIndex = (numRings - 1) / 2;

    const ringsData = useMemo(() => {
        return Array.from({ length: numRings }).map((_, rIndex) => {
            const ringStart = rIndex * IMAGES_PER_RING;
            const ringWorks = massiveWorks.slice(ringStart, ringStart + IMAGES_PER_RING);
            return { index: rIndex, works: ringWorks };
        });
    }, [numRings, massiveWorks]);

    // Visibility Observer (Better performance than setState in loop)
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSceneVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // --- OVERLAY ANIMATION REMOVED (NOW USING UNIFIED POPUP) ---

    useEffect(() => {
        // Init Refs
        ringRefs.current = ringRefs.current.slice(0, numRings);
        cardRefs.current = cardRefs.current.slice(0, numRings);

        const handleResize = () => {
            if (typeof window === 'undefined') return;
            const isMobile = window.innerWidth < 520;
            dims.current.radius = isMobile ? 160 : 300;
            dims.current.ringSpacing = isMobile ? 200 : 280;

            ringRefs.current.forEach(r => {
                if (r) r.style.setProperty('--radius', `${dims.current.radius}px`);
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const tick = () => {
            if (!containerRef.current || !stackRef.current) {
                requestRef.current = requestAnimationFrame(tick);
                return;
            }

            const rect = containerRef.current.getBoundingClientRect();
            const winHeight = window.innerHeight;
            const total = rect.height - winHeight;

            let p = 0;
            if (total > 0) {
                const scrolled = clamp(-rect.top, 0, total);
                p = scrolled / total;
            }

            const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            
            timeRef.current += prefersReducedMotion ? AUTO_SPEED * 0.2 : AUTO_SPEED;
            pSmoothRef.current += (p - pSmoothRef.current) * (prefersReducedMotion ? 0.01 : 0.04);

            const t = easeInOutCubic(pSmoothRef.current);
            const idxFloat = t * (numRings - 1);
            const idx = Math.floor(idxFloat);
            const frac = idxFloat - idx;

            const curY = (idx - centerIndex) * dims.current.ringSpacing;
            const nextY = ((Math.min(idx + 1, numRings - 1)) - centerIndex) * dims.current.ringSpacing;
            const stackY = -lerp(curY, nextY, frac);
            const globalScale = Math.min(1, window.innerWidth / 600);

            stackRef.current.style.transform = `translate3d(0, ${stackY}px, 0) rotateX(${TILT_X}deg) scale(${globalScale})`;

            if (logoRef.current) {
                logoRotRef.current += 0.3;
                const logoOffsetY = -stackY * 0.9;
                logoRef.current.style.transform = `translate3d(-50%, calc(-50% + ${logoOffsetY}px), 0) rotateY(${logoRotRef.current}deg)`;
            }

            const scrollRot = t * 240;
            const breathing = Math.sin(timeRef.current * 0.5) * 10;
            const dynamicRadius = dims.current.radius + breathing + (Math.abs(p - pSmoothRef.current) * 100);

            ringRefs.current.forEach((ring, r) => {
                if (!ring) return;

                const y = (r - centerIndex) * dims.current.ringSpacing;
                const z = (r - centerIndex) * 40;
                const dist = Math.abs(r - idxFloat);
                let ringScale = 1;
                if (dist < 1.5) ringScale = lerp(1.15, 1.0, dist / 1.5);

                const direction = (r % 2 === 0) ? 1 : -1;
                const finalRot = (timeRef.current * 8 * direction) + (scrollRot * direction) + (r * 10);

                ring.style.transform = `translate3d(0, ${y}px, ${z}px) rotateY(${finalRot}deg) scale(${ringScale})`;

                const ringCards = cardRefs.current[r];
                if (ringCards) {
                    ringCards.forEach((card, cIndex) => {
                        if (!card) return;
                        const step = 360 / IMAGES_PER_RING;
                        const angle = cIndex * step;
                        const rad = (finalRot + angle) * Math.PI / 180;
                        const depth = Math.cos(rad);

                        card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${dynamicRadius}px)`;

                        if (depth < -0.2) {
                            card.style.opacity = '0.3';
                            card.style.zIndex = '0';
                        } else {
                            card.style.opacity = '1';
                            card.style.zIndex = '10';
                        }
                    });
                }
            });

            if (isSceneVisible) {
                requestRef.current = requestAnimationFrame(tick);
            }
        };

        if (isSceneVisible) {
            requestRef.current = requestAnimationFrame(tick);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [numRings, centerIndex, isSceneVisible]);


    return (
        <section ref={containerRef} className={styles.container}>
            <div
                ref={sceneRef}
                className={cn(styles.sceneWrapper, isSceneVisible ? styles.sceneActive : styles.sceneHidden)}
            >
                <div ref={stackRef} className={styles.stack}>
                    <div ref={logoRef} className={styles.centerBrand}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/logos/Inkspire logos/logo.svg"
                                alt="Inkspire Logo"
                                fill
                                className={styles.logoImg}
                            />
                        </div>
                    </div>

                    {ringsData.map((ring) => (
                        <div
                            key={ring.index}
                            className={styles.ring}
                            ref={el => { ringRefs.current[ring.index] = el; }}
                        >
                            {ring.works.map((work, wIndex) => (
                                <div
                                    key={`${work.id}-${ring.index}-${wIndex}`}
                                    className={styles.panel}
                                    ref={el => {
                                        if (!cardRefs.current[ring.index]) cardRefs.current[ring.index] = [];
                                        cardRefs.current[ring.index][wIndex] = el;
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPopup(buildPopupFromProject(work));
                                    }}
                                >
                                    <div className={styles.thumb}>
                                        <Image
                                            src={work.coverImage || "/works/placeholder.webp"}
                                            alt={work.title}
                                            className={styles.img}
                                            fill
                                            sizes="(max-width: 768px) 90vw, 800px"
                                            quality={80}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorksTunnel;
