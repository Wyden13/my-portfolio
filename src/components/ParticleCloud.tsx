"use client";

/* Three.js transforms and shader uniforms are mutable render-loop state. */
/* eslint-disable react-hooks/immutability */

import { useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef, type MutableRefObject } from "react";
import {
  AdditiveBlending,
  NormalBlending,
  type Group,
  type ShaderMaterial,
} from "three";
import type { AudioBands } from "@/lib/audio-analysis";

const PARTICLE_COUNT = 48000;

// Visual reference: DenTechs' Blender particle-simulation audio visualizer:
// https://www.youtube.com/watch?v=5J9J03gl0zE
// This is a procedural, real-time approximation of its folded particle clouds,
// not a playback of a baked simulation. Static seeds stay on the GPU.
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uBeat;
  uniform float uMid;
  uniform float uTreble;
  uniform float uEnergy;
  uniform float uPixelRatio;
  uniform float uGlow;
  attribute vec4 aParticle;

  varying float vDensity;
  varying float vColor;
  varying float vAlpha;

  // Analytic curl of a trigonometric vector potential. Coherent, divergence-
  // free motion folds neighboring particles into wisps rather than jitter.
  vec3 curlField(vec3 p, float t) {
    return vec3(
      -cos(p.x + cos(p.y + t)) * sin(p.y + t) - cos(p.z + cos(p.x + t)),
      -cos(p.y + cos(p.z + t)) * sin(p.z + t) - cos(p.x + cos(p.y + t)),
      -cos(p.z + cos(p.x + t)) * sin(p.x + t) - cos(p.y + cos(p.z + t))
    ) * 0.5;
  }

  void main() {
    float t = uTime * 0.23;
    vec3 direction = normalize(position);
    float phase = aParticle.y * 6.2831853;

    // Thin, uneven layers leave genuine empty space through the cloud.
    float folds = sin(direction.x * 4.1 + t)
      * cos(direction.y * 3.7 - t * 0.7)
      + sin(direction.z * 4.8 + direction.x * 2.0 - t) * 0.48;
    float ridge = pow(1.0 - abs(sin(folds * 2.8 + aParticle.z * 0.65)), 3.0);
    float density = smoothstep(-0.22, 0.64, folds);
    vDensity = clamp(density * 0.32 + ridge, 0.0, 1.0);

    float radius = 0.96 + folds * 0.14 + aParticle.z * 0.065;
    vec3 p = direction * radius;
    // Broad curls define the silhouette; finer curls make the smoky folds.
    p += curlField(direction * 2.1, t) * (0.48 + uMid * 0.21);
    p += curlField(p * 4.2, -t * 1.2) * (0.21 + uMid * 0.12);
    p += curlField(p * 8.0, t * 0.8) * (0.035 + uTreble * 0.045);

    // Sparse particles peel away from the dense filaments and return smoothly.
    float drift = sin(uTime * 0.55 + phase) * 0.5 + 0.5;
    p += direction * aParticle.w * drift * (0.16 + uEnergy * 0.3);
    // Opposing hemispheres twist in opposite directions with the midrange.
    float hemisphere = smoothstep(-0.3, 0.3, direction.y) * 2.0 - 1.0;
    float twist = hemisphere * uMid * (1.6 + sin(uTime * 1.8) * 0.45);
    p.xz = mat2(cos(twist), -sin(twist), sin(twist), cos(twist)) * p.xz;
    // High tones pinch the waist inward, with fine ripples along its surface.
    float waist = 1.0 - abs(direction.y);
    p.xz *= 1.0 - uTreble * (0.18 + waist * 0.4);
    p.y *= 1.0 - uTreble * 0.12;
    p += direction * sin(direction.y * 18.0 + phase + uTime * 3.0) * uTreble * 0.09;
    // A sharp onset pushes the entire core out, followed by a short recoil.
    p *= 0.86 + uBass * 0.55 + uBeat * 0.55;

    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp(
      aParticle.x * uPixelRatio * (8.0 / -viewPosition.z)
        * (1.0 + vDensity * 0.25 + uTreble * 0.3)
        * (1.0 + uGlow * 4.0),
      1.0, (6.0 + uGlow * 18.0) * uPixelRatio
    );
    vColor = clamp(0.4 + folds * 0.38 + direction.y * 0.18 + uBass * 0.2, 0.0, 1.0);
    float depthFade = smoothstep(-1.5, 1.4, p.z);
    vAlpha = (0.035 + pow(vDensity, 1.5) * 0.96) * (0.65 + depthFade * 0.35)
      * (1.0 - aParticle.w * 0.5);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDark;
  uniform float uEnergy;
  uniform float uGlow;
  varying float vDensity;
  varying float vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0 || vDensity < 0.12) discard;
    float core = exp(-r * r * 6.0);
    float glow = exp(-r * r * 2.8) * 0.17;
    float edge = 1.0 - smoothstep(0.65, 1.0, r);
    vec3 violet = mix(vec3(0.09, 0.012, 0.3), vec3(0.25, 0.015, 0.95), uDark);
    vec3 pink = mix(vec3(0.55, 0.012, 0.2), vec3(1.0, 0.015, 0.48), uDark);
    vec3 color = mix(violet, pink, smoothstep(0.15, 0.92, vColor));
    color *= 1.0 + uDark * (vDensity * 0.85 + uEnergy * 0.65);
    float alpha = mix(core + glow, exp(-r * r * 4.0) * 0.085, uGlow);
    gl_FragColor = vec4(color, alpha * edge * vAlpha);
    #include <colorspace_fragment>
  }
