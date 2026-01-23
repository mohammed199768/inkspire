import * as THREE from "three";

// ============================================================================
// ARCHITECTURAL NOTE: THREE.JS MEMORY MANAGEMENT - CRITICAL UTILITY
// ============================================================================
// Three.js resources (geometries, materials, textures) are NOT automatically
// garbage collected. They occupy GPU memory (VRAM) which must be explicitly
// released by calling .dispose() on each resource.
//
// FAILURE MODE WITHOUT THIS:
// - Each Three.js scene created = MB to 100+ MB of VRAM allocated
// - After 10-20 Next.js route navigations = GPU out of memory
// - Consequence: Browser tab crash or severe rendering degradation
//
// THIS FILE PROVIDES:
// - Comprehensive disposal of all Three.js resources
// - WeakSet deduplication (prevents double-disposal of shared resources)
// - Recursive traversal (catches all objects in scene hierarchy)
// - Shader uniform texture cleanup (catches custom shader textures)
//
// USAGE: Call safeDispose(scene) in useEffect cleanup of every Three.js component
// ============================================================================

type Disposable =
  | THREE.Object3D
  | THREE.Material
  | THREE.Texture
  | THREE.BufferGeometry
  | THREE.WebGLRenderTarget;

// ============================================================================
// MATERIAL TEXTURE PROPERTY KEYS
// ============================================================================
// Standard material types (MeshStandardMaterial, MeshPhysicalMaterial, etc.)
// can have textures in these known property slots.
//
// WHY EXHAUSTIVE LIST:
// Each texture occupies VRAM. Missing one texture = memory leak.
// This list covers all standard material texture slots in Three.js r160.
// ============================================================================
const MATERIAL_TEXTURE_KEYS: (keyof THREE.Material)[] = [
  "map",              // Diffuse/albedo color
  "alphaMap",         // Transparency mask
  "aoMap",            // Ambient occlusion
  "bumpMap",          // Height map (surface bumps)
  "displacementMap",  // Vertex displacement
  "emissiveMap",      // Emissive (glow) color
  "envMap",           // Environment reflection/refraction
  "lightMap",         // Baked lighting
  "metalnessMap",     // PBR metalness
  "normalMap",        // Surface normal perturbation
  "roughnessMap",     // PBR roughness
  "specularMap",      // Specular highlights
] as any;

