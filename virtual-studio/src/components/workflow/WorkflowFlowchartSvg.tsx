"use client";

import { useState } from "react";
import { PresetWorkflow } from "@/data/workflowPresets";

interface WorkflowFlowchartSvgProps {
  workflow: PresetWorkflow;
  onSelectEntityName: (name: string) => void;
}

export function WorkflowFlowchartSvg({ workflow, onSelectEntityName }: WorkflowFlowchartSvgProps) {
  const [zoom, setZoom] = useState<number>(1);

  const handleZoomIn = () => setZoom((z) => Math.min(1.35, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, z - 0.15));
  const handleReset = () => setZoom(1);

  const allPhases = workflow.phases;

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
      {/* Top Controls Bar */}
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
            流程图
          </span>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            {allPhases.length} 个阶段 · {allPhases.reduce((a, b) => a + b.steps.length, 0)} 个节点
          </span>
        </div>

        {/* Zoom & Reset SVG Buttons */}
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Vertical Flow Diagram Canvas */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          padding: "4px 0 16px",
          width: "100%",
        }}
      >
        {allPhases.map((phase, pIdx) => {
          const phaseColor =
            pIdx === 0 ? "var(--accent)" : pIdx === 1 ? "#2D6A4F" : "#2C5F8A";

          return (
            <div
              key={phase.phaseNumber}
              style={{
                width: "100%",
                maxWidth: "720px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Phase Header Container */}
              <div
                style={{
                  width: "100%",
                  background: "var(--card)",
                  border: `1.5px solid ${phaseColor}`,
                  borderRadius: "10px",
                  padding: "14px 18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      color: phaseColor,
                      letterSpacing: "0.08em",
                    }}
                  >
                    PHASE 0{phase.phaseNumber} · 阶段 {phase.phaseNumber}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>
                    {phase.steps.length} 个步骤
                  </span>
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", margin: "0 0 4px" }}>
                  {phase.title}
                </h4>
                <p style={{ fontSize: "11.5px", color: "var(--ink-2)", margin: 0, lineHeight: 1.45 }}>
                  {phase.summary}
                </p>

                {/* Steps Flow inside Phase */}
                <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {phase.steps.map((step, sIdx) => (
                    <div key={step.id}>
                      <div
                        style={{
                          background: "var(--paper)",
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: "220px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                            <span
                              style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: phaseColor,
                                color: "#ffffff",
                                fontSize: "10px",
                                fontFamily: "var(--mono)",
                                fontWeight: 700,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {sIdx + 1}
                            </span>
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--ink)" }}>
                              {step.name}
                            </span>
                            <span
                              style={{
                                fontSize: "9px",
                                fontFamily: "var(--mono)",
                                padding: "1px 5px",
                                borderRadius: "3px",
                                background: "var(--line)",
                                color: "var(--ink-2)",
                                textTransform: "uppercase",
                              }}
                            >
                              {step.type}
                            </span>
                          </div>
                          <p style={{ fontSize: "11px", color: "var(--ink-2)", margin: "3px 0 0", lineHeight: 1.4 }}>
                            {step.description}
                          </p>
                        </div>

                        {step.entityName && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectEntityName(step.entityName!);
                            }}
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
                            title="在关系图谱中定位此实体"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            {step.entityName}
                          </button>
                        )}
                      </div>

                      {/* Intra-Phase Connecting SVG Arrow */}
                      {sIdx < phase.steps.length - 1 && (
                        <div style={{ display: "flex", justifyContent: "center", height: "14px", alignItems: "center" }}>
                          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                            <line x1="5" y1="0" x2="5" y2="10" stroke="var(--ink-3)" strokeWidth="1.5" strokeDasharray="2 2" />
                            <polygon points="2,8 5,13 8,8" fill="var(--ink-3)" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inter-Phase Connecting Flow Line */}
              {pIdx < allPhases.length - 1 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "28px", justifyContent: "center" }}>
                  <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
                    <line x1="7" y1="0" x2="7" y2="20" stroke="var(--accent)" strokeWidth="2" />
                    <polygon points="3,18 7,26 11,18" fill="var(--accent)" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