`;

export default function ParticleCloud({
  bands,
}: {
  bands: MutableRefObject<AudioBands>;
}) {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const glowMaterial = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);
  const width = useThree((state) => state.size.width);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const count = width < 700 ? 28000 : PARTICLE_COUNT;
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uBeat: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uEnergy: { value: 0 },
      uPixelRatio: { value: 1 },
      uDark: { value: 0 },
      uGlow: { value: 0 },
    }),
    [],
  );
  const glowUniforms = useMemo(
    () => ({ ...uniforms, uGlow: { value: 1 } }),
    [uniforms],
  );
  const { positions, particles } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const particles = new Float32Array(PARTICLE_COUNT * 4);
    let seed = 29173;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform spherical seeds avoid polar clustering. Every draw-range
      // prefix covers the whole cloud, so mobile can draw fewer particles.
      const z = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const radius = Math.sqrt(1 - z * z);
      positions.set(
        [radius * Math.cos(theta), radius * Math.sin(theta), z],
        i * 3,
      );
      particles.set(
        [
          1.7 + Math.pow(random(), 2.5) * 2.2,
          random(),
          random() * 2 - 1,
          random() < 0.1 ? 1 : 0,
        ],
        i * 4,
      );
    }
    return { positions, particles };
  }, []);

  useFrame((state, delta) => {
    if (!material.current || !group.current) return;
    const audio = bands.current;
    const step = Math.min(delta, 0.05);
    elapsed.current += step * (0.65 + audio.energy * 1.25);
    // Update the mounted materials: R3F can copy the supplied uniforms, so
    // mutating the original memoized objects can leave the GPU at idle values.
    for (const shader of [material.current, glowMaterial.current]) {
      if (!shader) continue;
      shader.uniforms.uTime.value = elapsed.current;
      shader.uniforms.uBass.value = audio.bass;
      shader.uniforms.uBeat.value = audio.beat;
      shader.uniforms.uMid.value = audio.mid;
      shader.uniforms.uTreble.value = audio.treble;
      shader.uniforms.uEnergy.value = audio.energy;
      shader.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
      shader.uniforms.uDark.value = dark ? 1 : 0;
    }
    group.current.rotation.y += step * (0.08 + audio.energy * 0.18);
    group.current.rotation.z = Math.sin(elapsed.current * 0.11) * 0.16;
  });

  return (
    <group ref={group} rotation={[0.18, -0.35, 0.08]}>
      <points frustumCulled={false}>
        <bufferGeometry drawRange={{ start: 0, count }}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute
            attach="attributes-aParticle"
            args={[particles, 4]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          blending={dark ? AdditiveBlending : NormalBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      {/* A sparse second pass gives dense knots a soft halo without a
          full-screen bloom framebuffer or additional dependencies. */}
      <points frustumCulled={false} visible={dark}>
        <bufferGeometry drawRange={{ start: 0, count: count / 4 }}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute
            attach="attributes-aParticle"
            args={[particles, 4]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={glowMaterial}
          uniforms={glowUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
