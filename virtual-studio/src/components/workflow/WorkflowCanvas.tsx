"use client";

import { useState, useRef, useMemo, PointerEvent, WheelEvent } from "react";
import type { WorkflowItem } from "./WorkflowTabs";

export interface NodeDefinition {
  id: string;
  type: "input" | "tool" | "model" | "prompt" | "output";
  categoryLabel: string;
  title: string;
  description: string;
  x: number;
  y: number;
  ports: {
    inputs: string[];
    outputs: string[];
  };
  cardKeywords: string[];
}

export interface LinkDefinition {
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
  id: string;
}

export interface PresetDefinition {
  id: string;
  name: string;
  emoji: string;
  nodes: NodeDefinition[];
  links: LinkDefinition[];
}

export const PRESETS: PresetDefinition[] = [
  {
    id: "preset-academic",
    name: "学术翻译",
    emoji: "",
    nodes: [
      {
        id: "node1",
        type: "input",
        categoryLabel: "输入数据",
        title: "arXiv 订阅源",
        description: "定时推送获取最新的 AI 领域科研论文的 PDF 链接列表。",
        x: 60,
        y: 110,
        ports: { inputs: [], outputs: ["out"] },
        cardKeywords: ["arxiv", "订阅", "论文"]
      },
      {
        id: "node2",
        type: "tool",
        categoryLabel: "外部工具",
        title: "Firecrawl 抓取",
        description: "将输入的 PDF 二进制流解析并爬取过滤为 Markdown 格式纯文本。",
        x: 290,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["firecrawl", "抓取"]
      },
      {
        id: "node3",
        type: "model",
        categoryLabel: "AI 模型",
        title: "Gemini 1.5 Pro",
        description: "利用 2M 超长上下文，一口气精读全文并提炼出核心大纲。",
        x: 520,
        y: 90,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["gemini", "1.5"]
      },
      {
        id: "node4",
        type: "prompt",
        categoryLabel: "提示词",
        title: "学术翻译模板",
        description: "提示词规定学术规范，按信达雅标准对提取出的论文大纲进行润色。",
        x: 750,
        y: 40,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["翻译", "prompt", "提示词"]
      },
      {
        id: "node5",
        type: "model",
        categoryLabel: "AI 模型",
        title: "Claude 3.7 Sonnet",
        description: "对翻译后的大纲进行逻辑重组与学术相关性打分筛选。",
        x: 750,
        y: 180,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["claude", "3.7", "sonnet"]
      },
      {
        id: "node6",
        type: "output",
        categoryLabel: "输出终点",
        title: "Notion 知识库",
        description: "将最终渲染的论文综述表格自动发布写入团队的知识库中。",
        x: 980,
        y: 120,
        ports: { inputs: ["in1", "in2"], outputs: [] },
        cardKeywords: ["notion"]
      }
    ],
    links: [
      { fromNode: "node1", fromPort: "node1-out", toNode: "node2", toPort: "node2-in", id: "edge-n1-n2" },
      { fromNode: "node2", fromPort: "node2-out", toNode: "node3", toPort: "node3-in", id: "edge-n2-n3" },
      { fromNode: "node3", fromPort: "node3-out", toNode: "node4", toPort: "node4-in", id: "edge-n3-n4" },
      { fromNode: "node3", fromPort: "node3-out", toNode: "node5", toPort: "node5-in", id: "edge-n3-n5" },
      { fromNode: "node4", fromPort: "node4-out", toNode: "node6", toPort: "node6-in1", id: "edge-n4-n6" },
      { fromNode: "node5", fromPort: "node5-out", toNode: "node6", toPort: "node6-in2", id: "edge-n5-n6" }
    ]
  },
  {
    id: "preset-image",
    name: "智能生图",
    emoji: "",
    nodes: [
      {
        id: "node1",
        type: "input",
        categoryLabel: "输入数据",
        title: "灵感提示词输入",
        description: "用户输入的创意文本，如 'Cyberpunk drafting room' 场景脑暴。",
        x: 60,
        y: 110,
        ports: { inputs: [], outputs: ["out"] },
        cardKeywords: ["提示词", "输入", "草稿"]
      },
      {
        id: "node2",
        type: "model",
        categoryLabel: "AI 模型",
        title: "DeepSeek-R1",
        description: "生成适用于 Midjourney / ComfyUI 的极高表现力画质提示词细节。",
        x: 290,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["deepseek", "r1"]
      },
      {
        id: "node3",
        type: "prompt",
        categoryLabel: "提示词",
        title: "Midjourney 提示词模板",
        description: "配置生图引擎所需要的艺术风格、比例、光影控制尾缀参数。",
        x: 520,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["midjourney", "提示词"]
      },
      {
        id: "node4",
        type: "tool",
        categoryLabel: "外部工具",
        title: "Firecrawl 抓取",
        description: "调用 Firecrawl 爬取指定风格网站的参考图与色彩倾向作为垫图基础。",
        x: 750,
        y: 40,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["firecrawl", "抓取"]
      },
      {
        id: "node5",
        type: "model",
        categoryLabel: "AI 模型",
        title: "Claude 3.7 Sonnet",
        description: "对生成提示词与抓取参考图特征做最终的语义对齐调整并调用画图接口。",
        x: 750,
        y: 180,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["claude", "3.7", "sonnet"]
      },
      {
        id: "node6",
        type: "output",
        categoryLabel: "输出终点",
        title: "Notion 自动归档",
        description: "将生成出的最终图像与对应中英文提示词自动归档至 Notion 画廊中。",
        x: 980,
        y: 120,
        ports: { inputs: ["in1", "in2"], outputs: [] },
        cardKeywords: ["notion"]
      }
    ],
    links: [
      { fromNode: "node1", fromPort: "node1-out", toNode: "node2", toPort: "node2-in", id: "edge-i1-i2" },
      { fromNode: "node2", fromPort: "node2-out", toNode: "node3", toPort: "node3-in", id: "edge-i2-i3" },
      { fromNode: "node3", fromPort: "node3-out", toNode: "node4", toPort: "node4-in", id: "edge-i3-i4" },
      { fromNode: "node3", fromPort: "node3-out", toNode: "node5", toPort: "node5-in", id: "edge-i3-i5" },
      { fromNode: "node4", fromPort: "node4-out", toNode: "node6", toPort: "node6-in1", id: "edge-i4-i6" },
      { fromNode: "node5", fromPort: "node5-out", toNode: "node6", toPort: "node6-in2", id: "edge-i5-i6" }
    ]
  },
  {
    id: "preset-news",
    name: "舆情监测",
    emoji: "",
    nodes: [
      {
        id: "node1",
        type: "input",
        categoryLabel: "输入数据",
        title: "多源新闻订阅源",
        description: "收集微信公众号、学术简报、AI 新闻等渠道的实时更新通知。",
        x: 60,
        y: 110,
        ports: { inputs: [], outputs: ["out"] },
        cardKeywords: ["订阅", "新闻", "舆情"]
      },
      {
        id: "node2",
        type: "tool",
        categoryLabel: "外部工具",
        title: "Firecrawl 抓取",
        description: "绕过反爬机制，深度提取文章正文与关键结构化元数据。",
        x: 290,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["firecrawl", "抓取"]
      },
      {
        id: "node3",
        type: "model",
        categoryLabel: "AI 模型",
        title: "Claude 3.7 Sonnet",
        description: "多维度解析新闻热度、行业价值以及潜在学术贡献度打分。",
        x: 520,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["claude", "3.7", "sonnet"]
      },
      {
        id: "node4",
        type: "prompt",
        categoryLabel: "提示词",
        title: "学术翻译模板",
        description: "将新闻大意总结翻译，并按快报格式编排为双语简报模板。",
        x: 750,
        y: 110,
        ports: { inputs: ["in"], outputs: ["out"] },
        cardKeywords: ["翻译", "prompt", "提示词"]
      },
      {
        id: "node5",
        type: "output",
        categoryLabel: "输出终点",
        title: "Notion 舆情看板",
        description: "将生成的新闻卡片归档至数据库，更新舆情看板与高光日志。",
        x: 980,
        y: 110,
        ports: { inputs: ["in"], outputs: [] },
        cardKeywords: ["notion"]
      }
    ],
    links: [
      { fromNode: "node1", fromPort: "node1-out", toNode: "node2", toPort: "node2-in", id: "edge-w1-w2" },
      { fromNode: "node2", fromPort: "node2-out", toNode: "node3", toPort: "node3-in", id: "edge-w2-w3" },
      { fromNode: "node3", fromPort: "node3-out", toNode: "node4", toPort: "node4-in", id: "edge-w3-w4" },
      { fromNode: "node4", fromPort: "node4-out", toNode: "node5", toPort: "node5-in", id: "edge-w4-w5" }
    ]
  }
];