// ============================================================================
// SAFE DISPOSE - Main disposal function
// ============================================================================
// PATTERN: WeakSet deduplication
// WHY: Three.js resources are often shared (one texture used by N materials)
// PROBLEM: Calling .dispose() twice = error or warning
// SOLUTION: Track disposed objects, skip if already processed
//
// WeakSet vs Set:
// - WeakSet doesn't prevent garbage collection of referenced objects
// - When object is GC'd, WeakSet entry is automatically removed
// - No memory leak from tracking set itself
// ============================================================================
export function safeDispose(root: THREE.Object3D) {
  const disposed = new WeakSet<object>(); // Deduplication tracker

  // ============================================================================
  // TEXTURE DISPOSAL
  // ============================================================================
  // GPU MEMORY: Each texture consumes VRAM (can be 1-100+ MB per texture)
  // MUST CALL: .dispose() to release VRAM back to GPU
  //
  // DEDUPLICATION: Same texture may be referenced by multiple materials
  // CHECK: disposed.has() prevents double-disposal errors
  // ============================================================================
  const disposeTexture = (tex?: THREE.Texture | null) => {
    if (!tex) return;
    if (disposed.has(tex)) return; // Already disposed, skip
    disposed.add(tex); // Mark as disposed

    // TODO-VERIFY: If texture wraps <video> or <canvas>, may need additional cleanup
    // EVIDENCE: lib/three/safeDispose.ts:37 (comment)
    // PATTERN: video.pause(), video.src = '', canvas.getContext().clearRect()
    tex.dispose(); // Release VRAM
  };

  // ============================================================================
  // MATERIAL DISPOSAL
  // ============================================================================
  // ORDER MATTERS:
  // 1. Dispose textures FIRST (material references them)
  // 2. Dispose material SECOND (no dangling texture references)
  //
  // TEXTURE SOURCES:
  // - Standard slots: map, normalMap, roughnessMap, etc. (MATERIAL_TEXTURE_KEYS)
  // - Custom shaders: uniforms can hold textures with arbitrary names
  //
  // WHY UNIFORM CHECK:
  // ShaderMaterial allows custom uniforms. Developers may pass textures with
  // names outside the standard list. Must check all uniform values.
  // ============================================================================
  const disposeMaterial = (mat?: THREE.Material | null) => {
    if (!mat) return;
    if (disposed.has(mat)) return; // Already disposed, skip
    disposed.add(mat); // Mark as disposed

    // ========================================================================
    // STANDARD MATERIAL TEXTURE SLOTS
    // ========================================================================
    for (const key of MATERIAL_TEXTURE_KEYS) {
      const value = (mat as any)[key] as THREE.Texture | null | undefined;
      disposeTexture(value);
    }

    // ========================================================================
    // SHADERMATERIAL UNIFORMS - Custom texture detection
    // ========================================================================
    // PATTERN: Check if uniform.value has .isTexture property
    // WHY: Cannot know uniform names in advance (developer-defined)
    const uniforms = (mat as any).uniforms;
    if (uniforms) {
      for (const u of Object.values(uniforms)) {
        const v = (u as any)?.value;
        if (v && (v as THREE.Texture).isTexture) {
          disposeTexture(v as THREE.Texture); // Found custom shader texture
        }
      }
    }

    mat.dispose(); // Release shader programs, GPU state
  };

  // ============================================================================
  // GEOMETRY DISPOSAL
  // ============================================================================
  // GPU MEMORY: Geometries store vertex/index buffers in VRAM
  // TYPICAL SIZE: Few KB (simple shapes) to 10+ MB (complex models)
  // ============================================================================
  const disposeGeometry = (geo?: THREE.BufferGeometry | null) => {
    if (!geo) return;
    if (disposed.has(geo)) return; // Already disposed, skip
    disposed.add(geo); // Mark as disposed
    geo.dispose(); // Release vertex/index buffers
  };

  // ============================================================================
  // RECURSIVE TRAVERSAL - Walk entire scene hierarchy
  // ============================================================================
  // COVERAGE: Mesh, InstancedMesh, Points, Line, Sprite, any Object3D with geometry/material
  // PATTERN: .traverse() visits every descendant in the tree
  //
  // EDGE CASES HANDLED:
  // - Multi-material meshes (material is array)
  // - Objects without geometry (groups, cameras, lights)
  // - Objects without material (empty Object3D nodes)
  // ============================================================================
  root.traverse((obj) => {
    const anyObj = obj as any; // Type escape for dynamic property access

    // Dispose geometry if present
    if (anyObj.geometry) {
      disposeGeometry(anyObj.geometry as THREE.BufferGeometry);
    }

    // Dispose material(s) if present
    const mat = anyObj.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) {
      mat.forEach(disposeMaterial); // Multi-material mesh
    } else {
      disposeMaterial(mat ?? null); // Single material or no material
    }
  });
}

// ============================================================================
// COMPOSER DISPOSAL - EffectComposer (post-processing) cleanup
// ============================================================================
// PATTERN: Best-effort disposal with try-catch
// WHY: Third-party post-processing passes may have broken dispose() implementations
// CONSEQUENCE: Cannot let disposal errors crash the cleanup process
//
// ORDER:
// 1. Dispose all passes individually (RenderPass, BloomPass, etc.)
// 2. Dispose composer itself (render targets, internal state)
// ============================================================================
export function disposeComposer(composer: any) {
  if (!composer) return;
  try {
    // Dispose all passes (may throw if pass.dispose is missing/broken)
    if (Array.isArray(composer.passes)) {
      for (const p of composer.passes) {
        if (p && typeof p.dispose === "function") p.dispose();
      }
    }
    // Dispose composer (render targets, internal resources)
    if (typeof composer.dispose === "function") composer.dispose();
  } catch {
    // Best-effort disposal: swallow errors, continue cleanup
    // RATIONALE: Better to leak one pass than crash entire disposal
  }
}

// ============================================================================
// RENDERER DISPOSAL - WebGLRenderer cleanup
// ============================================================================
// STANDARD: renderer.dispose() releases:  // - Internal render targets
// - Cached shader programs
// - WebGL state tracking
//
// OPTIONAL: forceContextLoss() for WebGL context accumulation
// WHEN TO USE: After many route navigations in Next.js SPA
// PROBLEM: WebGL contexts have a browser limit (~16 contexts)
// SOLUTION: Force context loss to release WebGL context immediately
//
// TRADE-OFF:
// - Without forceLoss: Contexts cleaned up eventually (slower)
// - With forceLoss: Hard reset, prevents context exhaustion
// ============================================================================
export function disposeRenderer(renderer: THREE.WebGLRenderer, forceLoss = false) {
  try {
    renderer.dispose(); // Release all internal resources
    if (forceLoss) {
      // CRITICAL: Prevents WebGL context accumulation after many navigations
      // EVIDENCE: Comment mentions "lots of navigations"
      // PATTERN: Use forceLoss=true in SPA routes that recreate renderer frequently
      renderer.forceContextLoss();
    }
  } catch {
    // Best-effort disposal: swallow errors
  }
}
