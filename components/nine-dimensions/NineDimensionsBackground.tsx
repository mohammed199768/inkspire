"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface NineDimensionsBackgroundProps {
    targetShapeIndex: number;
}

// --- PALETTE CONSTANTS ---
const BG_BASE = "#09060f";
const BG_DEEP = "#0d0e22";
const BG_ACCENT = "#201037";

// --- PERFORMANCE PROFILES ---
const getProfile = () => {
    if (typeof window === 'undefined') return { mode: 'desktop', count: 1800, pixelRatio: 1.5, updateStep: 1, postFX: true };
    
    const w = window.innerWidth;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReduced) return { mode: 'mobile', count: 400, pixelRatio: 1.0, updateStep: 2, postFX: false };
    
    if (w < 768) {
        return { mode: 'mobile', count: 600, pixelRatio: 1.0, updateStep: 2, postFX: false }; // Minimal but active
    } else if (w <= 1024) {
        return { mode: 'tablet', count: 1200, pixelRatio: 1.0, updateStep: 2, postFX: false }; // Adjusted Tablet DPR
    }
    return { mode: 'desktop', count: 1800, pixelRatio: 1.5, updateStep: 1, postFX: true }; // Optimized High
};

export default function NineDimensionsBackground({ targetShapeIndex }: NineDimensionsBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const PROFILE = useRef(getProfile());
    
    // Refs for cleanup
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const meshRef = useRef<THREE.InstancedMesh | null>(null);
    const shapesRef = useRef<number[][]>([]);
    const reqIdRef = useRef<number | null>(null);
    const frameCountRef = useRef(0);
    
    // Animation state refs
    const isVisible = useRef(true);
    const currentShapeIndexRef = useRef(0);
    const targetShapeIndexRef = useRef(0);
    const animParams = useRef({ progress: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const profile = PROFILE.current;
        if (profile.count === 0) return;

        // --- 1. SETUP ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(BG_BASE, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        cameraRef.current = camera;
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: profile.mode === 'desktop', 
            powerPreference: "high-performance" 
        });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.pixelRatio));
        containerRef.current.appendChild(renderer.domElement);

        // Visibility Observer
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting;
        }, { threshold: 0.1 });
        observer.observe(containerRef.current);

        const handleVisibilityChange = () => {
            isVisible.current = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // --- 2. MORPH ENGINE ---
        const count = profile.count;
        const dummy = new THREE.Object3D();
        const shapes: number[][] = []; 

        // Generate Shapes
        for (let s = 0; s < 9; s++) {
            const shapeData: number[] = [];
            for (let i = 0; i < count; i++) {
                let x = 0, y = 0, z = 0;
                
                switch(s) {
                    case 0: // Genesis (Chaos)
                        x = (Math.random() - 0.5) * 400;
                        y = (Math.random() - 0.5) * 300;
                        z = (Math.random() - 0.5) * 200;
                        break;
                    
                    case 1: // Tunnel (Cylinder)
                        const r = 30 + Math.random() * 10;
                        const theta = Math.random() * Math.PI * 2;
                        x = Math.cos(theta) * r;
                        y = Math.sin(theta) * r;
                        z = (Math.random() - 0.5) * 400;
                        break;

                    case 2: // Sphere (Globe)
                        const radius = 60;
                        const phi = Math.acos(-1 + (2 * i) / count);
                        const sqrtPi = Math.sqrt(count * Math.PI);
                        const thetaSphere = sqrtPi * phi;
                        x = radius * Math.cos(thetaSphere) * Math.sin(phi);
                        y = radius * Math.sin(thetaSphere) * Math.sin(phi);
                        z = radius * Math.cos(phi);
                        break;

                    case 3: // Cube
                        const size = 80;
                        x = (Math.random() - 0.5) * size;
                        y = (Math.random() - 0.5) * size;
                        z = (Math.random() - 0.5) * size;
                        // Force points to surface
                        if(Math.random() > 0.5) {
                            const axis = Math.floor(Math.random()*3);
                            if(axis===0) x = Math.sign(x) * size/2;
                            if(axis===1) y = Math.sign(y) * size/2;
                            if(axis===2) z = Math.sign(z) * size/2;
                        }
                        break;

                    case 4: // Helix (DNA)
                        const t = (i / count) * Math.PI * 20;
                        x = Math.cos(t) * 20;
                        y = (i / count - 0.5) * 200;
                        z = Math.sin(t) * 20;
                        if (i % 2 === 0) {
                            x = Math.cos(t + Math.PI) * 20;
                            z = Math.sin(t + Math.PI) * 20;
                        }
                        break;

                    case 5: // Grid (Wave Floor)
                        const col = i % 50;
                        const row = Math.floor(i / 50);
                        x = (col - 25) * 8;
                        z = (row - 30) * 8;
                        y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 10 - 40;
                        break;

                    case 6: // Ring (Saturn) - Centered XY Plane (Camera shift handles position)
                        const ringR = 60 + Math.random() * 20;
                        const ringTheta = (i / count) * Math.PI * 2 * 10;
                        
                        // Rotated to face camera (XY Plane)
                        x = Math.cos(ringTheta) * ringR;
                        y = Math.sin(ringTheta) * ringR;
                        z = (Math.random() - 0.5) * 5; 
                        break;

                    case 7: // Vortex (Funnel)
                        const vRatio = i / count;
                        const vR = vRatio * 80 + 5;
                        const vTheta = vRatio * Math.PI * 20;
                        y = (vRatio - 0.5) * 200;
                        x = Math.cos(vTheta) * vR;
                        z = Math.sin(vTheta) * vR;
                        break;
                    
                    case 8: // Harmony (Sphere + Random Aura)
                        if (i < count * 0.7) {
                            const r2 = 30;
                            const p2 = Math.acos(-1 + (2 * i) / (count*0.7));
                            const t2 = Math.sqrt((count*0.7) * Math.PI) * p2;
                            x = r2 * Math.cos(t2) * Math.sin(p2);
                            y = r2 * Math.sin(t2) * Math.sin(p2);
                            z = r2 * Math.cos(p2);
                        } else {
                            x = (Math.random() - 0.5) * 300;
                            y = (Math.random() - 0.5) * 300;
                            z = (Math.random() - 0.5) * 300;
                        }
                        break;
                }
                shapeData.push(x, y, z);
            }
            shapes.push(shapeData);
        }
        shapesRef.current = shapes;

        // BUILD MESH
        // Increased size slightly (0.4) to maintain "fullness" with 60% fewer particles
        const geometry = new THREE.SphereGeometry(0.4, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.InstancedMesh(geometry, material, count);
        meshRef.current = mesh;

        // Coloring
        const color1 = new THREE.Color(BG_ACCENT); // Accent
        const color2 = new THREE.Color(BG_DEEP);   // Deep
        const color3 = new THREE.Color(0xffffff);  // White
        
        for (let i = 0; i < count; i++) {
            dummy.position.set(0,0,0);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            
            let c = Math.random();
            let finalColor;
            if(c < 0.5) finalColor = color1.clone().lerp(color2, c * 2);
            else finalColor = color2.clone().lerp(color3, (c - 0.5) * 2);
            
            mesh.setColorAt(i, finalColor);
        }
        scene.add(mesh);

        // --- 4. ANIMATION LOOP ---
        const animate = () => {
            reqIdRef.current = requestAnimationFrame(animate);

            if (!isVisible.current) return;

            const time = Date.now() * 0.0005;
            
            // Revert to simple rotation as per user's "inspiration" code
            scene.rotation.y = time * 0.1;
            scene.rotation.z = Math.sin(time * 0.5) * 0.05;
            scene.rotation.x = 0; // Reset X

            // Throttle Rendering
            frameCountRef.current++;
            if (frameCountRef.current % profile.updateStep !== 0) return;

            // Update logic - Constant "alive" feel
            const currentIdx = currentShapeIndexRef.current;
            const targetIdx = targetShapeIndexRef.current;
            const progress = animParams.current.progress;

            const startShape = shapes[currentIdx];
            const endShape = shapes[targetIdx];

            // OPTIMIZATION: Cache lookAt target decision per frame
            const lZ = targetIdx === 1 ? 1000 : 0;
            // Apply lookAt only every 2 steps to save CPU (Orientation is stable enough for spheres)
            const shouldUpdateLookAt = (frameCountRef.current % (profile.updateStep * 2)) === 0;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                
                // Position interpolation
                let x = startShape[i3];
                let y = startShape[i3+1];
                let z = startShape[i3+2];

                if (progress > 0) {
                    x = THREE.MathUtils.lerp(x, endShape[i3], progress);
                    y = THREE.MathUtils.lerp(y, endShape[i3+1], progress);
                    z = THREE.MathUtils.lerp(z, endShape[i3+2], progress);
                }

                // Noise + Drift logic
                const variance = 1 + (i % 10) * 0.1; 
                const noise = Math.sin(time * variance + i) * 0.8;
                const drift = Math.cos(time * 0.3 + i) * 0.4;
                
                dummy.position.set(x + noise, y + noise + drift, z + drift);
                
                // Optimized lookAt: Decoupled frequency from rendering
                if (shouldUpdateLookAt) {
                    dummy.lookAt(0, 0, lZ);
                }

                // Pulse effect: Throttled by profile.updateStep (implicit in outer loop)
                const pulse = 1 + Math.sin(time * 3 + i) * 0.3;
                dummy.scale.setScalar(pulse); 

                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        // --- RESIZE ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, profile.pixelRatio));
        };
        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            observer.disconnect();
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    // --- TRIGGER GSAP WHEN PROP CHANGES ---
    useEffect(() => {
        if (targetShapeIndex === targetShapeIndexRef.current) return;

        targetShapeIndexRef.current = targetShapeIndex;
        animParams.current.progress = 0;

        // Camera Z specific logic
        // Camera Logic
        // Tunnel (1): Zoom in (z=50)
        // Ring (6): Shift camera right (x=60) so object appears left
        // Others: Default (x=0, z=100)
        
        let cameraX = 0;
        let cameraZ = 100;

        if (targetShapeIndex === 1) {
            cameraZ = 50;
        } else if (targetShapeIndex === 6) {
            cameraX = 60; // Move camera right -> Object feels left
        }

        if(cameraRef.current) {
            gsap.to(cameraRef.current.position, {
                x: cameraX,
                z: cameraZ,
                duration: 1.5,
                ease: "power2.inOut"
            });
        }

        gsap.to(animParams.current, {
            progress: 1,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                currentShapeIndexRef.current = targetShapeIndexRef.current;
                animParams.current.progress = 0;
            }
        });
    }, [targetShapeIndex]);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
