"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ═════════════════════════════════════════════════════════════════
 * Antigravity Particles Central Configuration (参数集中配置)
 * ═════════════════════════════════════════════════════════════════
 */
export const PARTICLE_CONFIG = {
  count: 500, // 粒子数量
  mouseRadius: 160, // 鼠标斥力场半径 (px)
  repulsionStrength: 28000, // 斥力常数 k (反比于距离平方 F = k / (d^2 + eps))
  springK: 0.032, // 胡克定律弹簧回弹系数 (F = -k * x)
  damping: 0.95, // 空气阻尼衰减系数 (每帧速度衰减为 0.95 倍)
  depthRange: 60, // 3D 空间深度范围 (z 轴)
  cameraZ: 600, // 摄像机视距
  minSize: 2.2, // 粒子最小尺寸 (px)
  maxSize: 4.8, // 粒子最大尺寸 (px)
  colors: {
    dark: {
      primary: "#f3e2cc", // 星芒香槟金
      secondary: "#e9683a", // 琥珀赤橙
      tertiary: "#ffd900", // 晶石明金
    },
    light: {
      primary: "#3a3028", // 精致深石墨
      secondary: "#c2431b", // 陶土赤红
      tertiary: "#8a7560", // 雅致金墨
    },
  },
};

/**
 * Poisson-Disk / Stratified Sampling for uniform initial distribution
 */
function generatePoissonDistributedPoints(count: number, width: number, height: number, depth: number) {
  const points: { x: number; y: number; z: number }[] = [];
  const cols = Math.ceil(Math.sqrt((count * width) / height));
  const rows = Math.ceil(count / cols);
  const cellW = width / cols;
  const cellH = height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (points.length >= count) break;
      // Stratified jitter within cell
      const jx = (c + 0.15 + Math.random() * 0.7) * cellW - width / 2;
      const jy = (r + 0.15 + Math.random() * 0.7) * cellH - height / 2;
      const jz = (Math.random() - 0.5) * depth;
      points.push({ x: jx, y: -jy, z: jz });
    }
  }

  // Shuffle array
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points.slice(0, count);
}

