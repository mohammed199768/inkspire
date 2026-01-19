"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

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

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta / 10;
            ref.current.rotation.x += delta / 20;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#a0a0ff"
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
    return (
        <div className="w-full h-full relative group">
            <Canvas 
                camera={{ position: [0, 0, 2.5] }} 
                dpr={[1, 1.5]}
                frameloop="always" // We'll keep always but cap it or use visibility
                onCreated={(state) => {
                    state.scene.fog = new THREE.FogExp2(0x050510, 0.3);
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
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0B0F1A]/40 to-[#0B0F1A] pointer-events-none" />
            
            {/* Scanline Effect */}
            <div className="scan-line opacity-[0.15]" />
        </div>
    );
}


