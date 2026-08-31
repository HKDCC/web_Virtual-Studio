"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  driftAngle: number;
  driftSpeed: number;
  isAccent: boolean;
}

export function AntigravityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Mouse Tracking with smooth decay
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      lastMove: 0,
    };

    // Initialize particles
    const count = Math.min(140, Math.max(50, Math.floor(width / 14)));
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      particles.push({
        x: px,
        y: py,
        homeX: px,
        homeY: py,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.5 + 1.1, // 1.1px ~ 2.6px
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.025 + 0.012,
        pulseOffset: Math.random() * Math.PI * 2,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.25 + 0.1,
        isAccent: Math.random() < 0.18, // 18% accent tint particles
      });
    }

    let animId = 0;
    let t = 0;

    const REPEL_RADIUS = 145; // Antigravity repulsion field radius in pixels
    const REPEL_FORCE = 3.6; // Repulsion push strength

    function render() {
      if (!ctx) return;
      t += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Check if mouse is inactive
      if (mouse.active && performance.now() - mouse.lastMove > 2500) {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Natural slow wandering drift of home anchor
        p.driftAngle += 0.008;
        p.homeX += Math.cos(p.driftAngle) * p.driftSpeed;
        p.homeY += Math.sin(p.driftAngle) * p.driftSpeed;

        // Wrap home anchors smoothly around screen bounds
        if (p.homeX < -20) p.homeX = width + 20;
        if (p.homeX > width + 20) p.homeX = -20;
        if (p.homeY < -20) p.homeY = height + 20;
        if (p.homeY > height + 20) p.homeY = -20;

        // 2. Cursor Anti-Gravity Repulsion Force Field
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = Math.pow(1 - dist / REPEL_RADIUS, 1.8) * REPEL_FORCE;
            const nx = dx / dist;
            const ny = dy / dist;

            // Push particles away smoothly
            p.vx += nx * force * 1.8;
            p.vy += ny * force * 1.8;
          }
        }

        // 3. Elastic Spring Return to Home Position
        const returnForceX = (p.homeX - p.x) * 0.028;
        const returnForceY = (p.homeY - p.y) * 0.028;

        p.vx = (p.vx + returnForceX) * 0.88;
        p.vy = (p.vy + returnForceY) * 0.88;

        p.x += p.vx;
        p.y += p.vy;

        // 4. Breathing Alpha
        const dynamicAlpha = Math.max(
          0.05,
          p.alpha + Math.sin(t * p.pulseSpeed * 60 + p.pulseOffset) * 0.12
        );

        // 5. Drawing with Dual-Theme Colors
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isDark) {
          if (p.isAccent) {
            ctx.fillStyle = `rgba(233, 104, 58, ${dynamicAlpha * 0.85})`; // Warm Terracotta / Orange
          } else {
            ctx.fillStyle = `rgba(238, 222, 198, ${dynamicAlpha * 0.65})`; // Champagne / Starlight Gold
          }
        } else {
          if (p.isAccent) {
            ctx.fillStyle = `rgba(194, 67, 27, ${dynamicAlpha * 0.65})`; // Warm Amber Ink
          } else {
            ctx.fillStyle = `rgba(60, 52, 44, ${dynamicAlpha * 0.42})`; // Refined Graphite Ink
          }
        }

        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // Global Pointer Events
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastMove = performance.now();
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    // Window Resize Handler
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Theme Change Observer
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.getAttribute("data-theme") === "dark";
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="antigravity-bg-particles"
      aria-hidden="true"
    />
  );
}
