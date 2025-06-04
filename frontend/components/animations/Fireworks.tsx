"use client";

import { useEffect, useState } from "react";

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: {
    x: number;
    y: number;
    angle: number;
    speed: number;
    size: number;
    color: string;
  }[];
  createdAt: number;
}

const Fireworks = () => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  // Colors for the fireworks
  const colors = [
    "#FF5252", // Red
    "#FFEB3B", // Yellow
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#9C27B0", // Purple
    "#FF9800", // Orange
    "#E91E63", // Pink
  ];

  useEffect(() => {
    const createFirework = () => {
      const id = Date.now();
      const x = Math.random() * 100; // Random x position
      const y = Math.random() * 30 + 20; // Random y position, but not too close to top
      
      // Create particles for the firework
      const particles = Array.from({ length: 50 }, () => {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * 2 + 1; // Random speed
        const size = Math.random() * 3 + 1; // Random size
        const color = colors[Math.floor(Math.random() * colors.length)]; // Random color

        return {
          x: 0,
          y: 0,
          angle,
          speed,
          size,
          color,
        };
      });

      setFireworks(prev => [...prev, { id, x, y, particles, createdAt: Date.now() }]);
    };

    // Create a new firework every 1-2 seconds
    const interval = setInterval(createFirework, Math.random() * 1000 + 1000);

    // Clean up old fireworks
    const cleanup = setInterval(() => {
      setFireworks(prev => prev.filter(fw => Date.now() - fw.createdAt < 2000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style>
        {`
          @keyframes explode {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }

          .firework-particle {
            position: absolute;
            border-radius: 50%;
            animation: explode 2s ease-out forwards;
          }
        `}
      </style>
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#0a0a0a] to-[#121212]" />
      {fireworks.map((firework) => (
        <div key={firework.id} className="absolute" style={{ left: `${firework.x}%`, top: `${firework.y}%` }}>
          {firework.particles.map((particle, index) => {
            const distance = (Date.now() - firework.createdAt) / 50; // Distance based on time
            const x = Math.cos(particle.angle) * distance * particle.speed;
            const y = Math.sin(particle.angle) * distance * particle.speed;

            return (
              <div
                key={index}
                className="firework-particle"
                style={{
                  left: x,
                  top: y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Fireworks; 