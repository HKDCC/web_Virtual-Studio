"use client";

import { useEffect, useState, useRef, useId } from "react";
import mermaid from "mermaid";
import { PresetWorkflow } from "@/data/workflowPresets";

interface WorkflowFlowchartMermaidProps {
  workflow: PresetWorkflow;
  onSelectEntityName?: (name: string) => void;
}

export function WorkflowFlowchartMermaid({ workflow, onSelectEntityName }: WorkflowFlowchartMermaidProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useId().replace(/:/g, "_");

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.65, z - 0.15));
  const handleReset = () => setZoom(1);

  // Generate Mermaid Syntax from Workflow
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "neutral",
      securityLevel: "loose",
      fontFamily: "var(--mono), -apple-system, sans-serif",
      themeVariables: {
        primaryColor: "#F6F2EA",
        primaryTextColor: "#161310",
        primaryBorderColor: "#C2431B",
        lineColor: "#C2431B",
        secondaryColor: "#EAE5D9",
        tertiaryColor: "#FFFFFF",
      },
    });

    let code = `flowchart TD\n`;

    // Render Phases as subgraphs
    workflow.phases.forEach((phase) => {
      code += `  subgraph P${phase.phaseNumber} ["阶段 0${phase.phaseNumber} · ${phase.title}"]\n`;
      phase.steps.forEach((step, sIdx) => {
        const stepNodeId = `S_${phase.phaseNumber}_${sIdx + 1}`;
        const cleanName = step.name.replace(/["']/g, "");
        const cleanDesc = step.description.replace(/["']/g, "");
        code += `    ${stepNodeId}["<b>${cleanName}</b><br/><small style='color:#666;'>${cleanDesc}</small>"]\n`;
      });

      // Connect steps sequentially inside phase
      for (let i = 0; i < phase.steps.length - 1; i++) {
        code += `    S_${phase.phaseNumber}_${i + 1} --> S_${phase.phaseNumber}_${i + 2}\n`;
      }
      code += `  end\n`;
    });

    // Inter-phase connections
    for (let p = 0; p < workflow.phases.length - 1; p++) {
      const lastStepOfCurrent = `S_${workflow.phases[p].phaseNumber}_${workflow.phases[p].steps.length}`;
      const firstStepOfNext = `S_${workflow.phases[p + 1].phaseNumber}_1`;
      code += `  ${lastStepOfCurrent} ==> ${firstStepOfNext}\n`;
    }

    // If Obviously Awesome, add the self-healing feedback loop
    if (workflow.id === "wf-obviously-awesome") {
      code += `  S_2_3 -.->|"自愈反馈回路 (Feedback Loop)"| S_2_1\n`;
    }

    // Styling classes
    code += `  classDef default fill:#F6F2EA,stroke:#C2431B,stroke-width:1.5px,color:#161310,rx:8px,ry:8px;\n`;

    const renderId = `mermaid_${chartId}_${Date.now()}`;
    mermaid
      .render(renderId, code)
      .then(({ svg }) => {
        setSvgContent(svg);
      })
      .catch((err) => {
        console.error("Failed to render Mermaid chart:", err);
      });
  }, [workflow, chartId]);

  return (
    <div
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Controls Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)" }}>
            流程蓝图 · Mermaid Flowchart
          </span>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            {workflow.phases.length} 个执行阶段 · {workflow.phases.reduce((a, b) => a + b.steps.length, 0)} 个节点
          </span>
        </div>

        {/* Zoom SVG Buttons */}
        <div style={{ display: "flex", gap: "6px" }}>
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
            title="放大流程图"
            aria-label="放大流程图"
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
            title="缩小流程图"
            aria-label="缩小流程图"
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
            title="重置缩放"
            aria-label="重置缩放"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Rendered Mermaid SVG Viewport */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          overflowX: "auto",
          padding: "16px 8px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {svgContent ? (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div style={{ padding: "40px", color: "var(--ink-3)", fontFamily: "var(--mono)", fontSize: "12px" }}>
            正在生成 Mermaid 流程蓝图……
          </div>
        )}
      </div>

      {/* Key Entities Quick Link Pills */}
      {workflow.keyEntities && workflow.keyEntities.length > 0 && onSelectEntityName && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "8px" }}>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            关联实体定位:
          </span>
          {workflow.keyEntities.map((entity) => (
            <button
              key={entity}
              onClick={() => onSelectEntityName(entity)}
              style={{
                fontSize: "10px",
                fontFamily: "var(--mono)",
                color: "var(--accent)",
                fontWeight: 600,
                border: "1px solid var(--accent)",
                borderRadius: "4px",
                padding: "2px 7px",
                cursor: "pointer",
                background: "var(--accent-soft)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {entity}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