export function AntigravityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // 1. Three.js Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      2 * Math.atan(height / 2 / PARTICLE_CONFIG.cameraZ) * (180 / Math.PI),
      width / height,
      1,
      2000
    );
    camera.position.set(0, 0, PARTICLE_CONFIG.cameraZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);

    let isDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // 2. Physics Simulation State Arrays
    const N = PARTICLE_CONFIG.count;
    const initialPoints = generatePoissonDistributedPoints(N, width, height, PARTICLE_CONFIG.depthRange);

    const homeX = new Float32Array(N);
    const homeY = new Float32Array(N);
    const homeZ = new Float32Array(N);

    const posX = new Float32Array(N);
    const posY = new Float32Array(N);
    const posZ = new Float32Array(N);

    const velX = new Float32Array(N);
    const velY = new Float32Array(N);
    const velZ = new Float32Array(N);

    const baseSizes = new Float32Array(N);
    const phaseOffsets = new Float32Array(N);
    const driftSpeeds = new Float32Array(N);
    const colorTypes = new Uint8Array(N); // 0 = primary, 1 = secondary, 2 = tertiary

    for (let i = 0; i < N; i++) {
      const p = initialPoints[i] || { x: (Math.random() - 0.5) * width, y: (Math.random() - 0.5) * height, z: 0 };
      homeX[i] = posX[i] = p.x;
      homeY[i] = posY[i] = p.y;
      homeZ[i] = posZ[i] = p.z;

      velX[i] = 0;
      velY[i] = 0;
      velZ[i] = 0;

      baseSizes[i] = PARTICLE_CONFIG.minSize + Math.random() * (PARTICLE_CONFIG.maxSize - PARTICLE_CONFIG.minSize);
      phaseOffsets[i] = Math.random() * Math.PI * 2;
      driftSpeeds[i] = 0.2 + Math.random() * 0.4;

      const rand = Math.random();
      colorTypes[i] = rand < 0.65 ? 0 : rand < 0.85 ? 1 : 2;
    }

    // 3. Geometry & Buffer Attributes
    const geometry = new THREE.BufferGeometry();
    const positionsAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    const sizesAttr = new THREE.BufferAttribute(new Float32Array(N), 1);
    const colorsAttr = new THREE.BufferAttribute(new Float32Array(N * 3), 3);
    const alphasAttr = new THREE.BufferAttribute(new Float32Array(N), 1);

    geometry.setAttribute("position", positionsAttr);
    geometry.setAttribute("aSize", sizesAttr);
    geometry.setAttribute("aColor", colorsAttr);
    geometry.setAttribute("aAlpha", alphasAttr);

    function updateColorAttributes(dark: boolean) {
      const themeColors = dark ? PARTICLE_CONFIG.colors.dark : PARTICLE_CONFIG.colors.light;
      const cPrim = new THREE.Color(themeColors.primary);
      const cSec = new THREE.Color(themeColors.secondary);
      const cTert = new THREE.Color(themeColors.tertiary);

      const colorsArr = colorsAttr.array as Float32Array;
      const alphasArr = alphasAttr.array as Float32Array;

      for (let i = 0; i < N; i++) {
        const type = colorTypes[i];
        const c = type === 0 ? cPrim : type === 1 ? cSec : cTert;
        colorsArr[i * 3] = c.r;
        colorsArr[i * 3 + 1] = c.g;
        colorsArr[i * 3 + 2] = c.b;

        // Base opacity
        alphasArr[i] = dark
          ? type === 0
            ? 0.55
            : 0.85
          : type === 0
          ? 0.38
          : 0.65;
      }
      colorsAttr.needsUpdate = true;
      alphasAttr.needsUpdate = true;
    }
    updateColorAttributes(isDark);

    // 4. Custom Glow Points Shader Material
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aAlpha;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = aColor;
          vAlpha = aAlpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (600.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          // Smooth gaussian circular glow
          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          float core = 1.0 - smoothstep(0.0, 0.2, d);
          float alpha = (glow * 0.55 + core * 0.45) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const pointsMesh = new THREE.Points(geometry, material);
    scene.add(pointsMesh);

    // 5. Mouse & Touch Tracking in Three.js Coordinates (Center 0,0)
    const pointer = {
      x: -99999,
      y: -99999,
      active: false,
      lastActive: 0,
    };

    function updatePointer(clientX: number, clientY: number) {
      pointer.x = clientX - width / 2;
      pointer.y = -(clientY - height / 2);
      pointer.active = true;
      pointer.lastActive = performance.now();
    }

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -99999;
      pointer.y = -99999;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("touchend", onPointerLeave);
    document.addEventListener("mouseleave", onPointerLeave);

    // 6. Physics Animation Loop (60 FPS Hooke's Law + Inverse Square Repulsion)
    let animId = 0;
    const clock = new THREE.Clock();

    const REPEL_R = PARTICLE_CONFIG.mouseRadius;
    const REPEL_R_SQ = REPEL_R * REPEL_R;
    const K_REPEL = PARTICLE_CONFIG.repulsionStrength;
    const SPRING_K = PARTICLE_CONFIG.springK;
    const DAMPING = PARTICLE_CONFIG.damping;

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.035);
      const t = clock.elapsedTime;

      // Deactivate mouse if inactive for 2.5s
      if (pointer.active && performance.now() - pointer.lastActive > 2500) {
        pointer.active = false;
        pointer.x = -99999;
        pointer.y = -99999;
      }

      const posArr = positionsAttr.array as Float32Array;
      const sizeArr = sizesAttr.array as Float32Array;

      // Slight global 3D scene tilt from mouse position
      if (pointer.active) {
        pointsMesh.rotation.y += ((pointer.x / width) * 0.08 - pointsMesh.rotation.y) * 0.04;
        pointsMesh.rotation.x += ((-pointer.y / height) * 0.08 - pointsMesh.rotation.x) * 0.04;
      } else {
        pointsMesh.rotation.y += (0 - pointsMesh.rotation.y) * 0.02;
        pointsMesh.rotation.x += (0 - pointsMesh.rotation.x) * 0.02;
      }

      for (let i = 0; i < N; i++) {
        // Natural subtle organic drift of home anchor
        const drift = Math.sin(t * driftSpeeds[i] + phaseOffsets[i]);
        const curHomeX = homeX[i] + drift * 8.0;
        const curHomeY = homeY[i] + Math.cos(t * driftSpeeds[i] * 0.8 + phaseOffsets[i]) * 8.0;
        const curHomeZ = homeZ[i] + Math.sin(t * 0.5 + phaseOffsets[i]) * 12.0;

        // A. Hooke's Law Restoring Spring Force (F = -k * dx)
        const fxSpring = -SPRING_K * (posX[i] - curHomeX);
        const fySpring = -SPRING_K * (posY[i] - curHomeY);
        const fzSpring = -SPRING_K * (posZ[i] - curHomeZ);

        let fxRepel = 0;
        let fyRepel = 0;
        let fzRepel = 0;

        // B. Mouse Repulsion Field (Inverse-Square Law F = k / (d^2 + epsilon))
        if (pointer.active) {
          const dx = posX[i] - pointer.x;
          const dy = posY[i] - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < REPEL_R_SQ && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            // Smooth non-singular inverse-square force
            const force = K_REPEL / (distSq + 450);
            const nx = dx / dist;
            const ny = dy / dist;

            fxRepel = nx * force;
            fyRepel = ny * force;
            // 3D depth dispersion when pushed
            fzRepel = (Math.sin(phaseOffsets[i]) > 0 ? 1 : -1) * force * 0.45;
          }
        }

        // C. Euler Integration with Air Damping (0.95)
        velX[i] = (velX[i] + fxSpring + fxRepel) * DAMPING;
        velY[i] = (velY[i] + fySpring + fyRepel) * DAMPING;
        velZ[i] = (velZ[i] + fzSpring + fzRepel) * DAMPING;

        posX[i] += velX[i] * (dt * 60);
        posY[i] += velY[i] * (dt * 60);
        posZ[i] += velZ[i] * (dt * 60);

        // Update Three.js buffer
        posArr[i * 3] = posX[i];
        posArr[i * 3 + 1] = posY[i];
        posArr[i * 3 + 2] = posZ[i];

        // Breathing particle size
        sizeArr[i] = baseSizes[i] * (1.0 + Math.sin(t * 1.6 + phaseOffsets[i]) * 0.18);
      }

      positionsAttr.needsUpdate = true;
      sizesAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    // 7. Resize Handler with Camera Frustum Update
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.fov = 2 * Math.atan(height / 2 / PARTICLE_CONFIG.cameraZ) * (180 / Math.PI);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // 8. Theme Switch Observer
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      isDark = dark;
      material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      material.needsUpdate = true;
      updateColorAttributes(dark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("touchend", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      observer.disconnect();

      geometry.dispose();
      material.dispose();
      renderer.dispose();
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
