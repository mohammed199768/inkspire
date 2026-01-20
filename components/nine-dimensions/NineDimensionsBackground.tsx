"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { usePageVisibility } from "@/hooks/usePageVisibility";

interface NineDimensionsBackgroundProps {
    targetShapeIndex: number;
}

// --- PALETTE CONSTANTS ---
const BG_BASE = "#09060f";
const BG_DEEP = "#0d0e22";
const BG_ACCENT = "#201037";

// --- PERFORMANCE PROFILES ---
const getProfile = () => {
    if (typeof window === 'undefined') return { mode: 'desktop', count: 1800, pixelRatio: 1.5, postFX: true };
    
    const w = window.innerWidth;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReduced) return { mode: 'mobile', count: 400, pixelRatio: 1.0, postFX: false };
    
    if (w < 768) {
        return { mode: 'mobile', count: 600, pixelRatio: 1.0, postFX: false }; 
    } else if (w <= 1024) {
        return { mode: 'tablet', count: 1200, pixelRatio: 1.0, postFX: false };
    }
    return { mode: 'desktop', count: 1800, pixelRatio: 1.5, postFX: true };
};

// --- SHADERS ---
const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    attribute float aInstanceIdx;
    attribute vec3 aPosStart;
    attribute vec3 aPosEnd;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        // 1. Interpolate between shapes
        vec3 morphedPos = mix(aPosStart, aPosEnd, uProgress);
        
        // 2. Add dynamic movement (noise & drift)
        // Replicating original JS logic: 
        // variance = 1 + (i % 10) * 0.1
        // noise = sin(time * variance + i) * 0.8
        // drift = cos(time * 0.3 + i) * 0.4
        
        float variance = 1.0 + mod(aInstanceIdx, 10.0) * 0.1;
        float noise = sin(uTime * variance + aInstanceIdx) * 0.8;
        float drift = cos(uTime * 0.3 + aInstanceIdx) * 0.4;
        
        vec3 finalOffset = vec3(noise, noise + drift, drift);
        
        // 3. Pulse Scaling
        // pulse = 1 + sin(time * 3 + i) * 0.3
        float pulse = 1.0 + sin(uTime * 3.0 + aInstanceIdx) * 0.3;
        
        // 4. Combine
        // Calculate the instance center in model space
        vec3 instanceCenter = morphedPos + finalOffset;
        
        // Apply scaling to the geometry (local position)
        vec3 scaledVertex = position * pulse;
        
        // Transform
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(instanceCenter + scaledVertex, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        vColor = instanceColor;
        
        // Distance based opacity (depth feel)
        float depth = length(mvPosition.xyz);
        vOpacity = clamp(1.0 - (depth / 600.0), 0.2, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        gl_FragColor = vec4(vColor, vOpacity);
    }
`;

export default function NineDimensionsBackground({ targetShapeIndex }: NineDimensionsBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const PROFILE = useRef(getProfile());
    const isPageActive = usePageVisibility();
    
    // Refs for optimization
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const meshRef = useRef<THREE.InstancedMesh | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const shapesRef = useRef<Float32Array[]>([]);
    const reqIdRef = useRef<number | null>(null);
    
    // State management
    const isVisible = useRef(true);
    const currentShapeIndexRef = useRef(0);
    const targetShapeIndexRef = useRef(0);
    const animParams = useRef({ progress: 0 });

    // Pre-calculate shapes (happens once on mount)
    const shapes = useMemo(() => {
        const count = PROFILE.current.count;
        const result: Float32Array[] = [];
        
        for (let s = 0; s < 9; s++) {
            const data = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                let x = 0, y = 0, z = 0;
                switch(s) {
                    case 0: // Genesis (Chaos)
                        x = (Math.random() - 0.5) * 400;
                        y = (Math.random() - 0.5) * 300;
                        z = (Math.random() - 0.5) * 200;
                        break;
                    case 1: // Tunnel
                        const r = 30 + Math.random() * 10;
                        const theta = Math.random() * Math.PI * 2;
                        x = Math.cos(theta) * r;
                        y = Math.sin(theta) * r;
                        z = (Math.random() - 0.5) * 400;
                        break;
                    case 2: // Sphere
                        const radius = 60;
                        const phi = Math.acos(-1 + (2 * i) / count);
                        const thetaSphere = Math.sqrt(count * Math.PI) * phi;
                        x = radius * Math.cos(thetaSphere) * Math.sin(phi);
                        y = radius * Math.sin(thetaSphere) * Math.sin(phi);
                        z = radius * Math.cos(phi);
                        break;
                    case 3: // Cube
                        const size = 80;
                        x = (Math.random() - 0.5) * size;
                        y = (Math.random() - 0.5) * size;
                        z = (Math.random() - 0.5) * size;
                        if(Math.random() > 0.5) {
                            const axis = Math.floor(Math.random()*3);
                            if(axis===0) x = Math.sign(x) * size/2;
                            if(axis===1) y = Math.sign(y) * size/2;
                            if(axis===2) z = Math.sign(z) * size/2;
                        }
                        break;
                    case 4: // Helix
                        const t = (i / count) * Math.PI * 20;
                        x = Math.cos(t) * 20;
                        y = (i / count - 0.5) * 200;
                        z = Math.sin(t) * 20;
                        if (i % 2 === 0) {
                            x = Math.cos(t + Math.PI) * 20;
                            z = Math.sin(t + Math.PI) * 20;
                        }
                        break;
                    case 5: // Grid
                        const col = i % 50;
                        const row = Math.floor(i / 50);
                        x = (col - 25) * 8;
                        z = (row - 30) * 8;
                        y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 10 - 40;
                        break;
                    case 6: // Ring
                        const ringR = 60 + Math.random() * 20;
                        const ringTheta = (i / count) * Math.PI * 2 * 10;
                        x = Math.cos(ringTheta) * ringR;
                        y = Math.sin(ringTheta) * ringR;
                        z = (Math.random() - 0.5) * 5; 
                        break;
                    case 7: // Vortex
                        const vRatio = i / count;
                        const vR = vRatio * 80 + 5;
                        const vTheta = vRatio * Math.PI * 20;
                        y = (vRatio - 0.5) * 200;
                        x = Math.cos(vTheta) * vR;
                        z = Math.sin(vTheta) * vR;
                        break;
                    case 8: // Harmony
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
                data[i * 3] = x;
                data[i * 3 + 1] = y;
                data[i * 3 + 2] = z;
            }
            result.push(data);
        }
        return result;
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const profile = PROFILE.current;
        const count = profile.count;
        if (count === 0) return;

        // --- SETUP ---
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

        // --- GEOMETRY & MATERIAL ---
        const baseGeo = new THREE.SphereGeometry(0.4, 8, 8);
        const geometry = new THREE.InstancedBufferGeometry().copy(baseGeo as any);
        geometry.instanceCount = count;

        // Attributes
        const instanceIdx = new Float32Array(count);
        for(let i=0; i<count; i++) instanceIdx[i] = i;
        geometry.setAttribute('aInstanceIdx', new THREE.InstancedBufferAttribute(instanceIdx, 1));
        
        const posStart = new THREE.InstancedBufferAttribute(shapes[0], 3);
        const posEnd = new THREE.InstancedBufferAttribute(shapes[0], 3);
        geometry.setAttribute('aPosStart', posStart);
        geometry.setAttribute('aPosEnd', posEnd);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false, // Depth write off for better performance with many particles
            blending: THREE.AdditiveBlending
        });
        materialRef.current = material;

        const mesh = new THREE.InstancedMesh(geometry, material, count);
        meshRef.current = mesh;

        // Initial Colors (Pass as instanceColor attribute)
        const color1 = new THREE.Color(BG_ACCENT);
        const color2 = new THREE.Color(BG_DEEP);
        const color3 = new THREE.Color(0xffffff);
        
        for (let i = 0; i < count; i++) {
            let c = Math.random();
            let finalColor;
            if(c < 0.5) finalColor = color1.clone().lerp(color2, c * 2);
            else finalColor = color2.clone().lerp(color3, (c - 0.5) * 2);
            mesh.setColorAt(i, finalColor);
        }
        scene.add(mesh);

        // --- ANIMATION LOOP ---
        const animate = () => {
            if (!isVisible.current || !isPageActive) {
                reqIdRef.current = null;
                return;
            }
            reqIdRef.current = requestAnimationFrame(animate);

            const time = Date.now() * 0.0005;
            scene.rotation.y = time * 0.1;
            scene.rotation.z = Math.sin(time * 0.5) * 0.05;

            // Update Shader Uniforms
            if(materialRef.current) {
                materialRef.current.uniforms.uTime.value = time;
                materialRef.current.uniforms.uProgress.value = animParams.current.progress;
            }

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

        // Visibility Observer
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting;
            if (isVisible.current && isPageActive && !reqIdRef.current) {
                animate();
            }
        }, { threshold: 0.1 });
        observer.observe(containerRef.current);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            baseGeo.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [isPageActive, shapes]);

    // --- GSAP FLOW ---
    useEffect(() => {
        if (targetShapeIndex === targetShapeIndexRef.current) return;
        
        const ctx = gsap.context(() => {
            const mesh = meshRef.current;
            if(!mesh) return;

            // 1. Prepare for transition
            // Move current state to aPosStart
            // Move new state to aPosEnd
            const startData = shapes[currentShapeIndexRef.current];
            const endData = shapes[targetShapeIndex];
            
            const geo = mesh.geometry as THREE.InstancedBufferGeometry;
            const startAttr = geo.getAttribute('aPosStart') as THREE.InstancedBufferAttribute;
            const endAttr = geo.getAttribute('aPosEnd') as THREE.InstancedBufferAttribute;

            startAttr.set(startData);
            endAttr.set(endData);
            startAttr.needsUpdate = true;
            endAttr.needsUpdate = true;

            targetShapeIndexRef.current = targetShapeIndex;
            animParams.current.progress = 0;
            
            // Camera Logic (Unchanged visually)
            let cameraX = 0;
            let cameraZ = 100;
            if (targetShapeIndex === 1) cameraZ = 50;
            else if (targetShapeIndex === 6) cameraX = 60;

            if (cameraRef.current) {
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
                    const finalStartAttr = geo.getAttribute('aPosStart') as THREE.InstancedBufferAttribute;
                    finalStartAttr.set(shapes[currentShapeIndexRef.current]);
                    finalStartAttr.needsUpdate = true;
                }
            });
            
            // Find camera in scene
            const scene = sceneRef.current;
            if(scene) {
                // We'll need a ref to camera. Let's add it.
            }
        });

        return () => ctx.revert();
    }, [targetShapeIndex, shapes]);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
