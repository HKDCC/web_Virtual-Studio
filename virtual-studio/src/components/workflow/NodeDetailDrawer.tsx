"use client";

import { GraphNode } from "@/lib/graphEngine";
import { PresetWorkflow } from "@/data/workflowPresets";

interface NodeDetailDrawerProps {
  node: GraphNode | null;
  workflows: PresetWorkflow[];
  onClose: () => void;
  onSelectWorkflow: (workflowId: string) => void;
}

export function NodeDetailDrawer({
  node,
  workflows,
  onClose,
  onSelectWorkflow,
}: NodeDetailDrawerProps) {
  if (!node) return null;

  const matchedWorkflows = workflows.filter((w) =>
    node.relatedWorkflowIds.includes(w.id) ||
    w.keyEntities.some((k) => k.toLowerCase() === node.name.toLowerCase())
  );

  return (
    <>
      {/* Background Dim Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(22, 19, 16, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 998,
        }}
      />

      {/* Slide-in Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          background: "var(--card)",
          borderLeft: "1px solid var(--line)",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.12)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />

        {/* Drawer Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: node.color,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-2)", textTransform: "uppercase", fontWeight: 700 }}>
              {node.type} · 双链图谱详情
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "16px",
              color: "var(--ink-2)",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div style={{ padding: "24px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main Title & Badge */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              {node.iconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={node.iconUrl} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover" }} />
              ) : null}
              <h2 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--serif)", color: "var(--ink)", margin: 0 }}>
                {node.name}
              </h2>
            </div>
            {node.badge && (
              <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--line)", color: "var(--ink)", fontWeight: 600 }}>
                {node.badge}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)", marginBottom: "4px" }}>简介描述</div>
            <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
              {node.description}
            </p>
          </div>

          {/* Frequency & Degree Stats */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "12px" }}>
            <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, marginBottom: "2px" }}>
              关联统计
            </div>
            <div style={{ fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>
              参与 {node.workflowCount} 个核心工作流
            </div>
          </div>

          {/* Backlink: Participating Workflows */}
          {matchedWorkflows.length > 0 && (
            <div>
              <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)", marginBottom: "8px" }}>
                参与的工作流 (反向链接)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {matchedWorkflows.map((wf) => (
                  <div
                    key={wf.id}
                    onClick={() => {
                      onSelectWorkflow(wf.id);
                      onClose();
                      const el = document.getElementById(`wf-card-${wf.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{wf.title}</div>
                      <div style={{ fontSize: "11px", color: "var(--ink-2)" }}>{wf.category} · {wf.badge}</div>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>跳转 ➔</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Viewer if exists */}
          {(node.promptZh || node.promptEn) && (
            <div>
              <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)", marginBottom: "6px" }}>提示词模板</div>
              <pre
                style={{
                  fontSize: "11.5px",
                  color: "var(--ink)",
                  lineHeight: 1.5,
                  background: "var(--paper)",
                  padding: "12px",
                  borderRadius: "6px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  maxHeight: "180px",
                  overflowY: "auto",
                  fontFamily: "var(--mono)",
                  border: "1px solid var(--line)",
                  margin: 0,
                }}
              >
                {node.promptZh || node.promptEn}
              </pre>
            </div>
          )}

          {/* External Link */}
          {node.siteUrl && (
            <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
              <a
                href={node.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  textDecoration: "none",
                  fontSize: "12.5px",
                  fontFamily: "var(--mono)",
                  fontWeight: 600,
                }}
              >
                打开官方主页 ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
