"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GraphData, GraphNode } from "@/lib/graphEngine";
import { useTheme } from "@/components/ThemeProvider";

interface ThreeWorkflowGalaxyProps {
  graphData: GraphData;
  activeWorkflowId: string | null;
  selectedNodeId?: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectWorkflow: (workflowId: string | null) => void;
}

export function ThreeWorkflowGalaxy({
  graphData,
  activeWorkflowId,
  onSelectNode,
  onSelectWorkflow,
}: ThreeWorkflowGalaxyProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const linksGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const nodeMeshMapRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Camera Target Animation Ref
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  // Create text sprite with crisp resolution
  const createTextSprite = useCallback((text: string, isLight: boolean, isHub: boolean, count: number) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = 512;
    canvas.height = 128;

    ctx.font = `${isHub ? "bold 32px" : "24px"} "JetBrains Mono", "PingFang SC", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Text color
    ctx.fillStyle = isLight ? (isHub ? "#1D1710" : "#4A4036") : (isHub ? "#ECE5D7" : "#A79C89");
    ctx.fillText(text, 256, 64);

    if (count > 1 && !isHub) {
      ctx.font = "20px 'JetBrains Mono', sans-serif";
      ctx.fillStyle = isLight ? "#C2431B" : "#E9683A";
      ctx.fillText(`🔥 ${count}`, 256, 100);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(60, 15, 1);
    return sprite;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const isLight = theme === "light";

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    const bgHex = isLight ? 0xf6f2ea : 0x161310;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.0009);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 260, 520);
    cameraRef.current = camera;

    // 3. Renderer
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
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1200;
    controls.minDistance = 80;
    controls.autoRotate = !activeWorkflowId;
    controls.autoRotateSpeed = 0.4;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 1.2 : 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(isLight ? 0xfff5ea : 0xd4a373, 2, 800);
    pointLight.position.set(0, 150, 200);
    scene.add(pointLight);

    // 6. Astrolabe Coordinate Background Grid Rings
    const gridRingsGroup = new THREE.Group();
    const ringRadii = [180, 320, 480];
    const ringMat = new THREE.LineBasicMaterial({
      color: isLight ? 0xe3dbcb : 0x2e2921,
      transparent: true,
      opacity: isLight ? 0.6 : 0.4,
    });

    ringRadii.forEach((r) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 96;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      ringGeo.setFromPoints(points);
      const ringLine = new THREE.Line(ringGeo, ringMat);
      gridRingsGroup.add(ringLine);
    });
    scene.add(gridRingsGroup);

    // 7. Node & Link Groups
    const nodesGroup = new THREE.Group();
    const linksGroup = new THREE.Group();
    const particlesGroup = new THREE.Group();
    scene.add(linksGroup);
    scene.add(nodesGroup);
    scene.add(particlesGroup);
    nodesGroupRef.current = nodesGroup;
    linksGroupRef.current = linksGroup;
    particlesGroupRef.current = particlesGroup;

    // Map for fast raycast lookups
    const meshMap = new Map<string, THREE.Mesh>();

    // 8. Build 3D Nodes
    graphData.nodes.forEach((node) => {
      const isHub = node.type === "workflow";
      const sphereGeo = new THREE.SphereGeometry(node.radius, 32, 32);
      
      const nodeColor = new THREE.Color(node.color);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        roughness: isHub ? 0.3 : 0.45,
        metalness: isHub ? 0.4 : 0.1,
        emissive: nodeColor,
        emissiveIntensity: isLight ? 0.2 : 0.35,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(node.x, node.y, node.z);
      sphereMesh.userData = { node };

      // Add Astrolabe Orbit Ring for Hubs and high-frequency tools
      if (isHub || node.workflowCount >= 2) {
        const ringGeo = new THREE.RingGeometry(node.radius * 1.35, node.radius * 1.45, 32);
        const ringMatInner = new THREE.MeshBasicMaterial({
          color: nodeColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMatInner);
        ringMesh.rotation.x = Math.PI / 2.5;
        sphereMesh.add(ringMesh);
      }

      // Add Billboard Text Label
      const label = createTextSprite(node.name, isLight, isHub, node.workflowCount);
      if (label) {
        label.position.set(0, node.radius + 12, 0);
        sphereMesh.add(label);
      }

      nodesGroup.add(sphereMesh);
      meshMap.set(node.id, sphereMesh);
    });
    nodeMeshMapRef.current = meshMap;

    // 9. Build 3D Links
    graphData.links.forEach((link) => {
      const srcMesh = meshMap.get(link.source);
      const tgtMesh = meshMap.get(link.target);
      if (!srcMesh || !tgtMesh) return;

      const p1 = srcMesh.position;
      const p2 = tgtMesh.position;

      // Curve line with slight arc
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += p1.distanceTo(p2) * 0.12;

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: isLight ? 0xd0c8b6 : 0x3d372e,
        transparent: true,
        opacity: isLight ? 0.5 : 0.35,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      line.userData = { link, curve };
      linksGroup.add(line);
    });

    // 10. Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera slerp transition if targeted
      if (targetCamPos.current && targetLookAt.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.05);
        controlsRef.current.target.lerp(targetLookAt.current, 0.05);
        if (cameraRef.current.position.distanceTo(targetCamPos.current) < 2) {
          targetCamPos.current = null;
          targetLookAt.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    // 11. Raycasting for Interaction
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
        const node = hitMesh.userData?.node as GraphNode | undefined;
        if (node) {
          container.style.cursor = "pointer";
          setHoveredNode(node);
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
        const node = hitMesh.userData?.node as GraphNode | undefined;
        if (node) {
          if (node.type === "workflow") {
            const wfId = node.id.replace(/^node-/, "");
            onSelectWorkflow(wfId);
          }
          onSelectNode(node);
        }
      }
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("click", handlePointerClick);

    // 12. Resize Listener
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
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("click", handlePointerClick);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [graphData, theme, activeWorkflowId, createTextSprite, onSelectNode, onSelectWorkflow]);

  // Handle Workflow Highlighting & Camera Fly-to when activeWorkflowId changes
  useEffect(() => {
    const meshMap = nodeMeshMapRef.current;
    const linksGroup = linksGroupRef.current;
    const isLight = theme === "light";

    if (!meshMap || !linksGroup) return;

    if (!activeWorkflowId) {
      // Reset all nodes & links to normal opacity
      meshMap.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 1;
        mat.transparent = false;
        mesh.scale.set(1, 1, 1);
      });
      linksGroup.children.forEach((child) => {
        const line = child as THREE.Line;
        const mat = line.material as THREE.LineBasicMaterial;
        mat.color.setHex(isLight ? 0xd0c8b6 : 0x3d372e);
        mat.opacity = isLight ? 0.5 : 0.35;
      });
      if (controlsRef.current) controlsRef.current.autoRotate = true;
      return;
    }

    if (controlsRef.current) controlsRef.current.autoRotate = false;

    // Find the workflow preset
    const activeWf = graphData.workflows.find((w) => w.id === activeWorkflowId);
    if (!activeWf) return;

    const hubNodeId = `node-${activeWf.id}`;
    const hubMesh = meshMap.get(hubNodeId);

    // Camera fly-to target
    if (hubMesh && cameraRef.current) {
      const hubPos = hubMesh.position;
      targetLookAt.current = hubPos.clone();
      targetCamPos.current = new THREE.Vector3(
        hubPos.x * 1.6 + 60,
        hubPos.y + 120,
        hubPos.z * 1.6 + 220
      );
    }

    const activeNodeNames = new Set(activeWf.keyEntities.map((k) => k.toLowerCase().trim()));

    // Dim unrelated nodes
    meshMap.forEach((mesh, id) => {
      const node = mesh.userData?.node as GraphNode;
      const isMatch = id === hubNodeId || (node && activeNodeNames.has(node.name.toLowerCase().trim()));
      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (isMatch) {
        mat.opacity = 1;
        mat.transparent = false;
        mesh.scale.set(1.2, 1.2, 1.2);
      } else {
        mat.opacity = 0.18;
        mat.transparent = true;
        mesh.scale.set(0.85, 0.85, 0.85);
      }
    });

    // Highlight links belonging to this workflow
    linksGroup.children.forEach((child) => {
      const line = child as THREE.Line;
      const link = line.userData?.link;
      const mat = line.material as THREE.LineBasicMaterial;
      if (link && link.workflowId === activeWorkflowId) {
        mat.color.setHex(isLight ? 0xc2431b : 0xe9683a); // Highlight Cinnabar
        mat.opacity = 0.95;
      } else {
        mat.color.setHex(isLight ? 0xe3dbcb : 0x221e19);
        mat.opacity = 0.08;
      }
    });
  }, [activeWorkflowId, graphData, theme]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      targetCamPos.current = new THREE.Vector3(0, 260, 520);
      targetLookAt.current = new THREE.Vector3(0, 0, 0);
      onSelectWorkflow(null);
      onSelectNode(null);
    }
  };

  const handleZoom = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(delta);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: isFullScreen ? "88vh" : "52vh",
        minHeight: "440px",
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "var(--paper)",
        transition: "height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Top Left Astrolabe HUD Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "20px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          padding: "8px 14px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: "14px" }}>🌌</span>
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--mono)", color: "var(--ink)" }}>
            ASTROLABE · 纸墨星象仪
          </div>
          <div style={{ fontSize: "9.5px", color: "var(--ink-2)" }}>
            {graphData.nodes.length} 实体星宿 · {graphData.links.length} 拓扑引力线
          </div>
        </div>
      </div>

      {/* Hovered Node Tooltip Overlay */}
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "var(--card)",
            border: "1.5px solid var(--accent)",
            padding: "10px 16px",
            borderRadius: "10px",
            maxWidth: "320px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--ink)" }}>{hoveredNode.name}</span>
            <span
              style={{
                fontSize: "9px",
                fontFamily: "var(--mono)",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "var(--accent-soft)",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              {hoveredNode.type.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--ink-2)", lineHeight: 1.4, margin: "0 0 6px" }}>
            {hoveredNode.description}
          </p>
          {hoveredNode.workflowCount > 0 && (
            <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 600 }}>
              🔥 参与 {hoveredNode.workflowCount} 个工作流 (点击查看双链)
            </div>
          )}
        </div>
      )}

      {/* Bottom Right 3D Controls Floating Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          display: "flex",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => handleZoom(0.88)}
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="放大"
        >
          ＋ 放大
        </button>
        <button
          onClick={() => handleZoom(1.14)}
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="缩小"
        >
          － 缩小
        </button>
        <button
          onClick={handleResetCamera}
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="视角重置"
        >
          ↺ 重置
        </button>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          style={{
            background: isFullScreen ? "var(--accent)" : "var(--card)",
            border: `1px solid ${isFullScreen ? "var(--accent)" : "var(--line)"}`,
            color: isFullScreen ? "#ffffff" : "var(--ink)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          title="沉浸视口"
        >
          {isFullScreen ? "折叠" : "全景"}
        </button>
      </div>
    </div>
  );
}
