import * as THREE from "three";

type Disposable =
  | THREE.Object3D
  | THREE.Material
  | THREE.Texture
  | THREE.BufferGeometry
  | THREE.WebGLRenderTarget;

const MATERIAL_TEXTURE_KEYS: (keyof THREE.Material)[] = [
  "map",
  "alphaMap",
  "aoMap",
  "bumpMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "lightMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap",
  "specularMap",
] as any;

/**
 * Disposes geometries, materials, and textures (including maps + shader uniforms).
 * Uses a WeakSet to avoid double-dispose for shared resources.
 */
export function safeDispose(root: THREE.Object3D) {
  const disposed = new WeakSet<object>();

  const disposeTexture = (tex?: THREE.Texture | null) => {
    if (!tex) return;
    if (disposed.has(tex)) return;
    disposed.add(tex);

    // If texture wraps a video/canvas stream, you may also want to pause/stop it here.
    tex.dispose();
  };

  const disposeMaterial = (mat?: THREE.Material | null) => {
    if (!mat) return;
    if (disposed.has(mat)) return;
    disposed.add(mat);

    // Standard material texture slots
    for (const key of MATERIAL_TEXTURE_KEYS) {
      const value = (mat as any)[key] as THREE.Texture | null | undefined;
      disposeTexture(value);
    }

    // ShaderMaterial uniforms can hold textures too
    const uniforms = (mat as any).uniforms;
    if (uniforms) {
      for (const u of Object.values(uniforms)) {
        const v = (u as any)?.value;
        if (v && (v as THREE.Texture).isTexture) disposeTexture(v as THREE.Texture);
      }
    }

    mat.dispose();
  };

  const disposeGeometry = (geo?: THREE.BufferGeometry | null) => {
    if (!geo) return;
    if (disposed.has(geo)) return;
    disposed.add(geo);
    geo.dispose();
  };

  root.traverse((obj) => {
    // InstancedMesh / Mesh / Points / Line all have geometry + material
    const anyObj = obj as any;

    if (anyObj.geometry) disposeGeometry(anyObj.geometry as THREE.BufferGeometry);

    const mat = anyObj.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach(disposeMaterial);
    else disposeMaterial(mat ?? null);
  });
}

/**
 * Composer cleanup: dispose composer + passes if they expose dispose().
 */
export function disposeComposer(composer: any) {
  if (!composer) return;
  try {
    if (Array.isArray(composer.passes)) {
      for (const p of composer.passes) {
        if (p && typeof p.dispose === "function") p.dispose();
      }
    }
    if (typeof composer.dispose === "function") composer.dispose();
  } catch {
    // swallow — disposal is best-effort
  }
}

/**
 * Renderer cleanup: dispose + (optional) forceContextLoss for hard resets on route churn.
 */
export function disposeRenderer(renderer: THREE.WebGLRenderer, forceLoss = false) {
  try {
    renderer.dispose();
    if (forceLoss) {
      // Useful if you see WebGL context accumulation after lots of navigations.
      renderer.forceContextLoss();
    }
  } catch {
    // noop
  }
}
