"use client";

import { useState, useMemo } from "react";
import { PresetWorkflow } from "@/data/workflowPresets";
import { WorkflowFlowchartMermaid } from "./WorkflowFlowchartMermaid";

interface WorkflowAccordionProps {
  workflows: PresetWorkflow[];
  activeWorkflowId: string | null;
  onSelectWorkflow: (workflowId: string | null) => void;
  onSelectEntityName: (name: string) => void;
  onScrollToAppendix: () => void;
}

const CATEGORIES = ["全部", "学术本地化", "代码工程", "视觉生成", "日常效率", "AI研究"] as const;

export function WorkflowAccordion({
  workflows,
  activeWorkflowId,
  onSelectWorkflow,
  onSelectEntityName,
  onScrollToAppendix,
}: WorkflowAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(activeWorkflowId ? [activeWorkflowId] : [workflows[0]?.id || ""])
  );

  // Filter workflows by category & search
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchCat = selectedCategory === "全部" || wf.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        wf.title.toLowerCase().includes(q) ||
        wf.tagline.toLowerCase().includes(q) ||
        wf.tags.some((t) => t.toLowerCase().includes(q)) ||
        wf.keyEntities.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [workflows, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
      if (activeWorkflowId === id) onSelectWorkflow(null);
    } else {
      next.add(id);
      onSelectWorkflow(id);
    }
    setExpandedIds(next);
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredWorkflows.map((w) => w.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
    onSelectWorkflow(null);
  };

  return (
    <section className="workflow-accordion-section" style={{ marginTop: "36px" }}>
      {/* Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            WORKFLOWS
          </div>
          <h2 style={{ fontSize: "20px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "4px 0 0" }}>
            工作流列表
          </h2>
        </div>

        {/* Global Expand / Collapse All Controls */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleExpandAll}
            style={{
              padding: "5px 12px",
              fontSize: "11px",
              fontFamily: "var(--mono)",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            全部展开
          </button>
          <button
            onClick={handleCollapseAll}
            style={{
              padding: "5px 12px",
              fontSize: "11px",
              fontFamily: "var(--mono)",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            全部收起
          </button>
        </div>
      </div>

      {/* Category Pills & Real-time Search Box */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          padding: "12px 16px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "10px",
          marginBottom: "24px",
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "4px 12px",
                  fontSize: "11.5px",
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: "20px",
                  border: `1px solid ${isSelected ? "var(--accent)" : "var(--line)"}`,
                  background: isSelected ? "var(--accent)" : "transparent",
                  color: isSelected ? "#ffffff" : "var(--ink-2)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Real-time Search Input (No Emoji, No Placeholder Text) */}
        <div style={{ position: "relative", minWidth: "200px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px 6px 28px",
              fontSize: "12px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              background: "var(--paper)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              position: "absolute",
              left: "9px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-3)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "var(--ink-2)", border: "none", background: "none", cursor: "pointer" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Accordion Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredWorkflows.map((wf) => {
          const isExpanded = expandedIds.has(wf.id);
          const isFocusedIn3D = activeWorkflowId === wf.id;

          return (
            <div
              key={wf.id}
              id={`wf-card-${wf.id}`}
              style={{
                background: "var(--card)",
                border: `1.5px solid ${isFocusedIn3D ? "var(--accent)" : "var(--line)"}`,
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: isFocusedIn3D ? "0 6px 24px rgba(194, 67, 27, 0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
                transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Card Folded Header */}
              <div
                onClick={() => toggleExpand(wf.id)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  background: isExpanded ? "var(--accent-soft)" : "transparent",
                  borderBottom: isExpanded ? "1px solid var(--line)" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "10px", fontFamily: "var(--mono)", textTransform: "uppercase", padding: "2px 8px", borderRadius: "4px", background: "var(--line)", color: "var(--ink)", fontWeight: 600 }}>
                      {wf.category}
                    </span>
                    <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "rgba(194,67,27,0.1)", color: "var(--accent)", fontWeight: 700 }}>
                      {wf.badge}
                    </span>
                    {wf.appendixNoteTitle && (
                      <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "4px", background: "rgba(44, 95, 138, 0.1)", color: "#2C5F8A" }}>
                        📑 附录笔记
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", margin: 0 }}>
                    {wf.title}
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "var(--ink-2)", margin: "4px 0 0", lineHeight: 1.5 }}>
                    {wf.tagline}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      fontSize: "12px",
                      color: "var(--ink-2)",
                      display: "inline-block",
                    }}
                  >
                    ▶
                  </span>
                </div>
              </div>

              {/* Card Expanded Pipeline Body */}
              {isExpanded && (
                <div style={{ padding: "20px" }}>
                  {/* Top Action Bar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {wf.tags.map((t) => (
                        <span key={t} style={{ fontSize: "10.5px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWorkflow(wf.id);
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        style={{
                          padding: "4px 12px",
                          fontSize: "11px",
                          fontFamily: "var(--mono)",
                          fontWeight: 700,
                          borderRadius: "6px",
                          background: isFocusedIn3D ? "var(--accent)" : "var(--paper)",
                          color: isFocusedIn3D ? "#ffffff" : "var(--accent)",
                          border: "1px solid var(--accent)",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        在图谱中聚焦
                      </button>
                      {wf.appendixNoteTitle && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onScrollToAppendix();
                          }}
                          style={{
                            padding: "4px 12px",
                            fontSize: "11px",
                            fontFamily: "var(--mono)",
                            fontWeight: 600,
                            borderRadius: "6px",
                            background: "var(--paper)",
                            color: "var(--ink)",
                            border: "1px solid var(--line)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          查看衍生笔记 ➔
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mermaid Flowchart Canvas */}
                  <WorkflowFlowchartMermaid workflow={wf} onSelectEntityName={onSelectEntityName} />
                </div>
              )}
            </div>
          );
        })}

        {filteredWorkflows.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-3)", border: "1px dashed var(--line)", borderRadius: "12px" }}>
            没有找到匹配的工作流。
          </div>
        )}
      </div>
    </section>
  );
}
