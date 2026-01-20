"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { usePageVisibility } from "@/hooks/usePageVisibility";

interface TunnelBackgroundProps {
    sectionIndex: number;
}

// --- SHADERS ---
const vertexShader = `
    uniform float uTime;
    uniform float uSpeed;

    attribute float aZStart;
    attribute float aSpeedOffset;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        // Calculate dynamic Z with looping
        // Range: -3000 to 200 (Total 3200)
        float z = aZStart + uTime * uSpeed * aSpeedOffset;
        float rawZ = z + 3000.0;
        float loopedZ = mod(rawZ, 3200.0) - 3000.0;

        // Apply to instance matrix (replace existing Z translation)
        mat4 instanceMat = instanceMatrix;
        instanceMat[3][2] = loopedZ;

        vec4 mvPosition = modelViewMatrix * instanceMat * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        vColor = instanceColor;
        
        // Dynamic opacity based on Z depth for "ghostly" feel
        // -3000 (0 opacity) -> 200 (max opacity)
        vOpacity = clamp((loopedZ + 3000.0) / 3200.0, 0.0, 1.0) * 0.15;
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        gl_FragColor = vec4(vColor, vOpacity);
    }
`;

export default function TunnelBackground({ sectionIndex }: TunnelBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const meshRef = useRef<THREE.InstancedMesh | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const isPageActive = usePageVisibility();
    const animationFrameIdRef = useRef<number>(0);

    const isVisible = useRef(true);
    const tunnelState = useRef({ speed: 0.5, rotationSpeed: 0.001, fov: 70 });
    const prevSectionRef = useRef<number>(0);
    const tunnelCount = 600;

    const colorPalette = [0.55, 0.80, 0.15, 0.05, 0.30, 0.65];

    useEffect(() => {
        if (!containerRef.current) return;

        // --- SETUP ---
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 3000);
        cameraRef.current = camera;

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

        // --- GEOMETRY & MATERIAL ---
        const baseGeo = new THREE.BoxGeometry(1.5, 1.5, 60);
        const geometry = new THREE.InstancedBufferGeometry().copy(baseGeo as any);
        
        const zStarts = new Float32Array(tunnelCount);
        const speedOffsets = new Float32Array(tunnelCount);
        const dummy = new THREE.Object3D();

        const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshBasicMaterial(), tunnelCount);
        
        for (let i = 0; i < tunnelCount; i++) {
            const radius = 30 + Math.random() * 50;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 3000;

            zStarts[i] = z;
            speedOffsets[i] = Math.random() + 0.5;

            // Set fixed rotation and X/Y position
            dummy.position.set(x, y, 0); // Z handled in shader
            dummy.lookAt(0, 0, 50); // Fixed rotation relative to center
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);

            const color = new THREE.Color().setHSL(colorPalette[0], 1.0, 0.5);
            mesh.setColorAt(i, color);
        }

        geometry.setAttribute('aZStart', new THREE.InstancedBufferAttribute(zStarts, 1));
        geometry.setAttribute('aSpeedOffset', new THREE.InstancedBufferAttribute(speedOffsets, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: 0.5 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        materialRef.current = material;
        (mesh as any).material = material;
        
        scene.add(mesh);
        meshRef.current = mesh;

        // --- ANIMATION ---
        const animate = () => {
            if (!isVisible.current || !isPageActive) {
                animationFrameIdRef.current = 0;
                return;
            }
            animationFrameIdRef.current = requestAnimationFrame(animate); 
            
            if (!cameraRef.current || !materialRef.current || !rendererRef.current || !meshRef.current) return;

            const time = Date.now() * 0.001;
            const state = tunnelState.current;

            // Update FOV
            if (cameraRef.current.fov !== state.fov) {
                cameraRef.current.fov = state.fov;
                cameraRef.current.updateProjectionMatrix();
            }

            // Update Uniforms
            materialRef.current.uniforms.uTime.value = time;
            materialRef.current.uniforms.uSpeed.value = state.speed;

            // Rotation (Z-axis spin)
            meshRef.current.rotation.z += state.rotationSpeed;

            rendererRef.current.render(scene, cameraRef.current);
        };
        animate();

        // --- OBSERVERS ---
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting;
            if (isVisible.current && isPageActive && !animationFrameIdRef.current) {
                animate();
            }
        }, { threshold: 0.1 });
        observer.observe(containerRef.current);

        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            baseGeo.dispose();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [isPageActive]);

    // --- TRANSITIONS ---
    useEffect(() => {
        if (!meshRef.current || !cameraRef.current) return;
        if (prevSectionRef.current === sectionIndex) return;

        const tl = gsap.timeline();
        const state = tunnelState.current;
        const camera = cameraRef.current;
        const isForward = sectionIndex > prevSectionRef.current;
        const targetSpeed = isForward ? 140 : -140;

        tl.to(state, {
            speed: targetSpeed,
            rotationSpeed: -0.5,
            fov: 120,
            duration: 1.0,
            ease: "expo.in"
        });

        tl.to(camera.rotation, {
            z: -0.4,
            y: -0.8,
            duration: 1.5,
            ease: "power2.inOut"
        }, "<");

        // Color Update
        const targetHue = colorPalette[sectionIndex % colorPalette.length];
        const targetColor = new THREE.Color().setHSL(targetHue, 1.0, 0.5);

        tl.add(() => {
            const mesh = meshRef.current;
            if (!mesh) return;
            for (let i = 0; i < tunnelCount; i++) {
                const c = targetColor.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
                mesh.setColorAt(i, c);
            }
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }, "-=0.5");

        tl.to(state, {
            speed: 0.5,
            rotationSpeed: 0.001,
            fov: 70,
            duration: 1.5,
            ease: "power2.out"
        });

        tl.to(camera.rotation, {
            z: 0,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.2)"
        }, "<");

        prevSectionRef.current = sectionIndex;
    }, [sectionIndex]);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
