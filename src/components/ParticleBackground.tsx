'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  sprite: HTMLCanvasElement;
  coreColor: string;
}

/**
 * Pre-renders a radial gradient glow sprite for a single particle onto
 * an offscreen canvas. This avoids calling createRadialGradient on
 * every frame (30 particles * 60fps = 1,800 allocations/s eliminated).
 */
function createParticleSprite(
  hue: number,
  opacity: number,
  radius: number,
): HTMLCanvasElement {
  const size = Math.ceil(radius * 2);
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const sCtx = sprite.getContext('2d');
  if (sCtx) {
    const gradient = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${opacity})`);
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`);
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, size, size);
  }
  return sprite;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    let stars: Star[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const createParticles = () => {
      particles = [];
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 4 + 2;
        const hue = Math.random() * 60 + 250;
        const opacity = Math.random() * 0.5 + 0.1;
        const spriteRadius = size * 3;

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity,
          hue,
          sprite: createParticleSprite(hue, opacity, spriteRadius),
          coreColor: `hsla(${hue}, 80%, 80%, ${Math.min(opacity * 2, 1)})`,
        });
      }
    };

    createStars();
    createParticles();

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
        const opacity = star.opacity * (0.5 + twinkle * 0.5);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw pre-rendered glow sprite (no per-frame gradient allocation)
        const spriteRadius = particle.size * 3;
        ctx.drawImage(
          particle.sprite,
          particle.x - spriteRadius,
          particle.y - spriteRadius,
        );

        // Bright center dot
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.coreColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
