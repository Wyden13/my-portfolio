"use client";

/* GPU uniforms and scene transforms are mutable render-loop state. */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import {
  BoxGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  type Group,
  type ShaderMaterial,
} from "three";
import type { AudioBands } from "@/lib/audio-analysis";
import { makeRibbonParticles } from "@/lib/particle-ribbon";
import type { VisualizerPalette } from "@/lib/visualizer-palette";

export type CubeParticlesProps = {
  bands: MutableRefObject<AudioBands>;
  clock: MutableRefObject<number>;
  palette: VisualizerPalette;
};
type Kind = "blob" | "ring" | "floating";

const vertexShader = /* glsl */ `
  uniform float uTime, uBass, uBeat, uMid, uTreble, uEnergy, uKind;
  attribute vec3 aCenter;
  attribute vec4 aParticle;
  varying float vColor, vBrightness;
  varying vec3 vNormal;

  vec3 curlField(vec3 p, float t) {
    return vec3(
      -cos(p.x + cos(p.y + t)) * sin(p.y + t) - cos(p.z + cos(p.x + t)),
      -cos(p.y + cos(p.z + t)) * sin(p.z + t) - cos(p.x + cos(p.y + t)),
      -cos(p.z + cos(p.x + t)) * sin(p.x + t) - cos(p.y + cos(p.z + t))
    ) * 0.5;
  }

  // The same normalized deformation drives the blob and the larger ribbon.
  // Only centers deform: each cube retains six flat, rigid faces.
  vec3 audioDeform(vec3 p, vec3 direction, float phase, float restingRadius) {
    float hemisphere = smoothstep(-0.3, 0.3, direction.y) * 2.0 - 1.0;
    float twist = hemisphere * uMid * (1.6 + sin(uTime * 1.8) * 0.45);
    p.xz = mat2(cos(twist), -sin(twist), sin(twist), cos(twist)) * p.xz;
    float waist = 1.0 - abs(direction.y);
    p.xz *= 1.0 - uTreble * (0.18 + waist * 0.4);
    p.y *= 1.0 - uTreble * 0.12;
    p += direction * sin(direction.y * 18.0 + phase + uTime * 3.0)
      * uTreble * 0.09 * restingRadius;
    return p * (1.0 + (uBass * 0.55 + uBeat * 0.55) / 0.86);
  }

  void main() {
    vec3 p = aCenter;
    float phase = aParticle.y;
    float cubeSize = aParticle.x;
    vColor = 0.0;
    vBrightness = 1.0;
    if (uKind < 0.5) {
      float t = uTime * 0.23;
      vec3 direction = normalize(aCenter);
      float folds = sin(direction.x * 4.1 + t) * cos(direction.y * 3.7 - t * 0.7)
        + sin(direction.z * 4.8 + direction.x * 2.0 - t) * 0.48;
      float ridge = pow(1.0 - abs(sin(folds * 2.8 + aParticle.z * 0.65)), 3.0);
      float density = clamp(smoothstep(-0.22, 0.64, folds) * 0.32 + ridge, 0.0, 1.0);
      p = direction * (0.96 + folds * 0.14 + aParticle.z * 0.065);
      p += curlField(direction * 2.1, t) * (0.48 + uMid * 0.21);
      p += curlField(p * 4.2, -t * 1.2) * (0.21 + uMid * 0.12);
      p += curlField(p * 8.0, t * 0.8) * (0.035 + uTreble * 0.045);
      p += direction * aParticle.w * (sin(uTime * 0.55 + phase) * 0.5 + 0.5)
        * (0.16 + uEnergy * 0.3);
      p = audioDeform(p * 0.86, direction, phase, 0.86);
      cubeSize *= smoothstep(0.1, 0.6, density) * (0.8 + density * 0.4);
      vColor = smoothstep(0.15, 0.92, clamp(0.4 + folds * 0.38 + direction.y * 0.18 + uBass * 0.2, 0.0, 1.0));
      vBrightness = 0.7 + density * 0.3;
    } else if (uKind < 1.5) {
      float drift = sin(uTime * aParticle.z + phase) * 0.012;
      p.xy += vec2(drift, drift * 0.38);
      p = audioDeform(p, normalize(aCenter), phase, length(aCenter));
      vBrightness = (0.7 + 0.3 * aParticle.w) * (0.87 + 0.13 * sin(uTime * 1.8 + phase));
    } else {
      p += vec3(sin(uTime * 0.25 + phase), cos(uTime * 0.2 + phase), sin(uTime * 0.15 + phase)) * 0.12;
      vBrightness = 0.75 + 0.25 * sin(uTime + phase);
    }
    // A fixed bevel-free orientation exposes the top and side faces.
    mat3 cubeRotation = mat3(0.866, 0.0, -0.5, 0.171, 0.94, 0.296, 0.47, -0.342, 0.814);
    vec3 localPosition = p + cubeRotation * position * cubeSize;
    vNormal = normalize(normalMatrix * cubeRotation * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localPosition, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor, uHighlightColor;
  varying float vColor, vBrightness;
  varying vec3 vNormal;
  void main() {
    float lighting = 0.38 + 0.62 * max(dot(normalize(vNormal), normalize(vec3(-0.4, 0.8, 1.0))), 0.0);
    vec3 color = mix(uBaseColor, uHighlightColor, vColor) * lighting * vBrightness;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function makeGeometry(kind: Kind, compact: boolean, playing: boolean) {
  const count =
    kind === "blob"
      ? compact
        ? 6000
        : 12000
      : kind === "ring"
        ? compact
          ? 4000
          : 8000
        : playing
          ? 70
          : 42;
  const centers = new Float32Array(count * 3);
  const particles = new Float32Array(count * 4);
  let seed = 29173;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const ribbon = kind === "ring" ? makeRibbonParticles(count / 19900) : [];
  for (let i = 0; i < count; i++) {
    if (kind === "ring") {
      const particle = ribbon[i];
      const arch = Math.sin(Math.PI * particle.progress);
      centers.set(
        [
          (particle.x - 600) / 200,
          (300 - particle.y - (particle.upperBand ? 0 : arch * 160)) / 120,
          arch * (particle.upperBand ? -0.65 : 0.8),
        ],
        i * 3,
      );
      particles.set(
        [
          0.009 + particle.size * 0.018,
          particle.phase,
          particle.speed,
          particle.alpha,
        ],
        i * 4,
      );
    } else if (kind === "blob") {
      const z = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const radius = Math.sqrt(1 - z * z);
      centers.set(
        [radius * Math.cos(theta), radius * Math.sin(theta), z],
        i * 3,
      );
      particles.set(
        [
          0.016 + random() ** 2.5 * 0.018,
          random() * Math.PI * 2,
          random() * 2 - 1,
          random() < 0.1 ? 1 : 0,
        ],
        i * 4,
      );
    } else {
      centers.set(
        [(random() - 0.5) * 5, (random() - 0.5) * 3.5, (random() - 0.5) * 3],
        i * 3,
      );
      particles.set(
        [0.013 + random() * 0.01, random() * Math.PI * 2, 0, 0],
        i * 4,
      );
    }
  }
  const box = new BoxGeometry(1, 1, 1);
  const geometry = new InstancedBufferGeometry();
  geometry.index = box.index;
  geometry.setAttribute("position", box.attributes.position);
  geometry.setAttribute("normal", box.attributes.normal);
  geometry.setAttribute("aCenter", new InstancedBufferAttribute(centers, 3));
  geometry.setAttribute(
    "aParticle",
    new InstancedBufferAttribute(particles, 4),
  );
  geometry.instanceCount = count;
  box.dispose();
  return geometry;
}

export default function CubeParticles({
  kind,
  bands,
  clock,
  palette,
  playing = false,
}: CubeParticlesProps & {
  kind: Kind;
  playing?: boolean;
}) {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);
  const compact = useThree((state) => state.size.width < 700);
  const geometry = useMemo(
    () => makeGeometry(kind, compact, playing),
    [kind, compact, playing],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBass: { value: 0 },
      uBeat: { value: 0 },
      uMid: { value: 0 },
      uTreble: { value: 0 },
      uEnergy: { value: 0 },
      uKind: { value: kind === "blob" ? 0 : kind === "ring" ? 1 : 2 },
      uBaseColor: { value: new Color() },
      uHighlightColor: { value: new Color() },
    }),
    [kind],
  );

  useFrame((_, delta) => {
    if (!material.current || !group.current) return;
    const audio = bands.current;
    const shader = material.current.uniforms;
    shader.uTime.value = clock.current;
    shader.uBass.value = audio.bass;
    shader.uBeat.value = audio.beat;
    shader.uMid.value = audio.mid;
    shader.uTreble.value = audio.treble;
    shader.uEnergy.value = audio.energy;
    const color =
      kind === "blob"
        ? palette.blobBase
        : kind === "ring"
          ? palette.ring
          : palette.floating;
    shader.uBaseColor.value.set(color);
    shader.uHighlightColor.value.set(
      kind === "blob" ? palette.blobHighlight : color,
    );
    const step = Math.min(delta, 0.1);
    if (kind === "ring") {
      group.current.rotation.z +=
        step * (Math.PI / 6) * (1 + Math.min(1, audio.energy));
      group.current.rotation.y = Math.sin(clock.current * 0.17) * 0.12;
    } else if (kind === "blob") {
      group.current.rotation.y += step * (0.08 + audio.energy * 0.18);
      group.current.rotation.z = Math.sin(clock.current * 0.11) * 0.16;
    }
  });

  return (
    <group
      ref={group}
      rotation={kind === "blob" ? [0.18, -0.35, 0.08] : [0, 0, 0]}
    >
      <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          depthTest
          depthWrite
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
