"use client";

import { useState } from "react";
import Link from "next/link";

export interface NoteDocItem {
  id: string;
  title: string;
  date: string;
  category: string;
  badge?: string | null;
  excerpt?: string | null;
  tags?: string[];
}

export interface NoteHeadingItem {
  id: string;
  level: number;
  text: string;
}

interface NotesDocViewerProps {
  notes: NoteDocItem[];
  currentNote: NoteDocItem;
  headings: NoteHeadingItem[];
  children: React.ReactNode;
}

export function NotesDocViewer({
  notes,
  currentNote,
  headings,
  children,
}: NotesDocViewerProps) {
  // Toggle TOC expansion for the current note
  const [isTocExpanded, setIsTocExpanded] = useState<boolean>(true);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const handleHeadingClick = (headingId: string) => {
    setActiveHeadingId(headingId);
    const targetEl = document.getElementById(`heading-${headingId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 20px 80px" }}>
      {/* Top Breadcrumb & Back Action */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-2)", fontFamily: "var(--mono)" }}>
          <Link href="/" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            首页
          </Link>
          <span>/</span>
          <Link href="/workflow" style={{ color: "var(--ink-2)", textDecoration: "none" }}>
            工作流
          </Link>
          <span>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>衍生笔记库</span>
        </div>

        <Link
          href="/workflow"
          style={{
            fontSize: "11.5px",
            fontFamily: "var(--mono)",
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          ← 返回工作流主页
        </Link>
      </div>

      {/* Main Workspace (Sidebar + Reader) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "24px",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          overflow: "hidden",
          minHeight: "78vh",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        {/* Left Sidebar: Real Documents + Interactive TOC Tree */}
        <aside
          style={{
            borderRight: "1px solid var(--line)",
            background: "var(--paper)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
            maxHeight: "82vh",
          }}
        >
          <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <span style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
                DOCUMENTS
              </span>
              <span style={{ fontSize: "9.5px", fontFamily: "var(--mono)", padding: "1px 5px", borderRadius: "3px", background: "var(--line)", color: "var(--ink-2)" }}>
                分类: 人工探索
              </span>
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              衍生笔记目录
            </h3>
          </div>

          {/* Real Notes Tree */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {notes.map((note, idx) => {
              const isSelected = note.id === currentNote.id;

              return (
                <div key={note.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {/* Note Header Item Card */}
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: isSelected ? "var(--card)" : "transparent",
                      border: `1.5px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "0 2px 8px rgba(194, 67, 27, 0.04)" : "none",
                    }}
                    onClick={() => {
                      if (isSelected) {
                        setIsTocExpanded(!isTocExpanded);
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "9px", fontFamily: "var(--mono)", color: isSelected ? "var(--accent)" : "var(--ink-3)" }}>
                        #{String(idx + 1).padStart(2, "0")} · {note.date || "2026-07-19"}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            fontSize: "9px",
                            fontFamily: "var(--mono)",
                            padding: "1px 5px",
                            borderRadius: "3px",
                            background: "var(--accent-soft)",
                            color: "var(--accent)",
                            fontWeight: 700,
                          }}
                        >
                          {note.badge || "实战复盘"}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "var(--ink-3)",
                              transform: isTocExpanded ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.2s ease",
                            }}
                          >
                            ▶
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/workflow/notes?id=${note.id}`}
                      style={{
                        fontSize: "12.5px",
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? "var(--ink)" : "var(--ink-2)",
                        lineHeight: 1.4,
                        textDecoration: "none",
                      }}
                      onClick={(e) => {
                        if (isSelected) {
                          e.preventDefault();
                          setIsTocExpanded(!isTocExpanded);
                        }
                      }}
                    >
                      {note.title}
                    </Link>
                  </div>

                  {/* Nested Table of Contents (TOC) Accordion for Active Note */}
                  {isSelected && headings.length > 0 && isTocExpanded && (
                    <div
                      style={{
                        marginLeft: "8px",
                        paddingLeft: "10px",
                        borderLeft: "2px solid var(--accent)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        marginTop: "2px",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ fontSize: "9.5px", fontFamily: "var(--mono)", color: "var(--ink-3)", padding: "4px 6px", fontWeight: 700, textTransform: "uppercase" }}>
                        文章大纲 · TOC
                      </div>
                      {headings.map((h) => {
                        const isHeadingActive = activeHeadingId === h.id;
                        const indentPx = h.level === 1 ? 4 : h.level === 2 ? 12 : 20;

                        return (
                          <button
                            key={h.id}
                            onClick={() => handleHeadingClick(h.id)}
                            style={{
                              textAlign: "left",
                              background: isHeadingActive ? "var(--card)" : "transparent",
                              border: "none",
                              borderRadius: "4px",
                              padding: `4px 8px 4px ${indentPx}px`,
                              fontSize: h.level === 1 ? "11.5px" : h.level === 2 ? "11px" : "10.5px",
                              fontWeight: h.level === 1 ? 700 : h.level === 2 ? 600 : 400,
                              color: isHeadingActive ? "var(--accent)" : h.level === 1 ? "var(--ink)" : "var(--ink-2)",
                              cursor: "pointer",
                              lineHeight: 1.4,
                              transition: "all 0.15s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "var(--accent)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isHeadingActive) {
                                e.currentTarget.style.color = h.level === 1 ? "var(--ink)" : "var(--ink-2)";
                              }
                            }}
                          >
                            <span style={{ fontSize: "8px", opacity: 0.5 }}>
                              {h.level === 1 ? "●" : h.level === 2 ? "○" : "–"}
                            </span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {h.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Reader Main Content Area */}
        <main style={{ padding: "28px 36px", overflowY: "auto", maxHeight: "82vh" }}>
          {/* Document Header */}
          <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--accent)", color: "#ffffff", fontWeight: 700 }}>
                {currentNote.category || "人工探索"}
              </span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                {currentNote.date}
              </span>
              <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>·</span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                Notion 知识库原生同步
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontFamily: "var(--serif)", fontWeight: 900, color: "var(--ink)", margin: 0, lineHeight: 1.35 }}>
              {currentNote.title}
            </h1>

            {currentNote.excerpt && (
              <p style={{ fontSize: "13.5px", color: "var(--ink-2)", margin: "12px 0 0", lineHeight: 1.6, background: "var(--paper)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                {currentNote.excerpt}
              </p>
            )}
          </div>

          {/* Rendered Notion Body Blocks */}
          <div style={{ fontSize: "14.5px", lineHeight: 1.8, color: "var(--ink)" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
