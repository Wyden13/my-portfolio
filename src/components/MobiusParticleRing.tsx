"use client";

import CubeParticles, {
  type CubeParticlesProps,
} from "@/components/CubeParticles";

/** The reference ribbon's clustered sweeps, animated as a ring of rigid cubes. */
export default function MobiusParticleRing(props: CubeParticlesProps) {
  return <CubeParticles kind="ring" {...props} />;
}
