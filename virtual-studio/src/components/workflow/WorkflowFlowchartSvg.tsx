"use client";

import { useState, useRef, useId } from "react";
import { PresetWorkflow } from "@/data/workflowPresets";

interface WorkflowFlowchartSvgProps {
  workflow: PresetWorkflow;
  onSelectEntityName: (name: string) => void;
}

export function WorkflowFlowchartSvg({ workflow, onSelectEntityName }: WorkflowFlowchartSvgProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const patternId = useId();

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "button" || (e.target as HTMLElement).tagName === "a") return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const phases = workflow.phases;

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Blueprint Header Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "12px 18px",
          background: "var(--paper)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "10.5px",
              fontFamily: "var(--mono)",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              background: "var(--accent)",
              color: "#ffffff",
              letterSpacing: "0.08em",
            }}
          >
            BLUEPRINT 流程蓝图
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}>
            {workflow.title}
          </span>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            ({phases.length} 阶段 · {phases.reduce((a, b) => a + b.steps.length, 0)} 流转节点)
          </span>
        </div>

        {/* Blueprint Viewport Navigation Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--ink-3)", marginRight: "4px" }}>
            缩放 {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="放大蓝图"
            aria-label="放大蓝图"
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
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="缩小蓝图"
            aria-label="缩小蓝图"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "4px 10px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              fontSize: "11px",
              fontFamily: "var(--mono)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
            }}
            title="重置缩放与视角"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            重置全景
          </button>
        </div>
      </div>

      {/* SVG Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: "100%",
          height: "640px",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          background: "var(--paper)",
          overflow: "hidden",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1100 620"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          {/* Blueprint SVG Definitions */}
          <defs>
            {/* Grid Pattern */}
            <pattern id={patternId} width="30" height="30" patternUnits="userSpaceOnUse">
              <rect width="30" height="30" fill="none" />
              <circle cx="15" cy="15" r="1" fill="var(--ink-3)" fillOpacity="0.25" />
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--line)" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Arrow Markers */}
            <marker id="bp-arrow-accent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#C2431B" />
            </marker>
            <marker id="bp-arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#2D6A4F" />
            </marker>
            <marker id="bp-arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#2C5F8A" />
            </marker>
            <marker id="bp-arrow-loop" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 1 1 L 7 4 L 1 7 Z" fill="#D97706" />
            </marker>

            {/* Drop Shadow */}
            <filter id="bp-shadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.06" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="1100" height="620" fill={`url(#${patternId})`} />

          {/* ═══════════ PHASE 01 REGION: 前置去噪与意图对齐 ═══════════ */}
          <g>
            {/* Phase 1 Background Scope Box */}
            <rect
              x="30"
              y="40"
              width="310"
              height="540"
              rx="12"
              fill="var(--card)"
              fillOpacity="0.6"
              stroke="#C2431B"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* Phase 1 Header Badge */}
            <rect x="42" y="52" width="130" height="22" rx="4" fill="#C2431B" />
            <text x="48" y="67" fill="#ffffff" fontSize="10.5" fontFamily="var(--mono)" fontWeight="bold">
              PHASE 01 · 前置清洗
            </text>
            <text x="180" y="67" fill="var(--ink-2)" fontSize="11" fontFamily="var(--serif)" fontWeight="bold">
              意图对齐与去噪
            </text>

            {/* Node 1-1: PDF 原文导入 */}
            <g
              transform="translate(50, 95)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("Antigravity")}
              onMouseEnter={() => setHoveredNodeId("n1-1")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="270"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n1-1" ? "#C2431B" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n1-1" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="270" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="270" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#D97706" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                INPUT · PDF 原版输入
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                PDF 导入工作区
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                31,136 英文单词 · 章节骨架解析
              </text>
              <rect x="16" y="74" width="105" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="86" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 Antigravity
              </text>
            </g>

            {/* Flow 1-1 to 1-2 */}
            <path
              id="wire-1"
              d="M 185 195 L 185 240"
              fill="none"
              stroke="#C2431B"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-accent)"
            />
            <circle r="3" fill="#C2431B">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 185 195 L 185 240" />
            </circle>

            {/* Node 1-2: Python 正则清洗脚本 */}
            <g
              transform="translate(50, 245)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("Python 正则清洗脚本")}
              onMouseEnter={() => setHoveredNodeId("n1-2")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="270"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n1-2" ? "#C2431B" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n1-2" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="270" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="270" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#2D6A4F" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                SCRIPT · 算法去噪
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                Python 正则清洗脚本
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                去除页眉页脚与杂质 · 输出脱水 Markdown
              </text>
              <rect x="16" y="74" width="135" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="86" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 Python 正则清洗脚本
              </text>
            </g>

            {/* Flow 1-2 to 1-3 */}
            <path
              id="wire-2"
              d="M 185 345 L 185 390"
              fill="none"
              stroke="#C2431B"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-accent)"
            />
            <circle r="3" fill="#C2431B">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 185 345 L 185 390" />
            </circle>

            {/* Node 1-3: /grill-me 意图拷问 */}
            <g
              transform="translate(50, 395)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("/grill-me 意图拷问")}
              onMouseEnter={() => setHoveredNodeId("n1-3")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="270"
                height="105"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n1-3" ? "#C2431B" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n1-3" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="270" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="270" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#8B5CF6" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                PROTOCOL · 意图锁定
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                /grill-me 拷问协议
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                多轮对齐 · 锁定《三大法则》与全局术语表
              </text>
              <rect x="16" y="76" width="135" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="88" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 /grill-me 意图拷问
              </text>
            </g>
          </g>

          {/* Inter-Phase Wire: Phase 1 (1-3) to Phase 2 (2-1) */}
          <path
            id="wire-inter-1"
            d="M 320 447 C 360 447, 360 145, 395 145"
            fill="none"
            stroke="#2D6A4F"
            strokeWidth="2.5"
            markerEnd="url(#bp-arrow-green)"
          />
          <circle r="3.5" fill="#2D6A4F">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 320 447 C 360 447, 360 145, 395 145" />
          </circle>

          {/* ═══════════ PHASE 02 REGION: 双轨精润与错题本自愈 ═══════════ */}
          <g>
            {/* Phase 2 Background Scope Box */}
            <rect
              x="380"
              y="40"
              width="330"
              height="540"
              rx="12"
              fill="var(--card)"
              fillOpacity="0.6"
              stroke="#2D6A4F"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* Phase 2 Header Badge */}
            <rect x="392" y="52" width="130" height="22" rx="4" fill="#2D6A4F" />
            <text x="398" y="67" fill="#ffffff" fontSize="10.5" fontFamily="var(--mono)" fontWeight="bold">
              PHASE 02 · 双轨精润
            </text>
            <text x="530" y="67" fill="var(--ink-2)" fontSize="11" fontFamily="var(--serif)" fontWeight="bold">
              人机双轨与自愈回路
            </text>

            {/* Node 2-1: Gemini 3.5 Flash 初译 */}
            <g
              transform="translate(400, 95)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("Gemini 3.5 Flash")}
              onMouseEnter={() => setHoveredNodeId("n2-1")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n2-1" ? "#2D6A4F" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n2-1" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#0EA5E9" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                MODEL 1 · 全景初译
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                Gemini 3.5 Flash 初译层
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                100 万 Token 原生大窗口 · 零漏译精准召回
              </text>
              <rect x="16" y="74" width="135" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="86" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 Gemini 3.5 Flash
              </text>
            </g>

            {/* Flow 2-1 to 2-2 */}
            <path
              id="wire-3"
              d="M 545 195 L 545 240"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-green)"
            />
            <circle r="3" fill="#2D6A4F">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 545 195 L 545 240" />
            </circle>

            {/* Node 2-2: DeepSeek V4 Pro 审校 */}
            <g
              transform="translate(400, 245)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("DeepSeek V4 Pro")}
              onMouseEnter={() => setHoveredNodeId("n2-2")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n2-2" ? "#2D6A4F" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n2-2" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#3B82F6" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                MODEL 2 · 专家审校
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                DeepSeek V4 Pro 审校层
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                MRCR 85% 挑错率 · 消除翻译腔 · 注入商业博弈感
              </text>
              <rect x="16" y="74" width="135" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="86" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 DeepSeek V4 Pro
              </text>
            </g>

            {/* Flow 2-2 to 2-3 */}
            <path
              id="wire-4"
              d="M 545 345 L 545 390"
              fill="none"
              stroke="#2D6A4F"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-green)"
            />
            <circle r="3" fill="#2D6A4F">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 545 345 L 545 390" />
            </circle>

            {/* Node 2-3: 错题本自愈机制 */}
            <g
              transform="translate(400, 395)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("walkthrough 错题本")}
              onMouseEnter={() => setHoveredNodeId("n2-3")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="105"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n2-3" ? "#D97706" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n2-3" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#D97706" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                FEEDBACK LOOP · 自愈错题本
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                AGENTS.md & walkthrough 固化
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                记录句法避坑点 · 动态更新 Agent 规则与 Prompt
              </text>
              <rect x="16" y="76" width="145" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="88" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 walkthrough 错题本
              </text>
            </g>

            {/* 🔄 FEEDBACK LOOP BUS: 2-3 back to 2-1 */}
            <path
              id="wire-feedback-loop"
              d="M 400 447 C 340 447, 340 145, 395 145"
              fill="none"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              markerEnd="url(#bp-arrow-loop)"
            />
            <circle r="3" fill="#D97706">
              <animateMotion dur="3.5s" repeatCount="indefinite" path="M 400 447 C 340 447, 340 145, 395 145" />
            </circle>
            <rect x="330" y="280" width="70" height="18" rx="4" fill="#D97706" />
            <text x="334" y="293" fill="#ffffff" fontSize="9" fontFamily="var(--mono)" fontWeight="bold">
              自愈反馈回路
            </text>
          </g>

          {/* Inter-Phase Wire: Phase 2 (2-3) to Phase 3 (3-1) */}
          <path
            id="wire-inter-2"
            d="M 690 447 C 725 447, 725 145, 755 145"
            fill="none"
            stroke="#2C5F8A"
            strokeWidth="2.5"
            markerEnd="url(#bp-arrow-blue)"
          />
          <circle r="3.5" fill="#2C5F8A">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 690 447 C 725 447, 725 145, 755 145" />
          </circle>

          {/* ═══════════ PHASE 03 REGION: 算法编译与自动化交付 ═══════════ */}
          <g>
            {/* Phase 3 Background Scope Box */}
            <rect
              x="740"
              y="40"
              width="330"
              height="540"
              rx="12"
              fill="var(--card)"
              fillOpacity="0.6"
              stroke="#2C5F8A"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            {/* Phase 3 Header Badge */}
            <rect x="752" y="52" width="130" height="22" rx="4" fill="#2C5F8A" />
            <text x="758" y="67" fill="#ffffff" fontSize="10.5" fontFamily="var(--mono)" fontWeight="bold">
              PHASE 03 · 自动交付
            </text>
            <text x="890" y="67" fill="var(--ink-2)" fontSize="11" fontFamily="var(--serif)" fontWeight="bold">
              算法排版与质检
            </text>

            {/* Node 3-1: Pandoc 自动化引擎 */}
            <g
              transform="translate(760, 95)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("Pandoc")}
              onMouseEnter={() => setHoveredNodeId("n3-1")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n3-1" ? "#2C5F8A" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n3-1" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#6366F1" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                COMPILER · 格式编译器
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                Pandoc 自动化引擎
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                全书 Markdown 结构化编译为 Word DOCX / EPUB
              </text>
              <rect x="16" y="74" width="85" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="86" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 Pandoc
              </text>
            </g>

            {/* Flow 3-1 to 3-2 */}
            <path
              id="wire-5"
              d="M 905 195 L 905 240"
              fill="none"
              stroke="#2C5F8A"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-blue)"
            />
            <circle r="3" fill="#2C5F8A">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 905 195 L 905 240" />
            </circle>

            {/* Node 3-2: Word COM 排版引擎 */}
            <g
              transform="translate(760, 245)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("Pandoc")}
              onMouseEnter={() => setHoveredNodeId("n3-2")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="100"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n3-2" ? "#2C5F8A" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n3-2" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#3B82F6" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                LAYOUT · 样式注入
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                Word COM 排版 API
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                中文版式优化 · 字体间距与标题字号自动微调
              </text>
              <rect x="16" y="74" width="115" height="18" rx="4" fill="var(--line)" />
              <text x="22" y="86" fill="var(--ink-2)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                排版样式自动化
              </text>
            </g>

            {/* Flow 3-2 to 3-3 */}
            <path
              id="wire-6"
              d="M 905 345 L 905 390"
              fill="none"
              stroke="#2C5F8A"
              strokeWidth="2"
              markerEnd="url(#bp-arrow-blue)"
            />
            <circle r="3" fill="#2C5F8A">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 905 345 L 905 390" />
            </circle>

            {/* Node 3-3: verify.py 终验与交付 */}
            <g
              transform="translate(760, 395)"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectEntityName("verify.py 校验脚本")}
              onMouseEnter={() => setHoveredNodeId("n3-3")}
              onMouseLeave={() => setHoveredNodeId(null)}
            >
              <rect
                width="290"
                height="105"
                rx="8"
                fill="var(--paper)"
                stroke={hoveredNodeId === "n3-3" ? "#C2431B" : "var(--line)"}
                strokeWidth={hoveredNodeId === "n3-3" ? 2 : 1}
                filter="url(#bp-shadow)"
              />
              <rect width="290" height="24" rx="8" fill="var(--line)" />
              <rect y="16" width="290" height="8" fill="var(--line)" />
              <circle cx="16" cy="12" r="4" fill="#10B981" />
              <text x="26" y="15" fill="var(--ink)" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                DELIVERABLE · 出版级交付物
              </text>
              <text x="16" y="44" fill="var(--ink)" fontSize="12.5" fontWeight="bold">
                verify.py 质量终验
              </text>
              <text x="16" y="64" fill="var(--ink-2)" fontSize="10.5" fontFamily="var(--mono)">
                术语一致性校验 100% · 两日完成全书交付
              </text>
              <rect x="16" y="76" width="145" height="18" rx="4" fill="var(--accent-soft)" />
              <text x="22" y="88" fill="#C2431B" fontSize="9.5" fontFamily="var(--mono)" fontWeight="bold">
                🔗 verify.py 校验脚本
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Blueprint Legend Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "10px 18px",
          background: "var(--paper)",
          borderTop: "1px solid var(--line)",
          fontSize: "11px",
          fontFamily: "var(--mono)",
          color: "var(--ink-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C2431B" }} />
            阶段01: 前置清洗与意图锁定
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2D6A4F" }} />
            阶段02: 双模型协作与自愈反馈回路
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2C5F8A" }} />
            阶段03: 算法编译与出版级交付
          </span>
        </div>
        <span style={{ color: "var(--ink-3)", fontSize: "10px" }}>
          提示：按住鼠标可平移拖拽，右上角控制缩放；点击节点可联动定位 3D 图谱实体
        </span>
      </div>
    </div>
  );
}
