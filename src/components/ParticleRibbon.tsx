"use client";

import { useEffect, useRef } from "react";

import { makeRibbonParticles } from "@/lib/particle-ribbon";

type ParticleRibbonProps = {
  className?: string;
  density?: number;
  animated?: boolean;
  background?: string;
};

/** A responsive, mathematically generated particle ribbon. No image or 3D library needed. */
export default function ParticleRibbon({
  className,
  density = 1,
  animated = true,
  background = "#050505",
}: ParticleRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const particles = makeRibbonParticles(Math.max(0.2, Math.min(density, 2)));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    let lastFrame = -Infinity;

    function resize() {
      if (!canvas || !context) return;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      context.setTransform(
        canvas.width / 1200,
        0,
        0,
        canvas.height / 560,
        0,
        0,
      );
      draw(0);
    }

    function draw(seconds: number) {
      if (!context) return;
      context.fillStyle = background;
      context.fillRect(0, 0, 1200, 560);
      for (const particle of particles) {
        const drift = seconds
          ? Math.sin(seconds * particle.speed + particle.phase) * 2.1
          : 0;
        const shimmer = seconds
          ? 0.87 + 0.13 * Math.sin(seconds * 1.8 + particle.phase)
          : 1;
        context.fillStyle = `rgba(247,249,255,${particle.alpha * shimmer})`;
        context.beginPath();
        context.arc(
          particle.x + drift,
          particle.y + drift * 0.38,
          particle.size,
          0,
          Math.PI * 2,
        );
        context.fill();
        if (particle.glow) {
          context.fillStyle = `rgba(235,243,255,${particle.alpha * 0.09})`;
          context.beginPath();
          context.arc(
            particle.x + drift,
            particle.y + drift * 0.38,
            particle.size * 3.8,
            0,
            Math.PI * 2,
          );
          context.fill();
        }
      }
    }

    function frame(now: number) {
      if (!visible || motion.matches || !animated) return;
      raf = requestAnimationFrame(frame);
      if (now - lastFrame < 1000 / 30) return;
      lastFrame = now;
      draw(now / 1000);
    }

    function refresh() {
      cancelAnimationFrame(raf);
      draw(0);
      if (visible && !motion.matches && animated)
        raf = requestAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    visibilityObserver.observe(canvas);
    motion.addEventListener("change", refresh);
    resize();
    refresh();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", refresh);
    };
  }, [density, animated, background]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="A sweeping arc of white particles on a dark background"
      role="img"
      style={{
        display: "block",
        width: "100%",
        aspectRatio: "1200 / 560",
        background,
      }}
    />
  );
}
