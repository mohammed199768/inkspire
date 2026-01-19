"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface NineDimensionsBackgroundProps {
    targetShapeIndex: number;
}

export default function NineDimensionsBackground({ targetShapeIndex }: NineDimensionsBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Refs for cleanup
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const meshRef = useRef<THREE.InstancedMesh | null>(null);
    const shapesRef = useRef<number[][]>([]);
    const reqIdRef = useRef<number | null>(null);
    
    // Animation state refs (to avoid re-renders)
    const isVisible = useRef(true);
    const currentShapeIndexRef = useRef(0);
    const targetShapeIndexRef = useRef(0);
    const animParams = useRef({ progress: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. SETUP ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(0x050510, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        cameraRef.current = camera;
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        containerRef.current.appendChild(renderer.domElement);

        // Page Visibility Visibility
        const handleVisibilityChange = () => {
            isVisible.current = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // --- 2. MORPH ENGINE ---
        const count = 3000;
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

        // --- 3. BUILD MESH ---
        // CRITICAL Optimization: Low-poly spheres (8x8 segments instead of 64x64)
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.InstancedMesh(geometry, material, count);
        meshRef.current = mesh;

        // Coloring
        const color1 = new THREE.Color(0x6b4092); // Purple
        const color2 = new THREE.Color(0x404f96); // Indigo
        const color3 = new THREE.Color(0xffffff); // White
        
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

            // Update logic
            const currentIdx = currentShapeIndexRef.current;
            const targetIdx = targetShapeIndexRef.current;
            const progress = animParams.current.progress;

            if (targetIdx !== currentIdx || progress > 0) {
                const startShape = shapes[currentIdx];
                const endShape = shapes[targetIdx];

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    
                    const x = THREE.MathUtils.lerp(startShape[i3], endShape[i3], progress);
                    const y = THREE.MathUtils.lerp(startShape[i3+1], endShape[i3+1], progress);
                    const z = THREE.MathUtils.lerp(startShape[i3+2], endShape[i3+2], progress);

                    const noise = Math.sin(time + i) * 0.5;
                    
                    dummy.position.set(x + noise, y + noise, z);
                    
                    if (targetIdx === 1) dummy.lookAt(0, 0, 1000); // Tunnel look forward
                    else dummy.lookAt(0, 0, 0); // Center look

                    dummy.scale.setScalar(1 + Math.sin(time * 5 + i) * 0.5); 

                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };
        animate();

        // --- RESIZE ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            // Optional: clean geometry/material
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