function getPortCoord(nodes: NodeDefinition[], nodeId: string, portId: string) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };
  
  const x = node.x;
  const y = node.y;
  const width = 180;
  let height = 86; // Estimated layout height
  
  if (node.ports.inputs.length > 1) {
    height = 96;
  }
  if (node.type === "prompt") {
    height = 96;
  }
  
  if (portId.endsWith("-out")) {
    return { x: x + width, y: y + height / 2 };
  }
  
  if (portId.endsWith("-in")) {
    return { x: x, y: y + height / 2 };
  }
  
  if (portId.endsWith("-in1")) {
    return { x: x, y: y + height * 0.35 };
  }
  
  if (portId.endsWith("-in2")) {
    return { x: x, y: y + height * 0.65 };
  }
  
  return { x: x, y: y + height / 2 };
}

interface WorkflowCanvasProps {
  items: WorkflowItem[];
  activeNodeId: string | null;
  onNodeSelect: (nodeId: string | null, cardId: string | null) => void;
  isFocused: boolean;
  onToggleFocus: () => void;
  activePresetId: string;
  onPresetChange: (presetId: string) => void;
}

export function WorkflowCanvas({
  items,
  activeNodeId,
  onNodeSelect,
  isFocused,
  onToggleFocus,
  activePresetId,
  onPresetChange
}: WorkflowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panX, setPanX] = useState(30);
  const [panY, setPanY] = useState(40);
  const [scale, setScale] = useState(0.9);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const activePreset = useMemo(() => {
    return PRESETS.find(p => p.id === activePresetId) || PRESETS[0];
  }, [activePresetId]);

  const activeNodes = activePreset.nodes;
  const activeLinks = activePreset.links;

  // Match nodes to Notion cards to find actual card IDs
  const nodeCardMap = useMemo(() => {
    const map: Record<string, string> = {};
    activeNodes.forEach(node => {
      const matchedItem = items.find(it => {
        const title = it.title.toLowerCase();
        return node.cardKeywords.some(kw => title.includes(kw.toLowerCase()));
      });
      if (matchedItem) {
        map[node.id] = matchedItem.id;
      } else {
        map[node.id] = `mock-${node.id}`;
      }
    });
    return map;
  }, [items, activeNodes]);

  // Pointer event handlers for dragging/panning
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest(".node-box") || 
      (e.target as HTMLElement).closest(".canvas-btn") ||
      (e.target as HTMLElement).closest(".blueprint-selector-container")
    ) {
      return;
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panX, y: e.clientY - panY };
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.nativeEvent.pointerId);
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.current.x);
    setPanY(e.clientY - dragStart.current.y);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.nativeEvent.pointerId);
    }
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1.06;
    if (e.deltaY < 0) {
      setScale(s => Math.min(1.8, s * zoomFactor));
    } else {
      setScale(s => Math.max(0.45, s / zoomFactor));
    }
  };

  const zoomIn = () => setScale(s => Math.min(1.8, s * 1.12));
  const zoomOut = () => setScale(s => Math.max(0.45, s / 1.12));
  const resetView = () => {
    setPanX(30);
    setPanY(40);
    setScale(0.9);
  };

  // Determine if a connection line should be highlighted
  const isEdgeHighlighted = (edgeId: string): boolean => {
    if (!activeNodeId) return false;
    
    // Check academic links
    if (activePresetId === "preset-academic") {
      if (activeNodeId === "node1" && edgeId === "edge-n1-n2") return true;
      if (activeNodeId === "node2" && (edgeId === "edge-n1-n2" || edgeId === "edge-n2-n3")) return true;
      if (activeNodeId === "node3" && (edgeId === "edge-n2-n3" || edgeId === "edge-n3-n4" || edgeId === "edge-n3-n5")) return true;
      if (activeNodeId === "node4" && (edgeId === "edge-n3-n4" || edgeId === "edge-n4-n6")) return true;
      if (activeNodeId === "node5" && (edgeId === "edge-n3-n5" || edgeId === "edge-n5-n6")) return true;
      if (activeNodeId === "node6" && (edgeId === "edge-n4-n6" || edgeId === "edge-n5-n6")) return true;
    }
    
    // Check image links
    if (activePresetId === "preset-image") {
      if (activeNodeId === "node1" && edgeId === "edge-i1-i2") return true;
      if (activeNodeId === "node2" && (edgeId === "edge-i1-i2" || edgeId === "edge-i2-i3")) return true;
      if (activeNodeId === "node3" && (edgeId === "edge-i2-i3" || edgeId === "edge-i3-i4" || edgeId === "edge-i3-i5")) return true;
      if (activeNodeId === "node4" && (edgeId === "edge-i3-i4" || edgeId === "edge-i4-i6")) return true;
      if (activeNodeId === "node5" && (edgeId === "edge-i3-i5" || edgeId === "edge-i5-i6")) return true;
      if (activeNodeId === "node6" && (edgeId === "edge-i4-i6" || edgeId === "edge-i5-i6")) return true;
    }

    // Check news links
    if (activePresetId === "preset-news") {
      if (activeNodeId === "node1" && edgeId === "edge-w1-w2") return true;
      if (activeNodeId === "node2" && (edgeId === "edge-w1-w2" || edgeId === "edge-w2-w3")) return true;
      if (activeNodeId === "node3" && (edgeId === "edge-w2-w3" || edgeId === "edge-w3-w4")) return true;
      if (activeNodeId === "node4" && (edgeId === "edge-w3-w4" || edgeId === "edge-w4-w5")) return true;
      if (activeNodeId === "node5" && edgeId === "edge-w4-w5") return true;
    }

    return false;
  };

  return (
    <div 
      className="blueprint-canvas-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{
        width: "100%",
        height: isFocused ? "82vh" : "55vh",
        minHeight: "420px",
        position: "relative",
        backgroundColor: "var(--canvas-bg)",
        backgroundImage: "radial-gradient(var(--canvas-grid-dot) 1.2px, transparent 1.2px)",
        backgroundSize: "24px 24px",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        transition: "height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.3s, background-image 0.3s, border-color 0.3s"
      }}
    >
      {/* Scope local CSS inside the component */}
      <style dangerouslySetInnerHTML={{ __html: `
        .edge-bg {
          fill: none;
          stroke: var(--bg-3);
          stroke-width: 4px;
          opacity: 0.4;
          transition: stroke 0.3s, stroke-width 0.3s, opacity 0.3s;
        }
        .edge-flow {
          fill: none;
          stroke: var(--ink-3);
          stroke-width: 1.5px;
          stroke-dasharray: 6 6;
          opacity: 0.6;
          animation: flow-dash 1.5s linear infinite;
          transition: stroke 0.3s, stroke-width 0.3s, opacity 0.3s;
        }
        .edge-highlight-bg {
          stroke: var(--accent-soft);
          stroke-width: 8px;
          opacity: 0.3;
        }
        .edge-highlight-flow {
          stroke: var(--accent);
          stroke-width: 2.5px;
          opacity: 1;
        }
        .node-box {
          position: absolute;
          width: 180px;
          background: var(--bg);
          backdrop-filter: blur(12px);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          transition: border-color 0.25s, box-shadow 0.25s, opacity 0.25s, background-color 0.3s;
          cursor: pointer;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-font-smoothing: subpixel-antialiased;
        }
        .node-box:hover, .node-box.highlight {
          border-color: var(--accent);
          box-shadow: 0 6px 20px rgba(139, 115, 85, 0.18);
        }
        .node-box.dimmed {
          opacity: 0.35;
        }
        .node-box-header {
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          border-top-left-radius: 9px;
          border-top-right-radius: 9px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          justify-content: space-between;
          transition: background-color 0.3s, border-color 0.3s, color 0.3s;
        }
        .node-box-header.input { background: rgba(139, 115, 85, 0.08); border-bottom-color: var(--border); color: var(--accent); }
        .node-box-header.tool { background: rgba(44, 95, 138, 0.08); border-bottom-color: var(--border); color: var(--blue); }
        .node-box-header.model { background: rgba(45, 106, 79, 0.08); border-bottom-color: var(--border); color: var(--green); }
        .node-box-header.prompt { background: rgba(192, 57, 43, 0.08); border-bottom-color: var(--border); color: var(--red); }
        .node-box-header.output { background: rgba(139, 115, 85, 0.15); border-bottom-color: var(--border); color: var(--ink); }
        
        .node-box-body {
          padding: 12px;
          font-size: 12px;
        }
        .node-box-title {
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--ink);
          transition: color 0.3s;
        }
        .node-box-desc {
          font-size: 10px;
          color: var(--ink-2);
          line-height: 1.4;
          transition: color 0.3s;
        }
        .node-port {
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--canvas-bg);
          border: 2px solid var(--ink-2);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          transition: background-color 0.2s, border-color 0.2s;
        }
        .node-port.input-port {
          left: -6px;
          border-color: var(--accent-soft);
        }
        .node-port.output-port {
          right: -6px;
          border-color: var(--accent);
        }
        .node-box:hover .node-port, .node-box.highlight .node-port {
          background: var(--accent-soft);
          border-color: var(--accent);
        }
        .canvas-toolbar {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .canvas-btn {
          background: var(--bg-2);
          border: 1px solid var(--border);
          color: var(--ink);
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          font-weight: 500;
        }
        .canvas-btn:hover {
          background: var(--accent-pale);
          color: var(--accent);
          border-color: var(--accent);
        }
        .blueprint-selector-container select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding: 2px 20px 2px 4px;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238b7355' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 12px;
        }
        [data-theme="dark"] .blueprint-selector-container select {
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c4a882' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        }
      `}} />

      {/* Dynamic Template Switcher */}
      <div 
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid var(--border)",
          padding: "6px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          transition: "background-color 0.3s, border-color 0.3s"
        }} 
        className="blueprint-selector-container"
      >
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent)" }}>工作流:</span>
        <select
          value={activePresetId}
          onChange={(e) => onPresetChange(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--ink)",
            cursor: "pointer",
            outline: "none",
            paddingRight: "20px"
          }}
        >
          {PRESETS.map(p => (
            <option key={p.id} value={p.id} style={{ background: "var(--bg)", color: "var(--ink)" }}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Floating Canvas UI Controls */}
      <div className="canvas-toolbar">
        <button className="canvas-btn" onClick={zoomIn}>放大</button>
        <button className="canvas-btn" onClick={zoomOut}>缩小</button>
        <button className="canvas-btn" onClick={resetView}>重置</button>
        <button 
          className="canvas-btn" 
          onClick={onToggleFocus}
          style={{
            background: isFocused ? "var(--accent)" : "var(--bg-2)",
            color: isFocused ? "#fff" : "var(--ink)",
            borderColor: isFocused ? "var(--accent)" : "var(--border)",
            fontWeight: 600
          }}
        >
          {isFocused ? "常规" : "聚焦"}
        </button>
      </div>

      {/* Actual Scaled/Panned Canvas Content */}
      <div 
        className="blueprint-canvas-content"
        style={{
          position: "absolute",
          width: "2000px",
          height: "2000px",
          transformOrigin: "0 0",
          transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          willChange: "transform"
        }}
      >
        {/* SVG Splines layer */}
        <svg 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1
          }}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent)" />
            </marker>
          </defs>

          {activeLinks.map(link => {
            const p1 = getPortCoord(activeNodes, link.fromNode, link.fromPort);
            const p2 = getPortCoord(activeNodes, link.toNode, link.toPort);
            const dx = Math.abs(p2.x - p1.x) * 0.5;
            const pathData = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
            const highlighted = isEdgeHighlighted(link.id);

            return (
              <g key={link.id}>
                {/* Glow/Background line */}
                <path 
                  d={pathData} 
                  className={`edge-bg ${highlighted ? "edge-highlight-bg" : ""}`} 
                />
                {/* Foreground animated dashed line */}
                <path 
                  d={pathData} 
                  className={`edge-flow ${highlighted ? "edge-highlight-flow" : ""}`} 
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Nodes layer */}
        <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 2 }}>
          {activeNodes.map(node => {
            const isActive = activeNodeId === node.id;
            const isDimmed = activeNodeId !== null && !isActive;
            const cardId = nodeCardMap[node.id];

            return (
              <div
                key={node.id}
                id={node.id}
                className={`node-box ${isActive ? "highlight" : ""} ${isDimmed ? "dimmed" : ""}`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeSelect(node.id, cardId || null);
                }}
              >
                {/* Category Header */}
                <div className={`node-box-header ${node.type}`}>
                  {node.categoryLabel}
                </div>
                {/* Content */}
                <div className="node-box-body">
                  <div className="node-box-title">{node.title}</div>
                  <p className="node-box-desc">{node.description}</p>
                </div>
                {/* Render Port dots */}
                {node.ports.inputs.map(portId => (
                  <div 
                    key={portId} 
                    id={`${node.id}-${portId}`} 
                    className="node-port input-port"
                  />
                ))}
                {node.ports.outputs.map(portId => (
                  <div 
                    key={portId} 
                    id={`${node.id}-${portId}`} 
                    className="node-port output-port"
                  />
                ))}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
