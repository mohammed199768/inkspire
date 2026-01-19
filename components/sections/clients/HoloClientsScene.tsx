"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { usePopup } from '@/hooks/usePopup';
import { buildPopupFromProject } from '@/lib/popupMappers';
import { projects } from '@/data/projects';
import { clients } from '@/data/clients';
import styles from './HoloClientsScene.module.css';

// Post-processing imports
// Allows for standard three.js / examples import structure
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

// --- VISUAL CONFIG ---
const GLOW_CONFIG = {
    enabled: true,
    color: "rgba(168, 85, 247, 0.45)", // Subtle Purple
    cardAccent: "#a0a0ff",             // Indigo Accent
    bloomThreshold: 0.9,               // High threshold = less glow
    bloomStrength: 0.35,              // Subdued glow
    bloomRadius: 0.25,
    maxPixelRatio: 1.25
};

export default function HoloClientsScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorTextRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const holoRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const { openPopup } = usePopup();

    // Scene Refs
    const reqIdRef = useRef<number | null>(null);
    const isVisible = useRef(true);
    const sceneRefs = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        composer: EffectComposer;
        slates: THREE.Group[];
        rgbShift: ShaderPass;
        bloomPass: UnrealBloomPass;
        raycaster: THREE.Raycaster;
        mouse: THREE.Vector2;
        droneLight: THREE.PointLight;
        activeSlate: THREE.Group | null;
    } | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;
        
        // --- 1. SETUP ---
        const scene = new THREE.Scene();
        // Dark fog for depth
        scene.fog = new THREE.FogExp2(0x050510, 0.015);

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: false,
            powerPreference: "high-performance" 
        });
        renderer.setSize(width, height);

        // Safari Detection
        const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        // Performance first
        renderer.setPixelRatio(isSafari ? Math.min(window.devicePixelRatio, 1.2) : Math.min(window.devicePixelRatio, 1.25));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        canvasRef.current.appendChild(renderer.domElement);

        // Visibility Observer
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible.current = entry.isIntersecting;
                if (entry.isIntersecting && !reqIdRef.current) {
                    animate();
                }
            },
            { threshold: 0 }
        );
        observer.observe(containerRef.current);

        // --- 2. POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Bloom (Glow) - Recalibrated to remove white over-burn
        const bloomPass = new (UnrealBloomPass as any)(
            new THREE.Vector2(width, height), 
            GLOW_CONFIG.bloomStrength, 
            GLOW_CONFIG.bloomRadius, 
            GLOW_CONFIG.bloomThreshold
        );
        bloomPass.threshold = GLOW_CONFIG.bloomThreshold;
        bloomPass.strength = GLOW_CONFIG.bloomStrength;
        bloomPass.radius = GLOW_CONFIG.bloomRadius;
        composer.addPass(bloomPass);

        // Film Grain
        const filmPass = new (FilmPass as any)(0.35, 0.025, 648, false);
        composer.addPass(filmPass);

        // RGB Shift (Glitch)
        const rgbShift = new ShaderPass(RGBShiftShader);
        rgbShift.uniforms['amount'].value = 0.0015;
        composer.addPass(rgbShift);

        // --- 3. HELPERS ---
        // Texture Generator with Logo Support
        const createHoloCardTexture = (client: any, colorHex: string | number) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512; 
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            // Create texture immediately
            const tex = new THREE.CanvasTexture(canvas);
            if(!ctx) return tex;

            const color = '#' + new THREE.Color(colorHex).getHexString();

            const draw = (img?: HTMLImageElement) => {
                ctx.clearRect(0,0,512,512);

                // 1. Neon Frame - Subtle Purple
                ctx.shadowBlur = 4;
                ctx.shadowColor = GLOW_CONFIG.color;
                ctx.strokeStyle = color;
                ctx.lineWidth = 6;
                ctx.strokeRect(50, 100, 412, 312);

                // 2. Content
                ctx.shadowBlur = 3;
                ctx.shadowColor = GLOW_CONFIG.color;
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (img) {
                    // Draw Logo - Contain Logic
                    const maxWidth = 350;
                    const maxHeight = 250;
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;

                    // Save context to apply glow to image safely
                    ctx.save();
                    // Optional: Make logo monochromatic/white for true holo effect? 
                    // For now, let's keep original colors but add glow. 
                    // To make it truly "Holo", we often want it white/tinted.
                    // Let's try drawing it as-is but with screen blending or just reliance on the material.
                    
                    // Center
                    ctx.drawImage(img, 256 - w/2, 256 - h/2, w, h);
                    ctx.restore();
                } else {
                    // Fallback Text
                    const text = client.name || "CLIENT";
                    ctx.font = 'bold 50px Arial'; 
                    // Break text into lines if too long
                    const words = text.split(' ');
                    if(words.length > 1) {
                        ctx.fillText(words.slice(0, Math.ceil(words.length/2)).join(' '), 256, 236);
                        ctx.fillText(words.slice(Math.ceil(words.length/2)).join(' '), 256, 286);
                    } else {
                        ctx.fillText(text, 256, 256);
                    }
                }
                
                tex.needsUpdate = true;
            };

            // Initial render (Frame only)
            draw();

            // Load Image
            if (client.logo) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = client.logo;
                img.onload = () => {
                    draw(img);
                };
            } else {
                // If no logo, we already drew the frame + (missing text logic in initial draw? fixed below)
                // Actually initial draw didn't have text. Let's redraw with text if no logo.
                draw(); 
            }

            return tex;
        };

        // --- 4. BUILD SLATES ---
        const slates: THREE.Group[] = [];
        const geometry = new THREE.PlaneGeometry(12, 7);
        const frameGeo = new THREE.BoxGeometry(12.5, 7.5, 0.5);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.4 });
        
        // Grid setup
        const displayClients = clients.slice(0, 9); 
        const cols = 3;
        const spacingX = 16;
        const spacingY = 11;

        displayClients.forEach((client, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            const group = new THREE.Group();

            // Frame
            const frame = new THREE.Mesh(frameGeo, frameMat);
            group.add(frame);

            // Screen
            const tex = createHoloCardTexture(client, 0xa0a0ff); 
            
            const screenMat = new THREE.MeshBasicMaterial({
                map: tex,
                transparent: true,
                opacity: isSafari ? 0.7 : 0.85,
                blending: THREE.AdditiveBlending,
                side: THREE.FrontSide,
                alphaTest: 0.5,
                depthWrite: false
            });
            const screen = new THREE.Mesh(geometry, screenMat);
            screen.position.z = 0.3;
            group.add(screen);

            // Grid Layout Centered
            const x = (col - 1) * spacingX;
            const y = -(row - 1) * spacingY;
            const z = (Math.random() - 0.5) * 5; 

            group.position.set(x, y, z);

            group.userData = {
                originalPos: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0,0,0),
                clientData: client,
                isHovered: false
            };

            scene.add(group);
            slates.push(group);
        });

        // --- 5. LIGHTING ---
        const droneLight = new THREE.PointLight(0xa0a0ff, 3, 50);
        scene.add(droneLight);
        
        const ambientLight = new THREE.AmbientLight(0x4040a0, 0.5);
        scene.add(ambientLight);

        // --- 6. INTERACTION STATE ---
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-999, -999); 

        // Store refs
        sceneRefs.current = {
            scene, camera, renderer, composer,
            slates, rgbShift, bloomPass, raycaster, mouse, droneLight,
            activeSlate: null
        };

        // --- 7. ANIMATION LOOP ---
        const animate = () => {
            if (isVisible.current) {
                reqIdRef.current = requestAnimationFrame(animate); 
            }
            
            if (!isVisible.current) return;

            const state = sceneRefs.current;
            if(!state) return;

            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const time = (Date.now() * 0.001) * (prefersReducedMotion ? 0.3 : 1);

            // Update Slates Physics
            state.slates.forEach(group => {
                const data = group.userData;
                
                // Floating
                const floatY = Math.sin(time + group.position.x * 0.5) * 0.02;

                // Physics (Spring back to original)
                const targetX = data.originalPos.x;
                const targetY = data.originalPos.y + Math.sin(time + group.position.x)*0.3; 
                const targetZ = data.originalPos.z;

                data.velocity.x += (targetX - group.position.x) * 0.05;
                data.velocity.y += (targetY - group.position.y) * 0.05;
                data.velocity.z += (targetZ - group.position.z) * 0.05;

                // Damping
                data.velocity.multiplyScalar(0.9);
                group.position.add(data.velocity);

                // Rotation tracking mouse (Look At effect)
                const mouseX3D = state.mouse.x * 40; 
                const mouseY3D = state.mouse.y * 30;

                if (state.activeSlate !== group) {
                    group.rotation.x += ((mouseY3D * 0.01 - group.position.y * 0.05) * 0.05 - group.rotation.x) * 0.1;
                    group.rotation.y += ((mouseX3D * 0.01 - group.position.x * 0.05) * 0.05 - group.rotation.y) * 0.1;
                } else {
                    // Active/Hovered state
                    group.rotation.x += (0 - group.rotation.x) * 0.1;
                    group.rotation.y += (0 - group.rotation.y) * 0.1;
                    group.position.z += (15 - group.position.z) * 0.1; 
                }
            });

            // Random Glitch
            if (Math.random() > 0.99) {
                state.rgbShift.uniforms['amount'].value = 0.005;
            } else {
                state.rgbShift.uniforms['amount'].value = 0.0015;
            }

            // Move Light
            state.droneLight.position.x += ((state.mouse.x * 30) - state.droneLight.position.x) * 0.1;
            state.droneLight.position.y += ((state.mouse.y * 20) - state.droneLight.position.y) * 0.1;
            state.droneLight.position.z = 20;

            state.composer.render();
        };
        animate();

        // --- 8. EVENTS ---
        const onMouseMove = (e: MouseEvent) => {
            if(!canvasRef.current || !sceneRefs.current || !cursorRef.current) return;
            
            const rect = canvasRef.current.getBoundingClientRect();
            // Local mouse coordinates (-1 to 1) relative to container
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            sceneRefs.current.mouse.set(x, y);

            // Update Custom Cursor (Visual only) using DOM
            // NOTE: Custom cursor follows mouse within container
            const cursorX = e.clientX - rect.left;
            const cursorY = e.clientY - rect.top;
            
            // Only show cursor if inside
            if (x >= -1 && x <= 1 && y >= -1 && y <= 1) {
                cursorRef.current.style.display = 'block';
                cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            } else {
                cursorRef.current.style.display = 'none';
            }

            // Raycasting
            sceneRefs.current.raycaster.setFromCamera(sceneRefs.current.mouse, sceneRefs.current.camera);
            
            // Intersect with frame/planes
            const targetObjects: THREE.Object3D[] = [];
            sceneRefs.current.slates.forEach(g => targetObjects.push(...g.children));

            const intersects = sceneRefs.current.raycaster.intersectObjects(targetObjects, false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                const parentGroup = hit.parent as THREE.Group; 
                
                if (parentGroup && sceneRefs.current.activeSlate !== parentGroup) {
                    sceneRefs.current.activeSlate = parentGroup;
                    
                    // UI Updates via Refs
                    if(cursorTextRef.current) cursorTextRef.current.innerText = "DETECTED";
                    if(cursorCircleRef.current) cursorCircleRef.current.style.borderColor = "#a0a0ff";

                    if(holoRef.current && titleRef.current && subRef.current) {
                        holoRef.current.style.opacity = '1';
                        holoRef.current.style.visibility = 'visible';
                        // Safety check for title
                        const name = parentGroup.userData.clientData.name || "CLIENT";
                        const slug = parentGroup.userData.clientData.projectSlug || "SYSTEM PARTNER";
                        
                        titleRef.current.innerText = name;
                        subRef.current.innerText = slug;
                    }
                    
                    // Audio/Haptic FX
                     gsap.to(sceneRefs.current.rgbShift.uniforms['amount'], { value: 0.01, duration: 0.1, yoyo: true, repeat: 1 });
                }
            } else {
                if (sceneRefs.current.activeSlate) {
                    sceneRefs.current.activeSlate = null;
                    
                    if(cursorTextRef.current) cursorTextRef.current.innerText = "SCANNING";
                    if(cursorCircleRef.current) cursorCircleRef.current.style.borderColor = "rgba(160, 160, 255, 0.5)";

                    if(holoRef.current) {
                        holoRef.current.style.opacity = '0';
                        holoRef.current.style.visibility = 'hidden';
                    }
                }
            }
        };

        const onMouseDown = () => {
             if(cursorCircleRef.current) {
                  cursorCircleRef.current.style.transform = "scale(0.8)";
             }
             if(sceneRefs.current?.activeSlate) {
                 gsap.to(sceneRefs.current.bloomPass, { strength: 3, duration: 0.1, yoyo: true, repeat: 1 });
             }
        };

        const onMouseUp = () => {
             if(cursorCircleRef.current) {
                  cursorCircleRef.current.style.transform = "scale(1)";
             }
             // Click Logic
             if(sceneRefs.current?.activeSlate) {
                 const client = sceneRefs.current.activeSlate.userData.clientData;
                 
                 // Reuse existing logic from ClientMarquee
                 if (client.projectSlug) {
                    const project = projects.find(p => p.slug === client.projectSlug);
                    if (project) {
                        openPopup(buildPopupFromProject(project));
                        return;
                    }
                }
                const randomProject = projects[Math.floor(Math.random() * projects.length)];
                if (randomProject) {
                    openPopup(buildPopupFromProject(randomProject));
                }
             }
        };

        const handleResize = () => {
            if(!containerRef.current || !sceneRefs.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            
            sceneRefs.current.camera.aspect = width / height;
            sceneRefs.current.camera.updateProjectionMatrix();
            sceneRefs.current.renderer.setSize(width, height);
            sceneRefs.current.composer.setSize(width, height);
        };

        // Attach listeners
        containerRef.current.addEventListener('mousemove', onMouseMove);
        containerRef.current.addEventListener('mousedown', onMouseDown);
        containerRef.current.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        return () => {
            if(reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            if(containerRef.current) {
                containerRef.current.removeEventListener('mousemove', onMouseMove);
                containerRef.current.removeEventListener('mousedown', onMouseDown);
                containerRef.current.removeEventListener('mouseup', onMouseUp);
            }
            
            // Dispose Three.js
            if(sceneRefs.current) {
                sceneRefs.current.renderer.dispose();
                sceneRefs.current.composer.dispose();
                sceneRefs.current.slates.forEach(g => {
                    // Dispose meshes inside group
                    g.traverse((obj) => {
                        if((obj as THREE.Mesh).isMesh) {
                            (obj as THREE.Mesh).geometry.dispose();
                            const mat = (obj as THREE.Mesh).material;
                            if(Array.isArray(mat)) mat.forEach(m => m.dispose());
                            else (mat as THREE.Material).dispose();
                        }
                    });
                });
            }
            if(canvasRef.current) {
                canvasRef.current.innerHTML = '';
            }
        };

    }, []); // Run once on mount

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[500px] overflow-visible">
            {/* Scoped Canvas */}
            <div ref={canvasRef} className={styles.canvasContainer} />

            {/* Drone Cursor (Scoped) */}
            <div ref={cursorRef} className={styles.cursor}>
                <div ref={cursorCircleRef} className={styles.cursorCircle} />
                <div className={styles.cursorDot} />
                <div ref={cursorTextRef} className={styles.cursorText}>SCANNING</div>
            </div>

            {/* Screen FX Overlay */}
            <div className={styles.screenFx} />

            {/* Holo Data Interface */}
            <div ref={holoRef} className={styles.holoInterface}>
                <div className={styles.holoFrame}>
                    <h1 ref={titleRef} className={styles.holoTitle}>CLIENT</h1>
                    <div ref={subRef} className={styles.holoSubtitle}>SYSTEM PARTNER</div>
                    <div className={styles.holoScan} />
                </div>
            </div>

            {/* System Status */}
            <div ref={statusRef} className={styles.systemStatus}>
                SYSTEM: ONLINE<br/>
                RENDER: QUANTUM CORE<br/>
                <span className={styles.blinking}>_WAITING FOR INPUT</span>
            </div>
        </div>
    );
}
