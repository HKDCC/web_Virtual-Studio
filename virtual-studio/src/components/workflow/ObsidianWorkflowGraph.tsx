"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { GraphData, GraphNode, GraphLink } from "@/lib/graphEngine";

interface ObsidianWorkflowGraphProps {
  graphData: GraphData;
  activeWorkflowId: string | null;
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectWorkflow: (workflowId: string | null) => void;
}

interface SimNode extends GraphNode {
  vx: number;
  vy: number;
  fx?: number | null; // pinned position
  fy?: number | null;
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

export function ObsidianWorkflowGraph({
  graphData,
  activeWorkflowId,
  selectedNodeId,
  onSelectNode,
  onSelectWorkflow,
}: ObsidianWorkflowGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport Transform (Pan & Zoom)
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  transformRef.current = transform;

  // Hover & Active States
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>("全部");
  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);

  // Dragging State
  const isDraggingCanvas = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const draggedNode = useRef<SimNode | null>(null);

  // Loaded Image Cache for Node Logos
  const iconCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Initialize Simulation Nodes & Links
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const alphaRef = useRef<number>(1);

  // Preload Logos
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

  // Build simulation nodes with radial seed positions
  useEffect(() => {
    const total = graphData.nodes.length;
    const initialNodes: SimNode[] = graphData.nodes.map((node, i) => {
      const angle = (i / total) * Math.PI * 2;
      const dist = node.type === "workflow" ? 40 : 120 + (i % 3) * 60;
      return {
        ...node,
        x: Math.cos(angle) * dist + (Math.random() - 0.5) * 20,
        y: Math.sin(angle) * dist + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        color: OBSIDIAN_COLORS[node.type] || OBSIDIAN_COLORS.tool,
      };
    });

    nodesRef.current = initialNodes;
    linksRef.current = graphData.links;
    alphaRef.current = 1;
  }, [graphData]);

  // Set active workflow focus
  useEffect(() => {
    if (activeWorkflowId) {
      const hubId = `node-${activeWorkflowId}`;
      const hubNode = nodesRef.current.find((n) => n.id === hubId || n.id === activeWorkflowId);
      if (hubNode) {
        setTransform((prev) => ({
          ...prev,
          x: -hubNode.x * prev.k,
          y: -hubNode.y * prev.k,
        }));
      }
    }
  }, [activeWorkflowId]);

