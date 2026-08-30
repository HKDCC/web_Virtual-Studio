"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GraphData, GraphNode } from "@/lib/graphEngine";

interface ObsidianThreeGraphProps {
  graphData: GraphData;
  activeWorkflowId: string | null;
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectWorkflow: (workflowId: string | null) => void;
}

interface Sim3DNode extends GraphNode {
  vx: number;
  vy: number;
  vz: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  mesh?: THREE.Mesh;
  haloMesh?: THREE.Mesh;
  labelSprite?: THREE.Sprite;
}

const OBSIDIAN_COLORS: Record<string, string> = {
  workflow: "#E06C75", // 朱砂红 (Obsidian Workflows)
  model: "#98C379",    // 翠绿 (AI Models)
  tool: "#61AFEF",     // 黛蓝 (Productivity Tools)
  prompt: "#E5C07B",   // 暖金 (Prompts & Methods)
  website: "#C678DD",  // 紫晶 (Websites)
  script: "#56B6C2",   // 青蓝 (Scripts)
  note: "#D19A66",     // 赭石 (Notes)
};

export function ObsidianThreeGraph({
  graphData,
  activeWorkflowId,
  selectedNodeId,
  onSelectNode,
  onSelectWorkflow,
}: ObsidianThreeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Hover & UI State
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("全部");
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 3D Simulation Nodes & Objects
  const simNodesRef = useRef<Sim3DNode[]>([]);
  const lineMeshMapRef = useRef<Map<string, THREE.Line>>(new Map());
  const alphaRef = useRef<number>(1);

  // Image Cache for Vector Logos
  const iconCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Focus camera when activeWorkflowId changes
  useEffect(() => {
    if (!activeWorkflowId || !controlsRef.current) return;
    const hubId = `node-${activeWorkflowId}`;
    const hubNode = simNodesRef.current.find((n) => n.id === hubId || n.id === activeWorkflowId);
    if (hubNode) {
      controlsRef.current.target.set(hubNode.x, hubNode.y, hubNode.z);
      alphaRef.current = 0.4;
    }
  }, [activeWorkflowId]);

  // Preload Vector Logos
  useEffect(() => {
    graphData.nodes.forEach((node) => {
      if (node.iconUrl && !iconCache.current.has(node.iconUrl)) {
        const img = new Image();
        img.src = node.iconUrl;
        img.onload = () => {
          iconCache.current.set(node.iconUrl!, img);
        };
      }
    });
  }, [graphData.nodes]);

  // Create High-Res Canvas Texture for 3D Node Spheres
  const createSphereTexture = useCallback((node: GraphNode, colorHex: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base background circle
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    // Draw vector logo if available
    const resolvedIcon = node.iconUrl || (node.type === "workflow" ? "/logos/antigravity.svg" : null);
    if (resolvedIcon) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.clearRect(0, 0, 256, 256);
        ctx.save();
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 256, 256);
        ctx.restore();

        // Subtle outer border
        ctx.beginPath();
        ctx.arc(128, 128, 120, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 10;
        ctx.stroke();

        texture.needsUpdate = true;
      };
      img.src = resolvedIcon;
    } else {
      // Monogram fallback
      ctx.font = `bold 64px "JetBrains Mono", sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.name.slice(0, 2).toUpperCase(), 128, 128);
    }

    return texture;
  }, []);

  // Create Crisp Text Sprite for 3D Billboard Labels
  const createLabelSprite = useCallback((text: string, isDark: boolean) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.font = `bold 22px "JetBrains Mono", -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text Shadow Outline
    ctx.strokeStyle = isDark ? "rgba(18, 15, 12, 0.95)" : "rgba(246, 242, 234, 0.95)";
    ctx.lineWidth = 5;
    ctx.strokeText(text, 256, 64);

    // Text Foreground
    ctx.fillStyle = isDark ? "#E6E1D6" : "#24201C";
    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(40, 10, 1);
    return sprite;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    // 1. Scene & Background
    const scene = new THREE.Scene();
    const bgHex = isDark ? 0x161310 : 0xf6f2ea;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.0008);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 180, 460);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 1000;
    controls.minDistance = 60;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 0.45;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(isDark ? 0xe5c07b : 0xffffff, 2, 800);
    pointLight.position.set(0, 160, 220);
    scene.add(pointLight);

    // 6. Astrolabe Background Floor Grid
    const gridHelper = new THREE.GridHelper(600, 24, isDark ? 0x332d26 : 0xd6cebd, isDark ? 0x221e1a : 0xebe4d6);
    gridHelper.position.y = -120;
    scene.add(gridHelper);

    // 7. Groups
    const nodesGroup = new THREE.Group();
    const linksGroup = new THREE.Group();
    scene.add(linksGroup);
    scene.add(nodesGroup);

    // 8. Build 3D Simulation Nodes
    const total = graphData.nodes.length;
    const simNodes: Sim3DNode[] = graphData.nodes.map((node, i) => {
      const theta = (i / total) * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      const rad = node.type === "workflow" ? 30 : 110 + (i % 3) * 45;

      const x = Math.cos(theta) * Math.cos(phi) * rad;
      const y = Math.sin(phi) * rad * 0.7;
      const z = Math.sin(theta) * Math.cos(phi) * rad;

      const colorHex = OBSIDIAN_COLORS[node.type] || OBSIDIAN_COLORS.tool;
      const sphereRadius = node.type === "workflow" ? 11 : Math.min(8.5, Math.max(4.5, 4.5 + node.workflowCount * 1.3));

      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
      const texture = createSphereTexture(node, colorHex);
      const sphereMat = new THREE.MeshStandardMaterial({
        map: texture || undefined,
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.15,
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.95,
      });

      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(x, y, z);
      mesh.userData = { nodeId: node.id, node };
      nodesGroup.add(mesh);

      // Outer Halo Sphere (Obsidian Glow)
      const haloGeo = new THREE.SphereGeometry(sphereRadius * 1.5, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        transparent: true,
        opacity: 0,
        side: THREE.BackSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(haloMesh);

      // Billboard Text Label
      const label = createLabelSprite(node.name, isDark);
      if (label) {
        label.position.set(0, -sphereRadius - 8, 0);
        mesh.add(label);
      }

      return {
        ...node,
        radius: sphereRadius,
        color: colorHex,
        x,
        y,
        z,
        vx: 0,
        vy: 0,
        vz: 0,
        mesh,
        haloMesh,
        labelSprite: label || undefined,
      };
    });
    simNodesRef.current = simNodes;

    // 9. Build 3D Links (Lines)
    const lineMap = new Map<string, THREE.Line>();
    const nodeMap = new Map(simNodes.map((n) => [n.id, n]));

    graphData.links.forEach((link) => {
      const src = nodeMap.get(link.source);
      const tgt = nodeMap.get(link.target);
      if (!src || !tgt) return;

      const points = [new THREE.Vector3(src.x, src.y, src.z), new THREE.Vector3(tgt.x, tgt.y, tgt.z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: isDark ? 0xffffff : 0x000000,
        transparent: true,
        opacity: isDark ? 0.18 : 0.14,
        linewidth: 1,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      line.userData = { linkId: link.id, sourceId: link.source, targetId: link.target };
      linksGroup.add(line);
      lineMap.set(link.id, line);
    });
    lineMeshMapRef.current = lineMap;

    // 10. Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodesGroup.children, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const hitNode = hitMesh.userData?.node as GraphNode | undefined;
        if (hitNode) {
          container.style.cursor = "pointer";
          setHoveredNode(hitNode);
          return;
        }
      }
      container.style.cursor = "grab";
      setHoveredNode(null);
    };

    const handlePointerClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodesGroup.children, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const hitNode = hitMesh.userData?.node as GraphNode | undefined;
        if (hitNode) {
          if (hitNode.type === "workflow") {
            const wfId = hitNode.id.replace(/^node-/, "");
            onSelectWorkflow(wfId);
          }
          // Smooth camera focus
          controls.target.set(hitNode.x, hitNode.y, hitNode.z);
          onSelectNode(hitNode);
          return;
        }
      }
      onSelectNode(null);
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("click", handlePointerClick);

    // 11. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("click", handlePointerClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [graphData, createSphereTexture, createLabelSprite, isAutoRotating, onSelectNode, onSelectWorkflow]);

  // 3D Force Simulation Loop + Obsidian Highlight Dimming
  useEffect(() => {
    const loop = () => {
      const nodes = simNodesRef.current;
      const links = graphData.links;
      const alpha = alphaRef.current;

      // ─── 3D Physics Step ───
      if (alpha > 0.005) {
        // 1. 3D Repulsion between all node pairs
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dz = n2.z - n1.z;
            const distSq = dx * dx + dy * dy + dz * dz || 1;
            const dist = Math.sqrt(distSq);

            const force = (-2200 / distSq) * alpha;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            const fz = (dz / dist) * force;

            if (n1.fx == null) {
              n1.vx += fx;
              n1.vy += fy;
              n1.vz += fz;
            }
            if (n2.fx == null) {
              n2.vx -= fx;
              n2.vy -= fy;
              n2.vz -= fz;
            }
          }
        }

        // 2. 3D Spring Attraction on Links
        const nodeMap = new Map(nodes.map((n) => [n.id, n]));
        for (const link of links) {
          const src = nodeMap.get(link.source);
          const tgt = nodeMap.get(link.target);
          if (!src || !tgt) continue;

          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dz = tgt.z - src.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
          const idealDist = 85;
          const spring = (dist - idealDist) * 0.04 * alpha;

          const fx = (dx / dist) * spring;
          const fy = (dy / dist) * spring;
          const fz = (dz / dist) * spring;

          if (src.fx == null) {
            src.vx += fx;
            src.vy += fy;
            src.vz += fz;
          }
          if (tgt.fx == null) {
            tgt.vx -= fx;
            tgt.vy -= fy;
            tgt.vz -= fz;
          }
        }

        // 3. 3D Center Gravity & Damping
        const damping = 0.88;
        for (const node of nodes) {
          if (node.fx == null) {
            node.vx += -node.x * 0.007 * alpha;
            node.vy += -node.y * 0.007 * alpha;
            node.vz += -node.z * 0.007 * alpha;

            node.vx *= damping;
            node.vy *= damping;
            node.vz *= damping;

            node.x += node.vx;
            node.y += node.vy;
            node.z += node.vz;
          }

          // Update Three.js Mesh Position
          if (node.mesh) {
            node.mesh.position.set(node.x, node.y, node.z);
          }
        }

        // Update 3D Line Geometries
        const lineMap = lineMeshMapRef.current;
        for (const link of links) {
          const src = nodeMap.get(link.source);
          const tgt = nodeMap.get(link.target);
          const line = lineMap.get(link.id);
          if (src && tgt && line) {
            const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
            if (posAttr) {
              posAttr.setXYZ(0, src.x, src.y, src.z);
              posAttr.setXYZ(1, tgt.x, tgt.y, tgt.z);
              posAttr.needsUpdate = true;
            }
          }
        }

        alphaRef.current = Math.max(0.001, alpha * 0.994);
      }

      // ─── Obsidian Subgraph Dimming / Highlighting in 3D ───
      const activeFocusId = hoveredNode?.id || selectedNodeId;
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";

      const connectedNodeIds = new Set<string>();
      const connectedLinkIds = new Set<string>();

      if (activeFocusId) {
        connectedNodeIds.add(activeFocusId);
        links.forEach((l) => {
          if (l.source === activeFocusId || l.target === activeFocusId) {
            connectedNodeIds.add(l.source);
            connectedNodeIds.add(l.target);
            connectedLinkIds.add(l.id);
          }
        });
      }

      // Update Node Visuals
      nodes.forEach((node) => {
        if (!node.mesh) return;
        const mat = node.mesh.material as THREE.MeshStandardMaterial;
        const isFocused = node.id === activeFocusId;
        const isNeighbor = connectedNodeIds.has(node.id);
        const isDimmed = activeFocusId && !isNeighbor;
        const isCategoryMatch =
          activeFilterCategory === "全部" ||
          node.category.includes(activeFilterCategory) ||
          node.type === activeFilterCategory;

        if (isDimmed || !isCategoryMatch) {
          mat.opacity = 0.12;
          mat.emissiveIntensity = 0.05;
          if (node.haloMesh) (node.haloMesh.material as THREE.MeshBasicMaterial).opacity = 0;
          if (node.labelSprite) (node.labelSprite.material as THREE.SpriteMaterial).opacity = 0.1;
        } else if (isFocused) {
          mat.opacity = 1.0;
          mat.emissiveIntensity = 0.6;
          if (node.haloMesh) (node.haloMesh.material as THREE.MeshBasicMaterial).opacity = 0.35;
          if (node.labelSprite) (node.labelSprite.material as THREE.SpriteMaterial).opacity = 1.0;
        } else {
          mat.opacity = 0.95;
          mat.emissiveIntensity = 0.2;
          if (node.haloMesh) (node.haloMesh.material as THREE.MeshBasicMaterial).opacity = 0;
          if (node.labelSprite) (node.labelSprite.material as THREE.SpriteMaterial).opacity = 0.85;
        }
      });

      // Update Line Visuals
      const lineMap = lineMeshMapRef.current;
      links.forEach((link) => {
        const line = lineMap.get(link.id);
        if (!line) return;
        const mat = line.material as THREE.LineBasicMaterial;
        const isConnected = connectedLinkIds.has(link.id);
        const isDimmed = activeFocusId && !isConnected;

        if (isConnected) {
          mat.color.setHex(isDark ? 0xe06c75 : 0xc2431b);
          mat.opacity = 0.9;
        } else if (isDimmed) {
          mat.color.setHex(isDark ? 0xffffff : 0x000000);
          mat.opacity = 0.03;
        } else {
          mat.color.setHex(isDark ? 0xffffff : 0x000000);
          mat.opacity = isDark ? 0.18 : 0.14;
        }
      });

      // Render Three.js Scene
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [graphData, hoveredNode, selectedNodeId, activeFilterCategory]);

  // Viewport Controls
  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.25);
    }
  };

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 180, 460);
      controlsRef.current.target.set(0, 0, 0);
      alphaRef.current = 0.6;
    }
  };

  return (
    <section
      ref={containerRef}
      style={{
        width: "100%",
        height: "560px",
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 40px rgba(0, 0, 0, 0.02)",
      }}
    >
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Top Left Header Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
          background: "var(--card)",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid var(--line)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
        <span style={{ fontSize: "11.5px", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)" }}>
          关系图谱 · Obsidian 3D Graph
        </span>
        <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
          {graphData.nodes.length} 节点 · {graphData.links.length} 双链
        </span>
      </div>

      {/* Top Right Obsidian Viewport Controls */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          gap: "6px",
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="放大"
          aria-label="放大"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        <button
          onClick={handleZoomOut}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="缩小"
          aria-label="缩小"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        <button
          onClick={handleResetView}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--card)",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="重置全景"
          aria-label="重置全景"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <button
          onClick={() => {
            setIsAutoRotating(!isAutoRotating);
            if (controlsRef.current) {
              controlsRef.current.autoRotate = !isAutoRotating;
            }
          }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: isAutoRotating ? "var(--accent-soft)" : "var(--card)",
            color: isAutoRotating ? "var(--accent)" : "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title={isAutoRotating ? "暂停 3D 旋转" : "恢复 3D 旋转"}
          aria-label="3D 旋转控制"
        >
          {isAutoRotating ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      {/* Floating Hover Info Card (Obsidian HUD) */}
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: "var(--card)",
            border: `1.5px solid ${hoveredNode.color}`,
            borderRadius: "10px",
            padding: "12px 16px",
            maxWidth: "280px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            pointerEvents: "none",
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: hoveredNode.color }} />
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", textTransform: "uppercase", color: hoveredNode.color, fontWeight: 700 }}>
              {hoveredNode.type}
            </span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
            {hoveredNode.name}
          </div>
          <p style={{ fontSize: "11px", color: "var(--ink-2)", margin: "0 0 8px", lineHeight: 1.4 }}>
            {hoveredNode.description}
          </p>
          <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)", borderTop: "1px solid var(--line)", paddingTop: "6px" }}>
            关联工作流: {hoveredNode.workflowCount} 个
          </div>
        </div>
      )}

      {/* Bottom Left Obsidian Legend & Filter Pills */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        {[
          { key: "全部", label: "全部", color: "var(--ink-2)" },
          { key: "workflow", label: "工作流", color: OBSIDIAN_COLORS.workflow },
          { key: "model", label: "AI模型", color: OBSIDIAN_COLORS.model },
          { key: "tool", label: "工具", color: OBSIDIAN_COLORS.tool },
          { key: "prompt", label: "提示词", color: OBSIDIAN_COLORS.prompt },
          { key: "website", label: "网站", color: OBSIDIAN_COLORS.website },
        ].map((item) => {
          const isSelected = activeFilterCategory === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveFilterCategory(item.key)}
              style={{
                fontSize: "10.5px",
                fontFamily: "var(--mono)",
                padding: "3px 8px",
                borderRadius: "14px",
                border: `1px solid ${isSelected ? item.color : "var(--line)"}`,
                background: isSelected ? "var(--card)" : "rgba(255, 255, 255, 0.4)",
                color: isSelected ? item.color : "var(--ink-3)",
                cursor: "pointer",
                fontWeight: isSelected ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color }} />
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
