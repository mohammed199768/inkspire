// ============================================================================
// ARCHITECTURAL INTENT: 3D Particle Background System
// ============================================================================
// Renders dynamic 3D particle backgrounds that morph between 9 geometric shapes.
//
// CORE TECHNOLOGY:
// - Three.js InstancedMesh for GPU-efficient particle rendering
// - Custom GLSL shaders for morphing + drift animations
// - GSAP for smooth shape transitions
//
// PERFORMANCE STRATEGY:
// - Tiered profiles: desktop (1500p), tablet (600-800p), mobile (0p/gradient)
// - Demand rendering: RAF loop pauses when invisible or idle
// - IntersectionObserver + Page Visibility gating
// - Pixel ratio capping (1.5 desktop, 1.0 tablet/mobile)
//
// LIFECYCLE MANAGEMENT:
// - Proper Three.js disposal (geometries, materials, renderer)
// - GSAP context cleanup
// - Event listener removal
// - RAF cancellation
//
// KEY DECISIONS:
// - GPU morphing (not CPU): Attributes aPosStart/aPosEnd, uProgress uniform
// - Demand rendering: Stops RAF when not transitioning AND progress === 0
// - WeakSet NOT needed: disposals happen once on unmount
//
// EVIDENCE: Three.js integration patterns in ARCHITECTURE_MEMORY.txt
// ============================================================================

"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";

// ============================================================================
// TYPES
// ============================================================================
interface NineDimensionsBackgroundProps {
  targetShapeIndex: number;
  /** Lite mode for tablets: reduced particles, no post-fx */
  lite?: boolean;
  /** Scroll impulse value (0-1) for transient particle displacement */
  scrollImpulse?: number;
}

// ============================================================================
// PALETTE CONSTANTS
// ============================================================================
const BG_BASE = "#09060f";
const BG_DEEP = "#0d0e22";
const BG_ACCENT = "#201037";

// ============================================================================
// PERFORMANCE PROFILES
// Now uses useResponsiveMode instead of window.innerWidth checks
// ============================================================================
// ARCHITECTURAL DECISION: Tiered particle counts
// - Desktop: 1500 particles (full experience)
// - Tablet: 600-800 particles (lite mode for capable devices)
// - Mobile: 0 particles (gradient fallback only)
// - Pixel ratio capping prevents excessive fragment shader load
interface PerformanceProfile {
  mode: "mobile" | "tablet" | "desktop";
  count: number;
  pixelRatio: number;
  postFX: boolean;
}

const PROFILES: Record<string, PerformanceProfile> = {
  desktop: { mode: "desktop", count: 1500, pixelRatio: 1.5, postFX: true },
  tablet: { mode: "tablet", count: 800, pixelRatio: 1.0, postFX: false },
  mobile: { mode: "mobile", count: 0, pixelRatio: 1.0, postFX: false }, // Static
  reducedMotion: { mode: "mobile", count: 0, pixelRatio: 1.0, postFX: false },
  lite: { mode: "tablet", count: 600, pixelRatio: 1.0, postFX: false },
};

// ============================================================================
// SHADERS
// ============================================================================
// ARCHITECTURAL NOTE: Morphing happens on GPU (zero CPU cost)
// - aPosStart: Current shape positions
// - aPosEnd: Target shape positions
// - uProgress: GSAP-animated 0→1 transition
// - GPU linearly interpolates: mix(start, end, progress)
const vertexShader = `
    uniform float uTime;
    uniform float uProgress;
    uniform float uImpulse;
    attribute vec3 aPosStart;
    attribute vec3 aPosEnd;
    attribute float aRandom;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        // 1. GPU MORPHING - Zero CPU cost during transition
        vec3 morphedPos = mix(aPosStart, aPosEnd, uProgress);
        
        // 2. GPU DRIFT - High performance noise/drift
        float drift = sin(uTime * 0.2 + aRandom) * 2.0;
        vec3 finalPos = morphedPos + vec3(drift * 0.5, drift, drift * 0.3);
        
        // 3. SCROLL IMPULSE - Transient displacement (surgical addition)
        if (uImpulse > 0.01) {
            float wave = sin(uTime * 1.5 + aRandom * 5.0) * uImpulse;
            float jitter = (aRandom - 0.5) * uImpulse * 3.0;
            finalPos += vec3(wave, wave * 1.2, jitter) * 2.0;
        }
        
        // 4. Transform
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(finalPos + position * 1.1, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        vColor = instanceColor;
        
        // Depth-based transparency
        float depth = length(mvPosition.xyz);
        vOpacity = clamp(1.0 - (depth / 600.0), 0.2, 0.6);
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        // ULTRA-CLEAN CINEMATIC ALPHA (0.15 -> 0.45 range controlled by vOpacity)
        gl_FragColor = vec4(vColor, vOpacity * 0.4);
    }
`;

