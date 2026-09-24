"use client";

import CubeParticles, {
  type CubeParticlesProps,
} from "@/components/CubeParticles";

export default function ParticleCloud(props: CubeParticlesProps) {
  return <CubeParticles kind="blob" {...props} />;
}
