type Point = { x: number; y: number };
export type RibbonParticle = {
  progress: number;
  upperBand: boolean;
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  speed: number;
  glow: boolean;
};

// Coordinates are in a 1200 × 560 design space, independent of screen pixels.
const upper: Point[] = [
  { x: 128, y: 490 },
  { x: 91, y: 386 },
  { x: 103, y: 280 },
  { x: 205, y: 179 },
  { x: 351, y: 113 },
  { x: 506, y: 109 },
  { x: 655, y: 135 },
  { x: 798, y: 184 },
  { x: 948, y: 249 },
  { x: 1115, y: 334 },
];

const lower: Point[] = [
  { x: 128, y: 490 },
  { x: 224, y: 432 },
  { x: 350, y: 358 },
  { x: 490, y: 310 },
  { x: 638, y: 290 },
  { x: 797, y: 304 },
  { x: 962, y: 332 },
  { x: 1115, y: 334 },
];

function randomGenerator(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function gaussian(random: () => number) {
  return (
    Math.sqrt(-2 * Math.log(Math.max(random(), 1e-9))) *
    Math.cos(2 * Math.PI * random())
  );
}

// Catmull–Rom interpolation makes a smooth spine through the hand placed points.
function curve(points: Point[], t: number): Point {
  const u = Math.max(0, Math.min(0.999999, t)) * (points.length - 1);
  const i = Math.floor(u);
  const f = u - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(points.length - 1, i + 2)];
  const interpolate = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b +
      (-a + c) * f +
      (2 * a - 5 * b + 4 * c - d) * f * f +
      (-a + 3 * b - 3 * c + d) * f * f * f);
  return {
    x: interpolate(p0.x, p1.x, p2.x, p3.x),
    y: interpolate(p0.y, p1.y, p2.y, p3.y),
  };
}

export function makeRibbonParticles(density: number): RibbonParticle[] {
  const random = randomGenerator(7331);
  const particles: RibbonParticle[] = [];

  function addBand(points: Point[], count: number, upperBand: boolean) {
    for (let i = 0; i < count; i++) {
      // Favor the left bend and the shared, luminous right-hand tip.
      const cluster = random();
      const t =
        cluster < 0.16
          ? Math.max(0, Math.min(1, 0.06 + gaussian(random) * 0.055))
          : cluster < 0.39
            ? Math.max(0, Math.min(1, 0.94 + gaussian(random) * 0.052))
            : random();
      const p = curve(points, t);
      const prev = curve(points, Math.max(0, t - 0.001));
      const next = curve(points, Math.min(1, t + 0.001));
      const length = Math.hypot(next.x - prev.x, next.y - prev.y) || 1;
      const nx = -(next.y - prev.y) / length;
      const ny = (next.x - prev.x) / length;

      const ribbonWidth = upperBand
        ? 15 +
          13 * Math.sin(Math.PI * t) +
          13 * Math.exp(-(((t - 0.06) / 0.11) ** 2))
        : 17 +
          23 * Math.sin(Math.PI * t) +
          14 * Math.exp(-(((t - 0.96) / 0.1) ** 2));
      const scatter = Math.max(-2.7, Math.min(2.7, gaussian(random)));
      const along = gaussian(random) * (upperBand ? 4 : 8);
      const looseness = random() < 0.08 ? 1.8 : 1;

      particles.push({
        progress: t,
        upperBand,
        x: p.x + nx * scatter * ribbonWidth * looseness + along * -ny,
        y: p.y + ny * scatter * ribbonWidth * looseness + along * nx,
        size: 0.32 + Math.pow(random(), 3) * 1.18,
        alpha: (upperBand ? 0.18 : 0.12) + Math.pow(random(), 1.7) * 0.69,
        phase: random() * Math.PI * 2,
        speed: 0.55 + random() * 0.8,
        glow: random() < 0.025,
      });
    }
  }

  addBand(upper, Math.round(13700 * density), true);
  addBand(lower, Math.round(6200 * density), false);
  return particles;
}