// ============================================================================
// THE COMPONENT
// ============================================================================
/**
 * NineDimensionsBackground - Three.js particle system background.
 * 
 * Features:
 * - SSR-safe: Uses useResponsiveMode for profile selection
 * - Demand rendering: Stops RAF loop when not visible or page inactive
 * - Lite mode: Reduced particles for capable tablets
 * - Visibility gating: IntersectionObserver pauses when off-screen
 * - Proper cleanup: Disposes all Three.js resources
 */
export default function NineDimensionsBackground({
  targetShapeIndex,
  lite = false,
  scrollImpulse = 0,
}: NineDimensionsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageActive = usePageVisibility();
  const { breakpoint, prefersReducedMotion } = useResponsiveMode();

  // Determine profile based on responsive mode
  const profile = useMemo((): PerformanceProfile => {
    if (prefersReducedMotion) return PROFILES.reducedMotion;
    if (lite) return PROFILES.lite;
    return PROFILES[breakpoint] || PROFILES.desktop;
  }, [breakpoint, prefersReducedMotion, lite]);

  // Refs for Three.js objects
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef = useRef<THREE.InstancedBufferGeometry | null>(null);
  const baseGeoRef = useRef<THREE.SphereGeometry | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const gsapCtxRef = useRef<gsap.Context | null>(null);
  const animateRef = useRef<() => void>(() => {});

  // State management
  const isVisible = useRef(true);
  const isTransitioning = useRef(false);
  const currentShapeIndexRef = useRef(0);
  const targetShapeIndexRef = useRef(0);
  const animParams = useRef({ progress: 0 });
  
  // ============================================================================
  // SCROLL IMPULSE INTERNAL STATE
  // ============================================================================
  // Tracks decayed impulse value for demand rendering gate.
  // Smoothly interpolates toward prop value for visual continuity.
  // ============================================================================
  const impulseRef = useRef(0);

  // ============================================================================
  // PRE-CALCULATE SHAPES
  // ============================================================================
  // ARCHITECTURAL DECISION: Compute all 9 shape positions upfront
  // - useMemo prevents recalculation on re-render
  // - Dependency: [profile.count] (only recalc when particle count changes)
  // - Each shape is Float32Array (x,y,z per particle)
  const shapes = useMemo(() => {
    const count = profile.count;
    const result: Float32Array[] = [];

    for (let s = 0; s < 9; s++) {
      const data = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        let x = 0,
          y = 0,
          z = 0;
        switch (s) {
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
            if (Math.random() > 0.5) {
              const axis = Math.floor(Math.random() * 3);
              if (axis === 0) x = Math.sign(x) * (size / 2);
              if (axis === 1) y = Math.sign(y) * (size / 2);
              if (axis === 2) z = Math.sign(z) * (size / 2);
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
              const p2 = Math.acos(-1 + (2 * i) / (count * 0.7));
              const t2 = Math.sqrt(count * 0.7 * Math.PI) * p2;
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
  }, [profile.count]);

  // ============================================================================
  // CLEANUP FUNCTION
  // ============================================================================
  // ARCHITECTURAL PATTERN: Centralized disposal
  // - Cancels RAF loop
  // - Reverts GSAP context (removes all tweens)
  // - Disposes Three.js objects (prevents GPU memory leak)
  // - Removes canvas from DOM
  const cleanup = useCallback(() => {
    // Cancel RAF
    if (reqIdRef.current) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }

    // Revert GSAP context
    if (gsapCtxRef.current) {
      gsapCtxRef.current.revert();
      gsapCtxRef.current = null;
    }

    // Dispose Three.js objects
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (containerRef.current && rendererRef.current.domElement) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Ignore if already removed
        }
      }
      rendererRef.current = null;
    }

    if (geometryRef.current) {
      geometryRef.current.dispose();
      geometryRef.current = null;
    }

    if (baseGeoRef.current) {
      baseGeoRef.current.dispose();
      baseGeoRef.current = null;
    }

    if (materialRef.current) {
      materialRef.current.dispose();
      materialRef.current = null;
    }

    meshRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
  }, []);

  // ============================================================================
  // THREE.JS SETUP EFFECT
  // ============================================================================
  // RESPONSIBILITY:
  // - Creates scene, camera, renderer
  // - Sets up InstancedMesh with custom shader material
  // - Initializes shape attributes (aPosStart, aPosEnd)
  // - Starts render loop with demand rendering logic
  // - Attaches resize handler and visibility observer
  //
  // DEPENDENCY ARRAY: [profile, shapes, isPageActive, cleanup]
  // - profile: User switches devices → rebuild with new particle count
  // - shapes: Particle count changes → new shape data
  // - isPageActive: Page visibility changes → gate rendering
  // - cleanup: Reference stability (useCallback)
  useEffect(() => {
    if (!containerRef.current) return;
    if (profile.count <= 0) return;

    const count = profile.count;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(BG_BASE, 0.002);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    cameraRef.current = camera;
    camera.position.z = 100;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: profile.mode === "desktop",
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, profile.pixelRatio)
    );
    containerRef.current.appendChild(renderer.domElement);

    // Setup geometry
    const baseGeo = new THREE.SphereGeometry(0.4, 8, 8);
    baseGeoRef.current = baseGeo;
    const geometry = new THREE.InstancedBufferGeometry().copy(baseGeo as any);
    geometryRef.current = geometry;
    geometry.instanceCount = count;

    // Attributes
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) randoms[i] = Math.random() * 100;
    geometry.setAttribute(
      "aRandom",
      new THREE.InstancedBufferAttribute(randoms, 1)
    );

    const posStart = new THREE.InstancedBufferAttribute(shapes[targetShapeIndex] || shapes[0], 3);
    const posEnd = new THREE.InstancedBufferAttribute(shapes[targetShapeIndex] || shapes[0], 3);
    geometry.setAttribute("aPosStart", posStart);
    geometry.setAttribute("aPosEnd", posEnd);

    // Setup material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uImpulse: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    // Setup mesh
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    meshRef.current = mesh;

    // Inkspire Dark Cinematic Colors (70% White, 30% Soft Purple)
    const colorWhite = new THREE.Color("#ffffff"); 
    const colorPurpleLight = new THREE.Color("#a78bfa"); 
    const colorPurpleDeep = new THREE.Color("#201037"); 

    for (let i = 0; i < count; i++) {
        const c = Math.random();
        let finalColor;
        if (c < 0.7) {
            // 70% Soft White (slightly desaturated)
            finalColor = colorWhite.clone().lerp(new THREE.Color("#09060f"), 0.15);
        } else {
            // 30% Purple Gradient (Deep Royal to Light Lavender)
            const t = (c - 0.7) / 0.3;
            finalColor = colorPurpleDeep.clone().lerp(colorPurpleLight, t);
        }
        mesh.setColorAt(i, finalColor);
    }
    scene.add(mesh);

    // ARCHITECTURAL PATTERN: Demand Rendering
    // RAF loop runs ONLY when:
    // 1. isVisible.current === true (IntersectionObserver)
    // 2. isPageActive === true (Page Visibility API)
    // 3. isTransitioning.current === true OR progress !== 0 OR impulse > epsilon
    //
    // WHY: Saves CPU/GPU when background not visible or static
    // IMPULSE EXTENSION: Brief RAF activity during scroll impulse decay (~300-600ms)
    // Animation loop with Demand Rendering logic
    const animate = () => {
      const epsilon = 0.01;
      
      // Demand Gating: Render only if visible, active, transitioning, or impulse active
      if (
        !isVisible.current || 
        !isPageActive || 
        (!isTransitioning.current && animParams.current.progress === 0 && impulseRef.current < epsilon)
      ) {
        reqIdRef.current = null;
        return;
      }
      
      reqIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.0001; 
      scene.rotation.y += 0.0005; 

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time;
        materialRef.current.uniforms.uProgress.value = animParams.current.progress;
        
        // Update impulse with smoothing and decay
        // Compatibility: Ignore impulse if prefersReducedMotion or no particles
        if (!prefersReducedMotion && profile.count > 0) {
          // Smooth interpolation toward prop value
          impulseRef.current += (scrollImpulse - impulseRef.current) * 0.15;
          
          // Apply internal decay (aggressive: approaches epsilon in ~300-600ms)
          impulseRef.current *= 0.88;
          
          // Clamp to epsilon to allow gate to stop RAF
          if (impulseRef.current < epsilon) {
            impulseRef.current = 0;
          }
        } else {
          impulseRef.current = 0;
        }
        
        materialRef.current.uniforms.uImpulse.value = impulseRef.current;
      }

      renderer.render(scene, camera);
    };
    animateRef.current = animate;
    animate();

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(
        Math.min(window.devicePixelRatio, profile.pixelRatio)
      );
    };
    window.addEventListener("resize", handleResize);

    // Visibility observer for demand rendering
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (isVisible.current && isPageActive && !reqIdRef.current) {
          animate();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    // Context Loss Handling
    const canvas = renderer.domElement;
    const handleContextLost = (event: Event) => {
        event.preventDefault(); // allow restoration
        cancelAnimationFrame(reqIdRef.current!);
    };
    const handleContextRestored = () => {
        // Simple reload strategy for robustness
        window.location.reload(); 
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      observer.disconnect();
      cleanup();
    };
  }, [profile, shapes, isPageActive, cleanup]);

  // ============================================================================
  // VISIBILITY RESUME BRIDGE
  // ============================================================================
  // ARCHITECTURAL PATTERN: Page Visibility Resume
  // 
  // PROBLEM: IntersectionObserver only fires on scroll changes, NOT tab switches.
  // When user switches tabs:
  // - isPageActive becomes false → RAF stops (line 452)
  // - User returns → isPageActive becomes true
  // - BUT: IntersectionObserver doesn't fire (no scroll happened)
  // - RESULT: RAF never restarts
  //
  // SOLUTION: Dedicated effect watching isPageActive
  // - When page becomes active: check if should animate, restart RAF
  // - When page becomes inactive: defensively cancel RAF
  //
  // DEMAND RENDERING PRESERVED:
  // Still respects: isVisible && (isTransitioning || progress !== 0)
  // Only adds: explicit restart trigger on page visibility restore
  //
  // EVIDENCE: Fixes "frozen particles after tab switch" bug
  // ============================================================================
  useEffect(() => {
    if (isPageActive) {
      // Page became active: check if we should be animating
      const shouldAnimate = isVisible.current && (isTransitioning.current || animParams.current.progress !== 0);
      
      if (shouldAnimate && !reqIdRef.current) {
        animateRef.current();
      }
    } else {
      // Page inactive: ensure RAF is stopped (defensive)
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = null;
      }
    }
  }, [isPageActive]);

  // ============================================================================
  // SHAPE TRANSITION EFFECT (GSAP)
  // ============================================================================
  // RESPONSIBILITY:
  // - Updates GPU attributes (aPosStart → aPosEnd) when targetShapeIndex changes
  // - Animates uProgress uniform from 0 → 1 (GSAP)
  // - Morphing happens entirely on GPU (vertex shader)
  //
  // LIFECYCLE:
  // - gsap.context() scopes all tweens for batch cleanup
  // - Revert previous context before starting new transition
  // - isTransitioning flag gates demand rendering
  useEffect(() => {
    if (targetShapeIndex === targetShapeIndexRef.current) return;
    if (!meshRef.current) return;

    gsapCtxRef.current = gsap.context(() => {
      const mesh = meshRef.current;
      if (!mesh) return;

      const geo = mesh.geometry as THREE.InstancedBufferGeometry;
      const startAttr = geo.getAttribute("aPosStart") as THREE.InstancedBufferAttribute;
      const endAttr = geo.getAttribute("aPosEnd") as THREE.InstancedBufferAttribute;

      // GPU Transition Prep
      startAttr.set(shapes[currentShapeIndexRef.current]);
      endAttr.set(shapes[targetShapeIndex]);
      startAttr.needsUpdate = true;
      endAttr.needsUpdate = true;

      targetShapeIndexRef.current = targetShapeIndex;
      animParams.current.progress = 0;
      isTransitioning.current = true;

      // Kickstart RAF only for transition
      if (!reqIdRef.current) animateRef.current();

      gsap.to(animParams.current, {
        progress: 1,
        duration: prefersReducedMotion ? 0 : 1.4,
        ease: "power2.inOut",
        onComplete: () => {
          isTransitioning.current = false;
          currentShapeIndexRef.current = targetShapeIndex;
          // Loop stops naturally on next frame signal
        },
      });

      if (cameraRef.current) {
        gsap.to(cameraRef.current.position, {
          z: targetShapeIndex === 1 ? 60 : 100,
          duration: 1.4,
          ease: "power2.inOut"
        });
      }
    });

    return () => {
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
      }
    };
  }, [targetShapeIndex, shapes, prefersReducedMotion]);

  if (profile.count <= 0) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
}