  // Physics Simulation Step (2D Force Engine)
  const stepPhysics = useCallback(() => {
    if (!isPhysicsRunning && alphaRef.current < 0.005) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;
    const alpha = alphaRef.current;

    // 1. Repulsion between all node pairs
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy || 1;
        const dist = Math.sqrt(distSq);

        const minDist = (n1.radius + n2.radius) * 2.5 + 30;
        const force = (-1800 / distSq) * alpha;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1.fx == null) {
          n1.vx += fx;
          n1.vy += fy;
        }
        if (n2.fx == null) {
          n2.vx -= fx;
          n2.vy -= fy;
        }

        // Hard collision resolution
        if (dist < minDist) {
          const overlap = (minDist - dist) * 0.4 * alpha;
          const cx = (dx / dist) * overlap;
          const cy = (dy / dist) * overlap;
          if (n1.fx == null) {
            n1.vx -= cx;
            n1.vy -= cy;
          }
          if (n2.fx == null) {
            n2.vx += cx;
            n2.vy += cy;
          }
        }
      }
    }

    // 2. Link Spring Attraction
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const link of links) {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const idealDist = 90;
      const springForce = (dist - idealDist) * 0.045 * alpha;

      const fx = (dx / dist) * springForce;
      const fy = (dy / dist) * springForce;

      if (source.fx == null) {
        source.vx += fx;
        source.vy += fy;
      }
      if (target.fx == null) {
        target.vx -= fx;
        target.vy -= fy;
      }
    }

    // 3. Center Gravity & Velocity Damping
    const damping = 0.86;
    for (const node of nodes) {
      if (node.fx == null || node.fy == null) {
        // Gravity towards origin
        node.vx += -node.x * 0.008 * alpha;
        node.vy += -node.y * 0.008 * alpha;

        node.vx *= damping;
        node.vy *= damping;

        node.x += node.vx;
        node.y += node.vy;
      } else {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
      }
    }

    // Decay alpha smoothly
    alphaRef.current = Math.max(0.001, alpha * 0.992);
  }, [isPhysicsRunning]);

  // Main Canvas Render Loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const dpr = window.devicePixelRatio || 1;
    const { x, y, k } = transformRef.current;

    // Detect dark/light theme from DOM
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply viewport transform (Centered)
    ctx.translate(width / 2 + x * dpr, height / 2 + y * dpr);
    ctx.scale(k * dpr, k * dpr);

    const nodes = nodesRef.current;
    const links = linksRef.current;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Determine highlight subgraph based on hovered or selected node
    const activeFocusId = hoveredNodeId || selectedNodeId;
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

    // ─── 1. Render Obsidian Edges (Links) ───
    for (const link of links) {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      if (!source || !target) continue;

      const isConnected = connectedLinkIds.has(link.id);
      const isDimmed = activeFocusId && !isConnected;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (isConnected) {
        ctx.strokeStyle = isDark ? "rgba(224, 108, 117, 0.9)" : "rgba(194, 67, 27, 0.85)";
        ctx.lineWidth = 2 / k;
      } else if (isDimmed) {
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";
        ctx.lineWidth = 0.8 / k;
      } else {
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.14)";
        ctx.lineWidth = 1.1 / k;
      }

      ctx.stroke();
    }

    // ─── 2. Render Obsidian Nodes ───
    for (const node of nodes) {
      const isFocused = node.id === activeFocusId;
      const isNeighbor = connectedNodeIds.has(node.id);
      const isDimmed = activeFocusId && !isNeighbor;
      const isCategoryMatch = activeFilterCategory === "全部" || node.category.includes(activeFilterCategory) || node.type === activeFilterCategory;

      const baseRadius = node.type === "workflow" ? 14 : Math.min(11, Math.max(5, 5 + node.workflowCount * 1.5));
      const radius = isFocused ? baseRadius * 1.3 : baseRadius;

      // Outer Halo for Hovered / Focused Node (Obsidian Glow)
      if (isFocused || isNeighbor) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}33`; // 20% alpha
        ctx.fill();
      }

      // Main Node Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

      if (isDimmed || !isCategoryMatch) {
        ctx.fillStyle = isDark ? "rgba(80, 80, 80, 0.3)" : "rgba(200, 200, 200, 0.4)";
      } else {
        ctx.fillStyle = node.color;
      }
      ctx.fill();

      // Node Border Ring
      ctx.strokeStyle = isDark ? "rgba(22, 19, 16, 0.9)" : "rgba(246, 242, 234, 0.95)";
      ctx.lineWidth = 1.8 / k;
      ctx.stroke();

      // Draw Icon or Logo inside node if radius is large enough
      if (node.iconUrl && iconCache.current.has(node.iconUrl) && radius >= 7 && !isDimmed) {
        const img = iconCache.current.get(node.iconUrl);
        if (img) {
          const iconSize = radius * 1.2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 0.85, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, node.x - iconSize / 2, node.y - iconSize / 2, iconSize, iconSize);
          ctx.restore();
        }
      }

      // ─── 3. Render Node Typography Labels ───
      const shouldShowLabel = isFocused || isNeighbor || node.type === "workflow" || node.workflowCount >= 2 || k > 1.1;

      if (shouldShowLabel && isCategoryMatch) {
        ctx.font = `${isFocused || node.type === "workflow" ? "bold 11.5px" : "10px"} "JetBrains Mono", -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const labelY = node.y + radius + 4;
        const text = node.name;

        // Label Background Contrast Shadow
        ctx.strokeStyle = isDark ? "rgba(22, 19, 16, 0.95)" : "rgba(246, 242, 234, 0.95)";
        ctx.lineWidth = 3 / k;
        ctx.strokeText(text, node.x, labelY);

        // Label Foreground
        if (isDimmed) {
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
        } else if (isFocused) {
          ctx.fillStyle = node.color;
        } else {
          ctx.fillStyle = isDark ? "#DCD7BA" : "#2D2823";
        }
        ctx.fillText(text, node.x, labelY);
      }
    }

    ctx.restore();
  }, [hoveredNodeId, selectedNodeId, activeFilterCategory]);

  // Animation Loop
  useEffect(() => {
    const loop = () => {
      stepPhysics();
      renderCanvas();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stepPhysics, renderCanvas]);

  // Handle Canvas Resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      renderCanvas();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [renderCanvas]);

  // Mouse Coordinate Helper to Graph Space
  const screenToGraph = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const { x, y, k } = transformRef.current;
    return {
      x: (mouseX - width / 2 - x) / k,
      y: (mouseY - height / 2 - y) / k,
    };
  }, []);

  // Pointer Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x: gx, y: gy } = screenToGraph(e.clientX, e.clientY);
    const nodes = nodesRef.current;

    // Find clicked node
    let hit: SimNode | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = node.x - gx;
      const dy = node.y - gy;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        hit = node;
        break;
      }
    }

    if (hit) {
      draggedNode.current = hit;
      hit.fx = hit.x;
      hit.fy = hit.y;
      alphaRef.current = 0.3; // Re-heat physics
    } else {
      isDraggingCanvas.current = true;
      dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode.current) {
      const { x: gx, y: gy } = screenToGraph(e.clientX, e.clientY);
      draggedNode.current.fx = gx;
      draggedNode.current.fy = gy;
      alphaRef.current = 0.2;
      return;
    }

    if (isDraggingCanvas.current) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      }));
      return;
    }

    // Hover Detection
    const { x: gx, y: gy } = screenToGraph(e.clientX, e.clientY);
    const nodes = nodesRef.current;
    let hitId: string | null = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = node.x - gx;
      const dy = node.y - gy;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        hitId = node.id;
        break;
      }
    }
    setHoveredNodeId(hitId);
  };

  const handleMouseUp = () => {
    if (draggedNode.current) {
      draggedNode.current.fx = null;
      draggedNode.current.fy = null;
      draggedNode.current = null;
    }
    isDraggingCanvas.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setTransform((prev) => ({
      ...prev,
      k: Math.max(0.4, Math.min(3.0, prev.k * zoomFactor)),
    }));
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    const { x: gx, y: gy } = screenToGraph(e.clientX, e.clientY);
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = node.x - gx;
      const dy = node.y - gy;
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        if (node.type === "workflow") {
          const wfId = node.id.replace(/^node-/, "");
          onSelectWorkflow(wfId);
        }
        onSelectNode(node);
        return;
      }
    }
    onSelectNode(null);
  };

  // Zoom Controls
  const handleZoomIn = () => setTransform((prev) => ({ ...prev, k: Math.min(3.0, prev.k * 1.25) }));
  const handleZoomOut = () => setTransform((prev) => ({ ...prev, k: Math.max(0.4, prev.k * 0.8) }));
  const handleResetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
    alphaRef.current = 0.5;
  };

  const hoveredNode = useMemo(() => {
    return nodesRef.current.find((n) => n.id === hoveredNodeId);
  }, [hoveredNodeId]);

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
      {/* HTML5 Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleNodeClick}
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: draggedNode.current ? "grabbing" : hoveredNodeId ? "pointer" : isDraggingCanvas.current ? "grabbing" : "grab",
        }}
      />

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
          关系图谱 · Obsidian Graph View
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
            setIsPhysicsRunning(!isPhysicsRunning);
            if (!isPhysicsRunning) alphaRef.current = 0.4;
          }}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: isPhysicsRunning ? "var(--accent-soft)" : "var(--card)",
            color: isPhysicsRunning ? "var(--accent)" : "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title={isPhysicsRunning ? "暂停力导向物理仿真" : "恢复物理仿真"}
          aria-label="力导向物理控制"
        >
          {isPhysicsRunning ? (
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
