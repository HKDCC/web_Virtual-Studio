"use client";

import Link from "next/link";
import { RawNoteItem } from "@/lib/graphEngine";

interface WorkflowAppendixProps {
  notes: RawNoteItem[];
}

export function WorkflowAppendix({ notes = [] }: WorkflowAppendixProps) {
  // Filter for 人工探索 notes, fallback to all available notes if none
  const explorationNotes = notes.filter((n) => n.category === "人工探索");
  const displayNotes = explorationNotes.length > 0 ? explorationNotes : notes.slice(0, 8);

  return (
    <section id="workflow-appendix" style={{ marginTop: "50px", marginBottom: "40px", borderTop: "1px solid var(--line)", paddingTop: "32px" }}>
      {/* Appendix Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            KNOWLEDGE BASE · 人工探索
          </div>
          <h2 style={{ fontSize: "20px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "4px 0 0" }}>
            工作流衍生智识资产
          </h2>
          <p style={{ fontSize: "12.5px", color: "var(--ink-2)", margin: "6px 0 0", maxWidth: "680px", lineHeight: 1.5 }}>
            工作流实践过程中沉淀的技术笔记与复盘记录。
          </p>
        </div>

        <Link
          href="/workflow/notes"
          style={{
            padding: "6px 14px",
            fontSize: "11.5px",
            fontFamily: "var(--mono)",
            fontWeight: 700,
            borderRadius: "6px",
            background: "var(--card)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          进入文档库全览 ➔
        </Link>
      </div>

      {/* Real Note Cards Grid */}
      {displayNotes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {displayNotes.map((note) => {
            const targetUrl = `/workflow/notes?id=${note.id}`;

            return (
              <Link
                key={note.id}
                href={targetUrl}
                style={{
                  background: "var(--card)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: "10px",
                  padding: "18px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(194, 67, 27, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Header Tag Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "var(--mono)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: "var(--accent)",
                        color: "#ffffff",
                        fontWeight: 700,
                      }}
                    >
                      {note.category || "人工探索"}
                    </span>
                  </div>
                  {note.date && (
                    <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                      {note.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: "15px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>
                  {note.title}
                </h3>

                {/* Excerpt */}
                <p style={{ fontSize: "12px", color: "var(--ink-2)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {note.excerpt || "点击阅读完整笔记与复盘文档。"}
                </p>

                {/* Tags & Action Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "10px", marginTop: "auto" }}>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {note.tags && note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--mono)",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          background: "var(--paper)",
                          border: "1px solid var(--line)",
                          color: "var(--ink-3)",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--mono)",
                      color: "var(--accent)",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    阅读笔记 ➔
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-3)", border: "1px dashed var(--line)", borderRadius: "12px" }}>
          暂无衍生智识笔记。
        </div>
      )}
    </section>
  );
}
