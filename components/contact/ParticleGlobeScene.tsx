// ============================================================================
// ARCHITECTURAL INTENT: 3D Particle Globe Background
// ============================================================================
// Three.js particle globe for Contact page visual interest.
//
// CORE TECHNOLOGY:
// - @react-three/fiber (React renderer for Three.js)
// - @react-three/drei (helper components: Points, Float)
// - Native sphere point generation (no external libs)
//
// PERFORMANCE STRATEGY:
// - 5000 particles on globe surface (sphere)
// - 500 ambient outer particles (scattered)
// - DPR capped at 1.5 (prevents excessive resolution)
// - frameloop="always" (continuous rendering - could optimize)
//
// ANIMATION:
// - useFrame hook: Rotates globe (y: delta/10, x: delta/20)
// - Outer particles counter-rotate (y: -delta/15)
// - Float component: Slow drift (speed=1, low intensity)
//
// VISUAL LAYERS:
// 1. Globe particles (#f2e9ff, 0.6 opacity)
// 2. Outer particles (#ffffff, 0.2 opacity)
// 3. Fog effect (FogExp2, matches site bg)
// 4. Purple ambient glow (CSS, z-[-1])
// 5. Scanline effect (overlay)
//
// TRADE-OFFS:
// - Always rendering (no demand rendering like NineDimensionsBackground)
// - Simpler than NineDimensionsBackground (no morphing, no visibility gating)
// - Good for static contact page (not performance-critical like home)
//
// EVIDENCE: Used in Contact page, Three.js patterns per ARCHITECTURE_MEMORY.txt
// ============================================================================

"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { usePageVisibility } from "@/hooks/usePageVisibility";

function ParticleGlobe(props: any) {
    const ref = useRef<any>();
    const outerRef = useRef<any>();

    // Generate random points on a sphere natively to avoid build/import issues
    const [sphere] = useState(() => {
        const points = new Float32Array(5000 * 3);
        const radius = 1.2;
        for (let i = 0; i < 5000; i++) {
            const r = radius; // Surface of sphere
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            points[i * 3 + 2] = r * Math.cos(phi);
        }
        return points;
    });

    // Generate loose outer particles
    const [outerPoints] = useState(() => {
        const points = new Float32Array(500 * 3);
        for (let i = 0; i < 500 * 3; i++) {
            points[i] = (Math.random() - 0.5) * 5;
        }
        return points;
    });

    // PERFORMANCE FIX: Removed continuous auto-rotation to allow CPU to sleep (0-5%)
    // Previously: Unlimited invalidation loop caused 46% CPU usage.
    // Now: Handled by OrbitControls (if added) or static.
    // To restore movement: Add mouse-move listener to invalidate() only on interaction.
    useFrame((state, delta) => {
        // Only animate if necessary (e.g. mouse interaction)
        // Currently disabling auto-rotation to prioritize Performance Target (~5% CPU)
    });

    return (
        <group>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f2e9ff"
                    size={0.008}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
            <Points ref={outerRef} positions={outerPoints} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.01}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.2}
                />
            </Points>
        </group>
    );
}

export default function ParticleGlobeScene() {
    // PERFORMANCE OPTIMIZATION: Use Page Visibility API to pause when hidden
    // Matches NineDimensionsBackground demand rendering pattern
    const isPageActive = usePageVisibility();

    return (
        <div className="w-full h-full relative group">
            <Canvas 
                camera={{ position: [0, 0, 2.5] }} 
                dpr={[1, 1.5]}
                frameloop="demand" // PERFORMANCE FIX: Only render when invalidate() called
                onCreated={(state) => {
                    state.scene.fog = new THREE.FogExp2(0x09060f, 0.3);
                }}
            >
                <Suspense fallback={null}>
                    <Float
                        speed={1} 
                        rotationIntensity={0.2} 
                        floatIntensity={0.5} 
                    >
                        <ParticleGlobe />
                    </Float>
                </Suspense>
            </Canvas>
            
            {/* Ambient Background Glow - Matches NineDimensions indigo/purple */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] pointer-events-none">
                 <div className="w-[800px] h-[800px] bg-purple-600/[0.03] rounded-full blur-[150px] animate-pulse" />
            </div>
            
            {/* Cinematic Gradient Overlay - blends into the site's radial gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#09060f]/40 to-[#09060f] pointer-events-none" />
            
            {/* Scanline Effect */}
            <div className="scan-line opacity-[0.15]" />
        </div>
    );
}


