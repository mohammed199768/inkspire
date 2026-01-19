"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// We move away from PostProcessing for transparency reliability
import gsap from "gsap";

interface TunnelData {
    x: number;
    y: number;
    z: number;
    radius: number;
    angle: number;
    speedOffset: number;
}

interface TunnelBackgroundProps {
    sectionIndex: number;
}

export default function TunnelBackground({ sectionIndex }: TunnelBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const tunnelMeshRef = useRef<THREE.InstancedMesh | null>(null);
    const tunnelDataRef = useRef<TunnelData[]>([]);

    // Animation state managed by GSAP
    const isVisible = useRef(true);
    const tunnelState = useRef({ speed: 0.5, rotationSpeed: 0.001, fov: 70 });
    const prevSectionRef = useRef<number>(0);
    const tunnelCount = 600; // Efficient count for transparent overlay

    // Define color palette to cycle through
    const colorPalette = [
        0.55, // Cyan/Blue
        0.80, // Magenta
        0.15, // Yellow
        0.05, // Red/Orange
        0.30, // Green
        0.65, // Purple
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. SETUP
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        // Transparent Fog: We don't use standard FogExp2(black) as it kills transparency.
        // We rely on simple scale/dimming or just let them fade naturally. 
        // Or we can use a custom shader. For now, let's keep it simple: no fog, just depth.

        const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 3000);
        camera.position.z = 0;
        cameraRef.current = camera;

        // ALPHA: TRUE for transparency
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Visibility Observer
        const handleVisibilityChange = () => {
             isVisible.current = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // 2. TUNNEL MESH
        // Use a Wireframe-like aesthetic for better transparency integration
        // or small transparent particles.
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 60);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15, // Very subtle, ghost-like
            blending: THREE.AdditiveBlending, // Glowy effect without post-processing
            depthWrite: false, // Helps with transparency overlapping
        });

        const tunnelMesh = new THREE.InstancedMesh(geometry, material, tunnelCount);

        const dummy = new THREE.Object3D();
        const tData: TunnelData[] = [];

        for (let i = 0; i < tunnelCount; i++) {
            const radius = 30 + Math.random() * 50;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 3000;

            dummy.position.set(x, y, z);
            dummy.lookAt(0, 0, 0);
            dummy.updateMatrix();
            tunnelMesh.setMatrixAt(i, dummy.matrix);

            tData.push({ x, y, z, radius, angle, speedOffset: Math.random() + 0.5 });

            // Initial generic color
            const color = new THREE.Color().setHSL(colorPalette[0], 1.0, 0.5);
            tunnelMesh.setColorAt(i, color);
        }
        scene.add(tunnelMesh);
        tunnelMeshRef.current = tunnelMesh;
        tunnelDataRef.current = tData;

        // 3. ANIMATION LOOP (No Composer)
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate); 
            
            if (!isVisible.current) return;
            if (!cameraRef.current || !tunnelMeshRef.current || !rendererRef.current) return;

            // Update FOV if changed by GSAP
            if (camera.fov !== tunnelState.current.fov) {
                camera.fov = tunnelState.current.fov;
                camera.updateProjectionMatrix();
            }

            const mesh = tunnelMeshRef.current;
            const data = tunnelDataRef.current;
            const state = tunnelState.current;

            for (let i = 0; i < tunnelCount; i++) {
                const d = data[i];
                d.z += state.speed * d.speedOffset;

                // Loop logic
                if (d.z > 200) d.z = -3000;
                if (d.z < -3000) d.z = 200;

                dummy.position.set(d.x, d.y, d.z);
                dummy.lookAt(0, 0, d.z + 50);
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
            mesh.rotation.z += state.rotationSpeed;

            renderer.render(scene, camera);
        };
        animate();

        // RESIZE HANDLER
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;
            const w = window.innerWidth;
            const h = window.innerHeight;

            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();

            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // CLEANUP
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    // 5. OBSERVE SECTIONS GENERICALLY
    useEffect(() => {
        if (!tunnelMeshRef.current || !cameraRef.current) return;

        const prevIndex = prevSectionRef.current;
        const nextIndex = sectionIndex;

        if (prevIndex === nextIndex) return;

        const tl = gsap.timeline();
        const state = tunnelState.current;
        const camera = cameraRef.current;

        // GENERIC TRANSITION LOGIC
        const isForward = nextIndex > prevIndex;

        // FIXED PATTERN: "Enter tunnel -> Curve Right -> Reveal"
        // Move camera forward significantly
        let targetSpeed = isForward ? 140 : -140;

        // Curve Right Logic:
        // Rotate Camera Y negative to look right.
        // Tilt Camera Z negative to bank right.
        let rotationDelta = -0.5; // Rotate tunnel visual helps the effect
        let cameraZ = -0.4; // Bank right
        let cameraY = -0.8; // Turn right
        let fovTarget = 120; // Widen FOV for speed effect

        // 1. Acceleration & Camera Move
        tl.to(state, {
            speed: targetSpeed,
            rotationSpeed: rotationDelta,
            fov: fovTarget,
            duration: 1.0, // Quick Acceleration
            ease: "expo.in"
        });

        // Camera Dynamics (Curve Right)
        tl.to(camera.rotation, {
            z: cameraZ,
            y: cameraY,
            duration: 1.5,
            ease: "power2.inOut" // Smooth curve
        }, "<");

        // 2. Change Color
        const hueIndex = nextIndex % colorPalette.length;
        const targetHue = colorPalette[hueIndex];
        const threeColor = new THREE.Color().setHSL(targetHue, 1.0, 0.5);

        tl.add(() => {
            const mesh = tunnelMeshRef.current;
            if (!mesh) return;
            for (let i = 0; i < tunnelCount; i++) {
                const c = threeColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
                mesh.setColorAt(i, c);
            }
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }, "-=0.5");

        // 3. Deceleration & Reset Camera for Reveal
        tl.to(state, {
            speed: 0.5,
            rotationSpeed: 0.001,
            fov: 70,
            duration: 1.5,
            ease: "power2.out"
        });

        // Smoothly reset camera to center (The Reveal)
        tl.to(camera.rotation, {
            z: 0,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.2)" // Subtle overshoot for "locking in" feeling
        }, "<");

        prevSectionRef.current = nextIndex;

    }, [sectionIndex]);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
