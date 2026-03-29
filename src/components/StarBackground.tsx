"use client";

import { useEffect, useState } from "react";

interface Star {
  id: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate 50-80 random stars
    const starCount = Math.floor(Math.random() * 30) + 30;
    const newStars: Star[] = Array.from({ length: starCount }, (_, i) => ({
      id: `star-${i}`,
      left: Math.random() * 100,
      size: Math.random() * 2 + 2, // 2-4px
      duration: Math.random() * 10 + 90, // 90-95s float time
      delay: Math.random() * 5,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-2 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            bottom: 0,
            left: `${star.left}%`,
            animation: `float-up ${star.duration}s linear ${star.delay}s infinite`,
            // backgroundColor: "",
            opacity: 0.6,
            boxShadow: `0 0 ${star.size}px `,
          }}
        />
      ))}
    </div>
  );
}
