"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useMemo, useRef, type MutableRefObject } from "react";
import { type Group, type ShaderMaterial } from "three";
import type { AudioBands } from "@/lib/audio-analysis";
import { makeRibbonParticles } from "@/lib/particle-ribbon";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uBeat;
  uniform float uMid;
  uniform float uTreble;
  uniform float uPixelRatio;
  attribute vec3 aParticle;
  attribute vec2 aMotion;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vec3 p = position;
    // The source ribbon's quiet drifting and shimmer, on both curved sweeps.
    float drift = sin(uTime * aMotion.x + aParticle.z) * 0.012;
    p.xy += vec2(drift, drift * 0.38);
    p.z += sin(p.x * 1.5 + uTime * 0.6) * uMid * 0.12;
    // Leave space as the core punches outward on kick transients.
    p.xy *= 1.0 + uBass * 0.16 + uBeat * 0.12;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = clamp(
      aParticle.x * uPixelRatio * (8.0 / -viewPosition.z)
        * (1.0 + uTreble * 0.18),
      0.7, 7.0 * uPixelRatio
    );
    vAlpha = aParticle.y * (0.87 + 0.13 * sin(uTime * 1.8 + aParticle.z));
    vGlow = aMotion.y;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDark;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float core = 1.0 - smoothstep(0.25, 1.0, r);
    float glow = exp(-r * r * 5.0) * 0.16;
    vec3 color = mix(vec3(0.13, 0.16, 0.23), vec3(0.969, 0.976, 1.0), uDark);
    gl_FragColor = vec4(color, mix(core, glow, vGlow) * vAlpha);
    #include <colorspace_fragment>
  }
`;

/** The ParticleRibbon asset's clustered sweeps, opened into a loop around the core. */
export default function MobiusParticleRing({
  bands,
}: {
  bands: MutableRefObject<AudioBands>;
}) {
  const orbit = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const { resolvedTheme } = useTheme();
  const compact = useThree((state) => state.size.width < 700);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uBeat: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uPixelRatio: { value: 1 },
      uDark: { value: 0 },
    }),
    [],
  );
  const { positions, particles, motion, count } = useMemo(() => {
    const source = makeRibbonParticles(compact ? 0.6 : 1);
    const glows = source.filter((particle) => particle.glow);
    const seeds = [...source, ...glows];
    const positions = new Float32Array(seeds.length * 3);
    const particles = new Float32Array(seeds.length * 3);
    const motion = new Float32Array(seeds.length * 2);

    seeds.forEach((particle, index) => {
      const { x, y, progress, upperBand, size, alpha, phase, speed } = particle;
      const arch = Math.sin(Math.PI * progress);
      const halo = index >= source.length;
      // Preserve the reference's bend, tip clusters and Gaussian scatter.
      // Lower the front sweep to make an opening for the spherical core.
      positions.set([
        (x - 600) / 200,
        (300 - y - (upperBand ? 0 : arch * 160)) / 120,
        arch * (upperBand ? -0.65 : 0.8),
      ], index * 3);
      particles.set([
        size * 2 * (halo ? 3.8 : 1), alpha, phase,
      ], index * 3);
      motion.set([speed, halo ? 1 : 0], index * 2);
    });

    return { positions, particles, motion, count: seeds.length };
  }, [compact]);

  useFrame((state, delta) => {
    if (!material.current || !orbit.current) return;
    const audio = bands.current;
    const uniforms = material.current.uniforms;
    const step = Math.min(delta, 0.05);
    uniforms.uTime.value += step * (0.8 + audio.energy * 0.5);
    uniforms.uBass.value = audio.bass;
    uniforms.uBeat.value = audio.beat;
    uniforms.uMid.value = audio.mid;
    uniforms.uTreble.value = audio.treble;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    uniforms.uDark.value = resolvedTheme === "dark" ? 1 : 0;
    // A gentle rock retains the asset's sweeping silhouette and bright tips.
    orbit.current.rotation.y = Math.sin(uniforms.uTime.value * 0.17) * 0.12;
    orbit.current.rotation.z = Math.sin(uniforms.uTime.value * 0.11) * 0.055;
  });

  return (
    <group ref={orbit}>
      <points frustumCulled={false} renderOrder={1}>
        <bufferGeometry key={count}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aParticle" args={[particles, 3]} />
          <bufferAttribute attach="attributes-aMotion" args={[motion, 2]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
