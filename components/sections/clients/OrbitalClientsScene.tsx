"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { clients } from '@/data/clients';
import { projects } from '@/data/projects';
import { usePopup } from '@/hooks/usePopup';
import { buildPopupFromProject } from '@/lib/popupMappers';
import styles from './OrbitalClientsScene.module.css';

// --- VISUAL CONFIG ---
const VISUAL_CONFIG = {
    glowColor: "rgba(168, 85, 247, 0.35)", // Subtle Purple
    accentColor: "#a0a0ff",                // Indigo Accent
    cardOpacity: 0.85,
    shadowBlur: 3,                         // Minimal glow
    logoGlowOpacity: 0.25
};

export default function OrbitalClientsScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const { openPopup } = usePopup();

    // UI Refs
    const infoPanelRef = useRef<HTMLDivElement>(null);
    const infoNameRef = useRef<HTMLHeadingElement>(null);
    const infoCatRef = useRef<HTMLSpanElement>(null);
    const infoDescRef = useRef<HTMLParagraphElement>(null);

    // Three.js State Refs
    const sceneRefs = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        items: THREE.Group[];
        stars: THREE.Points;
        raycaster: THREE.Raycaster;
        mouse: THREE.Vector2;
        hoveredItem: THREE.Group | null;
        isPaused: boolean;
        reqId: number | null;
        isVisible: boolean;
    } | null>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        // --- 1. SETUP ---
        const scene = new THREE.Scene();
        // Dark fog to blend with section background
        scene.fog = new THREE.FogExp2(0x020205, 0.002);

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 10, 90);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);

        // Safari detection
        const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Optimized pixel ratio: Safari on desktop often struggles with high-DPI + filters
        renderer.setPixelRatio(isSafari ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.5));
        canvasRef.current.appendChild(renderer.domElement);

        // Visibility Observer
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (sceneRefs.current) {
                    sceneRefs.current.isVisible = entry.isIntersecting;
                    // Restart loop if it becomes visible
                    if (entry.isIntersecting && !sceneRefs.current.reqId) {
                        animate();
                    }
                }
            },
            { threshold: 0 }
        );
        observer.observe(containerRef.current);

        // --- 2. HELPERS ---
        
        // Helper to draw the card canvas
        const drawCardCanvas = (ctx: CanvasRenderingContext2D, text: string, color: string, img?: HTMLImageElement) => {
            const w = 512;
            const h = 512;

            ctx.clearRect(0, 0, w, h);

            // Glass Background
            ctx.fillStyle = `rgba(20, 20, 30, ${VISUAL_CONFIG.cardOpacity})`;
            // Rounded Rect manual
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(10, 10, 492, 492, 40);
                ctx.fill();
            } else {
                ctx.fillRect(10, 10, 492, 492);
            }

            // Glowy Border - Use subtle config
            ctx.shadowBlur = VISUAL_CONFIG.shadowBlur;
            ctx.shadowColor = VISUAL_CONFIG.glowColor;
            ctx.strokeStyle = color;
            ctx.lineWidth = 8; // Slightly thinner edge
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(10, 10, 492, 492, 40);
                ctx.stroke();
            } else {
                ctx.strokeRect(10, 10, 492, 492);
            }
            
            // Reset Shadow specifically for image/text clarity
            ctx.shadowBlur = 0;

            if (img) {
                 // Contain Image Logic
                 const maxWidth = 350;
                 const maxHeight = 250;
                 const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                 const logoW = img.width * scale;
                 const logoH = img.height * scale;

                 // Draw Logo
                 ctx.save();
                 // Safari + Universal Fix: No hard white halos
                 ctx.shadowBlur = VISUAL_CONFIG.shadowBlur;
                 ctx.shadowColor = VISUAL_CONFIG.glowColor;
                 ctx.drawImage(img, 256 - logoW/2, 256 - logoH/2, logoW, logoH);
                 ctx.restore();
            } else {
                // Text Fallback
                ctx.shadowBlur = VISUAL_CONFIG.shadowBlur;
                ctx.shadowColor = VISUAL_CONFIG.glowColor;
                ctx.font = 'bold 60px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const words = text.split(' ');
                if (words.length > 1) {
                    ctx.fillText(words.slice(0, Math.ceil(words.length/2)).join(' '), 256, 220);
                    ctx.fillText(words.slice(Math.ceil(words.length/2)).join(' '), 256, 290);
                } else {
                    ctx.fillText(text, 256, 256);
                }
            }

            // Bottom Label "PARTNER"
            ctx.shadowBlur = 0;
            ctx.font = 'bold 30px Arial';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.fillText("PARTNER", 256, 420);
        };

        const createCardTexture = (client: any) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512; 
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            const tex = new THREE.CanvasTexture(canvas);
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            
            if (!ctx) return tex;

            const color = "#a0a0ff"; 

            // Initial Draw
            drawCardCanvas(ctx, client.name || "CLIENT", color);

            // Load Image async
            if (client.logo) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = client.logo;
                img.onload = () => {
                    drawCardCanvas(ctx, client.name, color, img);
                    tex.needsUpdate = true;
                };
            }

            return tex;
        };

        const createGlowSprite = (color: string) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64; canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                const gradient = ctx.createRadialGradient(32,32,0, 32,32,32);
                gradient.addColorStop(0, color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0,0,64,64);
            }
            
            const tex = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ 
                map: tex, 
                transparent: true, 
                opacity: isSafari ? 0.35 : 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false // <--- هام جداً: منع الوهج من حجب الأشياء خلفه
            });
            return new THREE.Sprite(material);
        };

        // --- 3. BUILD ORBITS ---
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        const items: THREE.Group[] = [];
        const radiusStep = 22; // زدنا المسافة قليلاً لمنع التداخل الجسدي
        
        let clientIndex = 0;
        const ringCounts = [4, 8]; // Inner, Outer
        
        ringCounts.forEach((count, ringIndex) => {
            const radius = (ringIndex + 1.2) * radiusStep;
            
            let ringCount = count;
            if (ringIndex === ringCounts.length - 1) {
                ringCount = Math.max(count, clients.length - clientIndex);
            }
            
            for(let i=0; i < ringCount; i++) {
                if (clientIndex >= clients.length) break;
                
                const client = clients[clientIndex];
                const angle = (i / ringCount) * Math.PI * 2;

                const itemGroup = new THREE.Group();

                // 1. Card Mesh
                const geometry = new THREE.PlaneGeometry(8, 8);
                const tex = createCardTexture(client);
                
                // --- FIX APPLIED HERE ---
                const material = new THREE.MeshBasicMaterial({ 
                    map: tex,
                    transparent: true,
                    side: THREE.DoubleSide,
                    alphaTest: 0.5, // <--- هام جداً: قص الحواف الشفافة
                    depthWrite: true // <--- هام جداً: كتابة العمق الصحيح
                });

                const mesh = new THREE.Mesh(geometry, material);
                itemGroup.add(mesh);

                // 2. Glow Sprite
                const glow = createGlowSprite(VISUAL_CONFIG.glowColor);
                glow.scale.set(22, 22, 1);
                glow.position.z = -0.5; // خلف البطاقة مباشرة
                itemGroup.add(glow);

                // initial position on ring
                itemGroup.position.set(
                    Math.cos(angle) * radius,
                    0,
                    Math.sin(angle) * radius
                );

                itemGroup.userData = {
                    angle: angle,
                    radius: radius,
                    speed: (ringIndex % 2 === 0 ? 0.15 : -0.10) * (1 / (ringIndex + 0.5)),
                    yOffset: Math.random() * 100,
                    clientData: client,
                    originalScale: 1
                };

                mainGroup.add(itemGroup);
                items.push(itemGroup);
                clientIndex++;
            }
        });

        // --- 4. STARS ---
        const starsGeo = new THREE.BufferGeometry();
        const starCount = 800;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) {
            starPos[i] = (Math.random() - 0.5) * 350;
        }
        starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starsMat = new THREE.PointsMaterial({
            color: 0x8888cc, 
            size: 0.6, 
            transparent: true, 
            opacity: 0.4,
            depthWrite: false // النجوم لا تحجب شيئاً
        });
        const stars = new THREE.Points(starsGeo, starsMat);
        scene.add(stars);

        // --- 5. INTERACTION UTILS ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-999, -999);

        // Store refs
        sceneRefs.current = {
            scene, camera, renderer, items, stars, raycaster, mouse,
            hoveredItem: null, isPaused: false, reqId: null, isVisible: true
        };

        // --- 6. ANIMATION LOOP ---
        const animate = () => {
            const r = sceneRefs.current;
            if(!r) return;
            
            if (r.isVisible) {
                r.reqId = requestAnimationFrame(animate);
            }

            if (!r.isVisible) return;

            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const time = (Date.now() * 0.001) * (prefersReducedMotion ? 0.3 : 1);

            // Rotate stars slowly
            r.stars.rotation.y = time * 0.03;

            // Orbit Items
            r.items.forEach(item => {
                // Ensure card always faces camera (Billboard)
                item.lookAt(r.camera.position);

                if (item !== r.hoveredItem) {
                    const data = item.userData;
                    
                    if (!r.isPaused) {
                        data.angle += data.speed * 0.01;
                    }

                    const x = Math.cos(data.angle) * data.radius;
                    const z = Math.sin(data.angle) * data.radius;
                    const y = Math.sin(time + data.yOffset) * 1.5;

                    item.position.set(x, y, z);
                }
            });

            // Camera Parallax with mouse (subtle)
            const parallaxX = r.mouse.x * 5;
            const parallaxY = r.mouse.y * 5 + 10; 
            
            r.camera.position.x += (parallaxX - r.camera.position.x) * 0.05;
            r.camera.position.y += (parallaxY - r.camera.position.y) * 0.05;
            r.camera.lookAt(0,0,0);

            r.renderer.render(r.scene, r.camera);
        };
        
        animate();

        // --- 7. EVENT HANDLERS ---
        const onMouseMove = (e: MouseEvent) => {
            if(!canvasRef.current || !sceneRefs.current) return;
            const state = sceneRefs.current;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            state.mouse.set(x, y);

            // Raycast
            state.raycaster.setFromCamera(state.mouse, state.camera);
            // Intersect only the mesh children of the groups
            const meshes = state.items.map(g => g.children[0]);
            const intersects = state.raycaster.intersectObjects(meshes, false);

            if (intersects.length > 0) {
                const object = intersects[0].object.parent as THREE.Group;
                
                if (state.hoveredItem !== object) {
                    // Unhover previous
                    if (state.hoveredItem) {
                        gsap.to(state.hoveredItem.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    }

                    state.hoveredItem = object;
                    state.isPaused = true;
                    if(containerRef.current) containerRef.current.style.cursor = 'pointer';

                    // Scale Up
                    gsap.to(object.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.4, ease: "back.out(1.7)" });
                    
                    // Show UI
                    if (infoPanelRef.current) {
                         const client = object.userData.clientData;
                         if(infoNameRef.current) infoNameRef.current.innerText = client.name || "CLIENT";
                         if(infoCatRef.current) infoCatRef.current.innerText = "PARTNER"; 
                         if(infoDescRef.current) infoDescRef.current.innerText = client.projectSlug ? "View Case Study //" : "Strategic Partner";

                         infoPanelRef.current.classList.add(styles.infoPanelVisible);
                    }
                }
            } else {
                if (state.hoveredItem) {
                    gsap.to(state.hoveredItem.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    state.hoveredItem = null;
                    state.isPaused = false;
                    if(containerRef.current) containerRef.current.style.cursor = 'auto';
                    if (infoPanelRef.current) {
                        infoPanelRef.current.classList.remove(styles.infoPanelVisible);
                    }
                }
            }
        };

        const onClick = (e: MouseEvent) => {
            if(!sceneRefs.current || !sceneRefs.current.hoveredItem) return;
            const client = sceneRefs.current.hoveredItem.userData.clientData;
            
            if (client.projectSlug) {
                const project = projects.find(p => p.slug === client.projectSlug);
                if(project) {
                    openPopup(buildPopupFromProject(project));
                    return;
                }
            }
            // Fallback random
            const randomProject = projects[Math.floor(Math.random() * projects.length)];
            if(randomProject) openPopup(buildPopupFromProject(randomProject));
        };

        const onResize = () => {
            if(!sceneRefs.current || !containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            sceneRefs.current.camera.aspect = w / h;
            sceneRefs.current.camera.updateProjectionMatrix();
            sceneRefs.current.renderer.setSize(w, h);
        };

        // Bind Events
        const el = containerRef.current;
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('click', onClick);
        window.addEventListener('resize', onResize);

        // --- CLEANUP ---
        return () => {
            if(sceneRefs.current?.reqId) cancelAnimationFrame(sceneRefs.current.reqId);
            observer.disconnect();
            window.removeEventListener('resize', onResize);
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('click', onClick);

            if(sceneRefs.current) {
                sceneRefs.current.renderer.dispose();
            }
            if(canvasRef.current) canvasRef.current.innerHTML = '';
        };

    }, [openPopup]);

    return (
        <div ref={containerRef} className={styles.sceneWrap}>
            {/* BG UI */}
            <div className={styles.bgUI}>
                <div className={styles.bgCircle}></div>
                <div className={styles.bgLabel}>PARTNERS</div>
            </div>

            {/* Canvas Container */}
            <div ref={canvasRef} className={styles.canvasContainer} />

            {/* Info Panel Overlay */}
            <div ref={infoPanelRef} className={styles.infoPanel}>
                <div className={styles.panelBox}>
                    <span ref={infoCatRef} className={styles.panelCategory}>TECHNOLOGY</span>
                    <h2 ref={infoNameRef} className={styles.panelTitle}>Client Name</h2>
                    <p ref={infoDescRef} className={styles.panelDesc}>Strategic partnership focused on digital transformation.</p>
                </div>
            </div>
        </div>
    );
}
