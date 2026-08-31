"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { GAMES_DATA, GameItem, STATUS_META } from "@/data/gamesData";

export function GameShelfSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const N = GAMES_DATA.length;

  // References to communicate with Three.js loop
  const threeState = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    reflector: Reflector | null;
    wallMat: THREE.MeshStandardMaterial | null;
    floorMat: THREE.MeshStandardMaterial | null;
    shelfMat: THREE.MeshStandardMaterial | null;
    hemiLight: THREE.HemisphereLight | null;
    frontLight: THREE.DirectionalLight | null;
    keyLight: THREE.SpotLight | null;
    centerLight: THREE.SpotLight | null;
    rimL: THREE.PointLight | null;
    rimR: THREE.PointLight | null;
    dustMat: THREE.PointsMaterial | null;
    cases: THREE.Mesh[];
    cur: number;
    target: number;
    dragTarget: number;
    dragCur: number;
    animId: number;
    clock: THREE.Clock;
    isDark: boolean;
    buildCasesFn: (dark: boolean) => void;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    reflector: null,
    wallMat: null,
    floorMat: null,
    shelfMat: null,
    hemiLight: null,
    frontLight: null,
    keyLight: null,
    centerLight: null,
    rimL: null,
    rimR: null,
    dustMat: null,
    cases: [],
    cur: 0,
    target: 0,
    dragTarget: 0,
    dragCur: 0,
    animId: 0,
    clock: new THREE.Clock(),
    isDark: true,
    buildCasesFn: () => {},
  });

  const handleIndexChange = useCallback(
    (targetVal: number) => {
      const idx = ((Math.round(targetVal) % N) + N) % N;
      setCurrentIndex(idx);
    },
    [N]
  );

  const navigate = useCallback(
    (delta: number) => {
      threeState.current.target += delta;
      handleIndexChange(threeState.current.target);
    },
    [handleIndexChange]
  );

  const openDetail = useCallback((game: GameItem) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Main Three.js setup & lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 680;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Scene & Fog
    const scene = new THREE.Scene();
    const isInitialDark =
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    threeState.current.isDark = isInitialDark;

    const darkBgColor = new THREE.Color(0x161310);
    const lightBgColor = new THREE.Color(0xf6f2ea);
    scene.background = (isInitialDark ? darkBgColor : lightBgColor).clone();
    scene.fog = new THREE.FogExp2(scene.background.getHex(), isInitialDark ? 0.022 : 0.016);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 90);
    camera.position.set(0, 0.45, 7.2);

    // High Brightness Realistic Studio Lighting
    const hemiLight = new THREE.HemisphereLight(
      isInitialDark ? 0x6a7590 : 0xfff8ee,
      isInitialDark ? 0x221c16 : 0xe4dcd0,
      isInitialDark ? 1.1 : 1.5
    );
    scene.add(hemiLight);

    // Front soft fill light (directly illuminating cards)
    const frontLight = new THREE.DirectionalLight(0xfff8f0, isInitialDark ? 2.6 : 3.0);
    frontLight.position.set(0, 2.5, 7.5);
    scene.add(frontLight);

    const keyLight = new THREE.SpotLight(0xfff5e6, isInitialDark ? 4.5 : 4.0, 0, 0.62, 0.65, 1.0);
    keyLight.position.set(3.0, 6.5, 5.5);
    scene.add(keyLight);
    scene.add(keyLight.target);

    const centerLight = new THREE.SpotLight(0xffffff, isInitialDark ? 3.4 : 3.0, 0, 0.55, 0.85, 1.0);
    centerLight.position.set(0, 4.2, 3.5);
    centerLight.target.position.set(0, 0.1, 0);
    scene.add(centerLight);
    scene.add(centerLight.target);

    const rimL = new THREE.PointLight(0x6b8eff, isInitialDark ? 1.6 : 1.0, 0, 1.2);
    rimL.position.set(-5.5, 2.8, 1.8);
    scene.add(rimL);

    const rimR = new THREE.PointLight(0xffaa55, isInitialDark ? 1.4 : 0.9, 0, 1.2);
    rimR.position.set(5.5, 2.0, 1.5);
    scene.add(rimR);

    // Background Wall Grid
    function createWallGrid(isDark: boolean) {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const x = c.getContext("2d");
      if (!x) return c;
      x.fillStyle = isDark ? "#120f0c" : "#eae4d8";
      x.fillRect(0, 0, 256, 256);
      x.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
      x.lineWidth = 1.5;
      for (let i = 0; i <= 256; i += 64) {
        x.beginPath();
        x.moveTo(i, 0);
        x.lineTo(i, 256);
        x.stroke();
        x.beginPath();
        x.moveTo(0, i);
        x.lineTo(256, i);
        x.stroke();
      }
      x.fillStyle = isDark ? "rgba(233,104,58,0.08)" : "rgba(194,67,27,0.06)";
      x.fillRect(0, 252, 256, 4);
      return c;
    }

    const wallTex = new THREE.CanvasTexture(createWallGrid(isInitialDark));
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(10, 4);
    wallTex.colorSpace = THREE.SRGBColorSpace;

    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      roughness: 0.95,
      color: isInitialDark ? 0x888e9f : 0xd8d2c4,
    });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(50, 20), wallMat);
    wall.position.set(0, 1.6, -6.5);
    scene.add(wall);

    // Floor Base (matte absorbent gallery floor)
    const floorMat = new THREE.MeshStandardMaterial({
      color: isInitialDark ? 0x110e0c : 0xebe5da,
      roughness: 0.92,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(70, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.7;
    scene.add(floor);

    // Subtle Ground Reflector (subtle, non-harsh reflection)
    const reflector = new Reflector(new THREE.PlaneGeometry(50, 22), {
      clipBias: 0.003,
      textureWidth: Math.min(width * (window.devicePixelRatio || 1), 1920),
      textureHeight: Math.min(height * (window.devicePixelRatio || 1), 1080),
      color: isInitialDark ? 0x0c0c10 : 0xb0aba0,
    });
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.y = -1.69;
    scene.add(reflector);

    // Studio Shelf Stand
    const shelfMat = new THREE.MeshStandardMaterial({
      color: isInitialDark ? 0x1e1915 : 0xd8d1c4,
      roughness: 0.8,
      metalness: 0.15,
    });
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(46, 0.28, 3.2), shelfMat);
    shelf.position.set(0, -1.55, -0.6);
    scene.add(shelf);

    // Ambient floating dust particles
    const dustCount = 180;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 24;
      dustPos[i * 3 + 1] = -1.4 + Math.random() * 5.5;
      dustPos[i * 3 + 2] = -5.5 + Math.random() * 8.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: isInitialDark ? 0x93a8cc : 0x82786a,
      size: 0.032,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Focus indicator chevron
    function createChevronCanvas(colorStr: string) {
      const c = document.createElement("canvas");
      c.width = 128;
      c.height = 64;
      const x = c.getContext("2d");
      if (!x) return c;
      x.fillStyle = colorStr;
      x.beginPath();
      x.moveTo(10, 8);
      x.lineTo(64, 42);
      x.lineTo(118, 8);
      x.lineTo(118, 24);
      x.lineTo(64, 58);
      x.lineTo(10, 24);
      x.closePath();
      x.fill();
      return c;
    }
    const chevTex = new THREE.CanvasTexture(createChevronCanvas(isInitialDark ? "#E9683A" : "#C2431B"));
    const chev = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.28),
      new THREE.MeshBasicMaterial({ map: chevTex, transparent: true, depthWrite: false })
    );
    chev.position.set(0, 1.98, 0.55);
    scene.add(chev);

    // Helper functions for box textures
    function texOf(cv: HTMLCanvasElement) {
      const t = new THREE.CanvasTexture(cv);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    }

    function makeProceduralCover(g: GameItem, idx: number, isDark: boolean) {
      const W = 560;
      const H = 780;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const x = cv.getContext("2d");
      if (!x) return cv;

      // Base gradient
      const g1 = x.createLinearGradient(0, H, W, 0);
      g1.addColorStop(0, g.pal[1]);
      g1.addColorStop(1, g.pal[0]);
      x.fillStyle = g1;
      x.fillRect(0, 0, W, H);

      // Soft spotlight
      const rg = x.createRadialGradient(W * 0.25, H * 0.18, 20, W * 0.25, H * 0.18, W * 0.85);
      rg.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      rg.addColorStop(1, "rgba(255, 255, 255, 0)");
      x.fillStyle = rg;
      x.fillRect(0, 0, W, H);

      // Top-Left Pill Badge: VIRTUAL STUDIO
      x.save();
      x.fillStyle = "rgba(0, 0, 0, 0.65)";
      x.beginPath();
      if (x.roundRect) {
        x.roundRect(18, 18, 172, 34, 4);
      } else {
        x.rect(18, 18, 172, 34);
      }
      x.fill();
      x.strokeStyle = isDark ? "rgba(233, 104, 58, 0.65)" : "rgba(255, 217, 0, 0.65)";
      x.lineWidth = 1.5;
      x.stroke();

      x.fillStyle = isDark ? "#E9683A" : "#FFD900";
      x.font = "900 13px Arial, sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText("VIRTUAL STUDIO", 104, 35);
      x.restore();

      // Big index watermark
      x.save();
      x.globalAlpha = 0.12;
      x.fillStyle = "#ffffff";
      x.font = "900 210px Arial";
      x.textAlign = "right";
      x.fillText(String(idx + 1).padStart(2, "0"), W - 14, H - 120);
      x.restore();

      // Stamp badge in top right
      x.shadowColor = "rgba(0, 0, 0, 0.5)";
      x.shadowBlur = 16;
      x.beginPath();
      x.arc(W - 80, 52, 32, 0, Math.PI * 2);
      x.fillStyle = g.rating != null ? (isDark ? "#E9683A" : "#C2431B") : "rgba(20, 20, 24, 0.85)";
      x.fill();
      x.shadowBlur = 0;
      x.fillStyle = g.rating != null ? "#ffffff" : "#8b93a6";
      x.font = "900 24px Arial";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(
        g.rating != null
          ? String(g.rating)
          : { completed: "✓", playing: "▶", dropped: "✕", wishlist: "+" }[g.status],
        W - 80,
        52
      );

      // Title vertical characters
      const chars = [...g.title];
      const useChars = chars.length > 10 ? chars.slice(0, 10) : chars;
      const fs = useChars.length >= 10 ? 52 : useChars.length >= 8 ? 62 : useChars.length >= 6 ? 72 : 88;
      x.font = `900 ${fs}px "Noto Serif SC", "Songti SC", "PingFang SC", sans-serif`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.shadowColor = "rgba(0, 0, 0, 0.7)";
      x.shadowBlur = 14;
      x.shadowOffsetY = 5;
      x.fillStyle = "#ffffff";
      useChars.forEach((ch, j) => x.fillText(ch, 92, 130 + fs * 1.04 * j + fs * 0.55));
      x.shadowBlur = 0;
      x.shadowOffsetY = 0;

      // English title bottom
      let efs = 36;
      x.font = `900 ${efs}px Arial`;
      while (x.measureText(g.en).width > W - 70 && efs > 14) {
        efs -= 2;
        x.font = `900 ${efs}px Arial`;
      }
      x.fillStyle = "rgba(255, 255, 255, 0.94)";
      x.fillText(g.en, W / 2, H - 42);

      return cv;
    }

    function makeSpine(g: GameItem, isDark: boolean) {
      const c = document.createElement("canvas");
      c.width = 96;
      c.height = 780;
      const x = c.getContext("2d");
      if (!x) return c;
      const g1 = x.createLinearGradient(0, 0, 96, 0);
      g1.addColorStop(0, isDark ? "#231f1c" : "#dcd6ca");
      g1.addColorStop(1, isDark ? "#0d0b09" : "#c6c0b3");
      x.fillStyle = g1;
      x.fillRect(0, 0, 96, 780);
      x.fillStyle = isDark ? "#E9683A" : "#C2431B";
      x.fillRect(0, 0, 96, 8);
      x.fillRect(0, 772, 96, 8);
      x.fillStyle = isDark ? "#e8eaf1" : "#1d1710";
      x.font = '900 28px "Noto Serif SC", "Songti SC", "PingFang SC", sans-serif';
      x.textAlign = "center";
      x.textBaseline = "middle";
      [...g.title].slice(0, 14).forEach((ch, j) => x.fillText(ch, 48, 52 + j * 42));
      return c;
    }

    function makeBack(isDark: boolean) {
      const c = document.createElement("canvas");
      c.width = 560;
      c.height = 780;
      const x = c.getContext("2d");
      if (!x) return c;
      x.fillStyle = isDark ? "#120f0d" : "#e6e0d4";
      x.fillRect(0, 0, 560, 780);
      x.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)";
      for (let i = 0; i < 560; i += 40) {
        x.beginPath();
        x.moveTo(i, 0);
        x.lineTo(i, 780);
        x.stroke();
      }
      x.fillStyle = isDark ? "#48413a" : "#9e9688";
      x.font = "900 26px Arial";
      x.textAlign = "center";
      x.fillText("VIRTUAL STUDIO · ARCHIVE", 280, 380);
      x.fillStyle = isDark ? "#322d28" : "#b5ad9e";
      x.font = "700 15px Arial";
      x.fillText("REW · PLAY · FF", 280, 416);
      return c;
    }

    function coverFit(cv: HTMLCanvasElement, img: HTMLImageElement, isDark: boolean) {
      const x = cv.getContext("2d");
      if (!x) return;
      const W = cv.width;
      const H = cv.height;
      const s = Math.max(W / img.width, H / img.height);
      const w = img.width * s;
      const h = img.height * s;
      x.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);

      // Top-Left Brand Badge (no bottom obstruction)
      x.save();
      x.fillStyle = "rgba(0, 0, 0, 0.65)";
      x.beginPath();
      if (x.roundRect) {
        x.roundRect(18, 18, 168, 34, 4);
      } else {
        x.rect(18, 18, 168, 34);
      }
      x.fill();
      x.strokeStyle = isDark ? "rgba(233, 104, 58, 0.65)" : "rgba(255, 217, 0, 0.65)";
      x.lineWidth = 1.5;
      x.stroke();

      x.fillStyle = isDark ? "#E9683A" : "#FFD900";
      x.font = "900 13px Arial, sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText("VIRTUAL STUDIO", 102, 35);
      x.restore();
    }

    // Box Geometry & Materials
    const caseGeo = new THREE.BoxGeometry(2, 2.8, 0.24);
    const darkMat = new THREE.MeshStandardMaterial({
      color: isInitialDark ? 0x0f0c0a : 0xd8d2c4,
      roughness: 0.9,
    });

    let currentCases: THREE.Mesh[] = [];

    function buildCases(isDark: boolean) {
      currentCases.forEach((m) => {
        const u = m.userData;
        if (u.sharp) u.sharp.dispose();
        if (u.frontMat) u.frontMat.dispose();
        if (u.spineMat) {
          if (u.spineMat.map) u.spineMat.map.dispose();
          u.spineMat.dispose();
        }
        scene.remove(m);
      });
      currentCases = [];

      const backMat = new THREE.MeshStandardMaterial({
        map: texOf(makeBack(isDark)),
        roughness: 0.85,
      });

      GAMES_DATA.forEach((g, i) => {
        const sharpCv = makeProceduralCover(g, i, isDark);
        const sharpT = texOf(sharpCv);

        // Front Face: MeshPhysicalMaterial with CLEARCOAT for glossy lacquer texture
        const frontMat = new THREE.MeshPhysicalMaterial({
          map: sharpT,
          roughness: 0.18,
          metalness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          reflectivity: 0.92,
        });

        const spineMat = new THREE.MeshStandardMaterial({
          map: texOf(makeSpine(g, isDark)),
          roughness: 0.72,
        });

        const mesh = new THREE.Mesh(caseGeo, [spineMat, spineMat, darkMat, darkMat, frontMat, backMat]);
        mesh.userData = {
          game: g,
          i,
          frontMat,
          spineMat,
          sharp: sharpT,
          spawn: -(i * 0.045),
        };

        if (g.cover) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const x = sharpCv.getContext("2d");
            if (x) {
              x.clearRect(0, 0, 560, 780);
              coverFit(sharpCv, img, isDark);
              sharpT.needsUpdate = true;
            }
          };
          img.src = g.cover;
        }

        scene.add(mesh);
        currentCases.push(mesh);
      });

      threeState.current.cases = currentCases;
    }

    threeState.current.buildCasesFn = buildCases;
    buildCases(isInitialDark);

    // Dynamic Theme Updater
    function updateTheme(dark: boolean) {
      threeState.current.isDark = dark;
      const bgColor = dark ? darkBgColor : lightBgColor;
      scene.background = bgColor.clone();
      if (scene.fog) {
        scene.fog.color = bgColor.clone();
        if ("density" in scene.fog) {
          (scene.fog as THREE.FogExp2).density = dark ? 0.022 : 0.016;
        }
      }

      hemiLight.color.setHex(dark ? 0x6a7590 : 0xfff8ee);
      hemiLight.groundColor.setHex(dark ? 0x221c16 : 0xe4dcd0);
      hemiLight.intensity = dark ? 1.1 : 1.5;

      if (frontLight) {
        frontLight.intensity = dark ? 2.6 : 3.0;
      }

      keyLight.intensity = dark ? 4.5 : 4.0;
      centerLight.intensity = dark ? 3.4 : 3.0;
      rimL.intensity = dark ? 1.6 : 1.0;
      rimR.intensity = dark ? 1.4 : 0.9;

      wallMat.color.setHex(dark ? 0x888e9f : 0xd8d2c4);
      floorMat.color.setHex(dark ? 0x110e0c : 0xebe5da);
      shelfMat.color.setHex(dark ? 0x1e1915 : 0xd8d1c4);

      if (reflector.material && "color" in reflector.material) {
        (reflector.material.color as THREE.Color).setHex(dark ? 0x0c0c10 : 0xb0aba0);
      }

      dustMat.color.setHex(dark ? 0x93a8cc : 0x82786a);

      buildCases(dark);
    }

    threeState.current.scene = scene;
    threeState.current.camera = camera;
    threeState.current.renderer = renderer;
    threeState.current.reflector = reflector;
    threeState.current.wallMat = wallMat;
    threeState.current.floorMat = floorMat;
    threeState.current.shelfMat = shelfMat;
    threeState.current.hemiLight = hemiLight;
    threeState.current.frontLight = frontLight;
    threeState.current.keyLight = keyLight;
    threeState.current.centerLight = centerLight;
    threeState.current.rimL = rimL;
    threeState.current.rimR = rimR;
    threeState.current.dustMat = dustMat;

    // Animation Loop with Infinite Wrap-around Carousel
    let mouseX = 0;
    let mouseY = 0;

    function animate() {
      const state = threeState.current;
      const dt = Math.min(state.clock.getDelta(), 0.05);
      const t = state.clock.elapsedTime;

      state.dragCur += (state.dragTarget - state.dragCur) * (1 - Math.exp(-dt * 9));
      state.cur += (state.target - state.cur) * (1 - Math.exp(-dt * 7.5));
      if (Math.abs(state.target - state.cur) < 0.0005) {
        state.cur = state.target;
      }

      if (state.cases.length) {
        state.cases.forEach((m) => {
          const u = m.userData;
          // Shortest cyclic distance modulo N
          let d = (u.i - state.cur) % N;
          if (d > N / 2) d -= N;
          if (d < -N / 2) d += N;

          const a = Math.abs(d);
          const s = d >= 0 ? 1 : -1;
          const e = Math.min(a, 1);

          const x = (a > 0.002 ? s : 0) * 2.3 * Math.pow(a, 0.82);
          const z = -1.05 * Math.pow(a, 1.12);
          const sc = THREE.MathUtils.lerp(1.14, 0.94, e);

          u.spawn += dt;
          const sp = THREE.MathUtils.clamp(u.spawn / 0.55, 0, 1);
          const se = 1 - Math.pow(1 - sp, 3);
          const bob = Math.sin(t * 1.25) * 0.035 * (1 - e);

          m.position.set(x, -1.4 + 1.4 * sc + bob - (1 - se) * 2.8, z);
          m.rotation.y = THREE.MathUtils.lerp(-0.15, -s * 0.55, e) + state.dragCur * (1 - e);
          m.rotation.z = THREE.MathUtils.lerp(0.012, -s * 0.05, e);
          m.scale.setScalar(sc * (0.78 + 0.22 * se));

          // Lift min brightness dim to 0.75 so non-focused cards remain vibrant and clear
          const dim = THREE.MathUtils.lerp(1.0, 0.75, e);
          u.frontMat.color.setScalar(dim);
          u.spineMat.color.setScalar(dim * 0.9);

          m.visible = a < 5.8;
        });

        chev.visible = true;
        chev.position.y = 1.98 + Math.sin(t * 2.4) * 0.06;
      } else {
        chev.visible = false;
      }

      dust.rotation.y = t * 0.02;
      camera.position.x += (mouseX * 0.75 - camera.position.x) * 0.045;
      camera.position.y += (0.45 - mouseY * 0.4 - camera.position.y) * 0.045;
      camera.lookAt(0, 0.12, 0);

      renderer.render(scene, camera);
      state.animId = requestAnimationFrame(animate);
    }

    threeState.current.animId = requestAnimationFrame(animate);

    // Raycasting for click
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    function pick(cx: number, cy: number) {
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((cx - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((cy - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(currentCases.filter((c) => c.visible), false);
      return hits.length ? hits[0].object : null;
    }

    // Pointer Events
    let isDown = false;
    let downX = 0;
    let movedPx = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      downX = e.clientX;
      movedPx = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      if (isDown) {
        const dx = e.clientX - downX;
        movedPx = Math.max(movedPx, Math.abs(dx));
        threeState.current.dragTarget = THREE.MathUtils.clamp(dx * 0.0045, -0.55, 0.55);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      const dx = e.clientX - downX;
      threeState.current.dragTarget = 0;

      if (movedPx < 6) {
        const hit = pick(e.clientX, e.clientY);
        if (hit && hit.userData) {
          const hitIdx = hit.userData.i;
          const activeIdx = ((Math.round(threeState.current.cur) % N) + N) % N;
          if (hitIdx === activeIdx) {
            openDetail(GAMES_DATA[hitIdx]);
          } else {
            // Find shortest delta
            let delta = (hitIdx - activeIdx) % N;
            if (delta > N / 2) delta -= N;
            if (delta < -N / 2) delta += N;
            threeState.current.target += delta;
            handleIndexChange(threeState.current.target);
          }
        }
      } else if (Math.abs(dx) > 50) {
        navigate(dx < 0 ? 1 : -1);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Wheel Event
    let wheelT = 0;
    let accY = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const now = performance.now();
        if (now - wheelT > 180) {
          navigate(e.deltaX > 0 ? 1 : -1);
          wheelT = now;
        }
      } else {
        accY += e.deltaY;
        const now = performance.now();
        if (now - wheelT > 200 && Math.abs(accY) > 35) {
          navigate(accY > 0 ? 1 : -1);
          wheelT = now;
          accY = 0;
        }
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Keyboard Event
    const onKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "Escape") closeDetail();
        return;
      }
      if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "Enter") {
        const activeIdx = ((Math.round(threeState.current.target) % N) + N) % N;
        const active = GAMES_DATA[activeIdx];
        if (active) openDetail(active);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Resize Handler
    const onResize = () => {
      if (!container || !canvas) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 680;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      camera.position.z = camera.aspect < 0.75 ? 10.8 : camera.aspect < 1.25 ? 8.6 : 7.2;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Theme Observer
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      updateTheme(isDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const stateRef = threeState.current;

    // Cleanup
    return () => {
      cancelAnimationFrame(stateRef.animId);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);

      currentCases.forEach((m) => {
        const u = m.userData;
        if (u.sharp) u.sharp.dispose();
        if (u.frontMat) u.frontMat.dispose();
        if (u.spineMat) {
          if (u.spineMat.map) u.spineMat.map.dispose();
          u.spineMat.dispose();
        }
        scene.remove(m);
      });
      caseGeo.dispose();
      wallTex.dispose();
      wallMat.dispose();
      floorMat.dispose();
      shelfMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      chevTex.dispose();
      renderer.dispose();
    };
  }, [handleIndexChange, navigate, openDetail, closeDetail, isModalOpen, N]);

  const currentGame = GAMES_DATA[currentIndex] || GAMES_DATA[0];
  const currentStatus = currentGame ? STATUS_META[currentGame.status] : null;

  return (
    <section id="games" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>06</b> / 体验层 · GAMES
        </p>
        <span className="util" style={{ color: "var(--ink-3)", cursor: "default" }}>
          单机游戏档案架 · {GAMES_DATA.length} 款收录
        </span>
      </div>
      <h2 className="sec-title reveal">游戏</h2>
      <p className="sec-lede reveal">
        交互式 3D 游戏档案盒。沉淀游戏世界中的震撼、感动与思维共鸣。
      </p>

      {/* 3D Stage Container */}
      <div className="sec-body reveal">
        <div ref={containerRef} className="game-shelf-wrap">
          <canvas ref={canvasRef} className="game-shelf-canvas" />

          {/* Top HUD Branding */}
          <div className="shelf-hud-top-left">
            <b>VIRTUAL STUDIO</b>
            <span>GAME ARCHIVE · 游戏档案</span>
          </div>

          {/* Top HUD Counter (Clean index only) */}
          <div className="shelf-hud-top-right">
            <div className="shelf-counter">
              <em>{String(currentIndex + 1).padStart(2, "0")}</em> /{" "}
              <span>{String(GAMES_DATA.length).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            type="button"
            className="shelf-arrow shelf-prev"
            onClick={() => navigate(-1)}
            aria-label="上一个游戏"
          >
            <svg viewBox="0 0 24 40">
              <path d="M20 2 4 20l16 18" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>
          <button
            type="button"
            className="shelf-arrow shelf-next"
            onClick={() => navigate(1)}
            aria-label="下一个游戏"
          >
            <svg viewBox="0 0 24 40">
              <path d="M4 2l16 18L4 38" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </button>

          {/* Bottom-Left Game Info HUD */}
          {currentGame && (
            <div className="shelf-info-hud">
              <div className="shelf-meta-row">
                {currentStatus && (
                  <span
                    className="shelf-badge"
                    style={{ color: currentStatus.color, borderColor: currentStatus.color }}
                  >
                    <span>{currentStatus.label}</span>
                  </span>
                )}
                <span className="shelf-chip">
                  <span>{currentGame.hours != null ? `${currentGame.hours} h` : "时长 —"}</span>
                </span>
                <span className="shelf-chip">
                  <span>{currentGame.rating != null ? `★ ${currentGame.rating} / 10` : "未评分"}</span>
                </span>
              </div>

              <h3 className="shelf-game-title">{currentGame.title}</h3>
              <p className="shelf-game-en">{currentGame.en}</p>

              <div className="shelf-game-tags">
                {currentGame.tags.map((tag) => (
                  <span key={tag} className="shelf-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="shelf-core-review">{currentGame.coreReview}</p>

              <button
                type="button"
                className="shelf-more-btn"
                onClick={() => openDetail(currentGame)}
              >
                查看完整长评 ›
              </button>
            </div>
          )}

          {/* Interaction Bottom Hint */}
          <div className="shelf-bottom-hint">
            ◂ 拖拽 / 滚轮 / 键盘 ← → 无限循环 　 点击中央卡带盒查看长文回顾 ▸
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {isModalOpen && selectedGame && (
        <div className="shelf-modal-backdrop" onClick={closeDetail}>
          <div
            className="shelf-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="shelf-modal-close"
              onClick={closeDetail}
              aria-label="关闭"
            >
              ✕
            </button>

            <div className="shelf-modal-cover-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedGame.cover || "/covers/nier-automata.png"}
                alt={selectedGame.title}
                className="shelf-modal-cover"
              />
            </div>

            <div className="shelf-modal-content">
              <div className="shelf-meta-row">
                <span
                  className="shelf-badge"
                  style={{
                    color: STATUS_META[selectedGame.status].color,
                    borderColor: STATUS_META[selectedGame.status].color,
                  }}
                >
                  <span>{STATUS_META[selectedGame.status].label}</span>
                </span>
                <span className="shelf-chip">
                  <span>{selectedGame.hours != null ? `${selectedGame.hours} h` : "时长 —"}</span>
                </span>
                <span className="shelf-chip">
                  <span>{selectedGame.rating != null ? `★ ${selectedGame.rating} / 10` : "未评分"}</span>
                </span>
              </div>

              <h3 className="shelf-modal-title">{selectedGame.title}</h3>
              <p className="shelf-modal-en">{selectedGame.en}</p>

              <div className="shelf-game-tags">
                {selectedGame.tags.map((tag) => (
                  <span key={tag} className="shelf-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="shelf-modal-review-body">
                <p>{selectedGame.fullReview}</p>
              </div>

              <div className="shelf-modal-foot">
                <span>VIRTUAL STUDIO · GAME ARCHIVES</span>
                <span>VOL.02 · 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
