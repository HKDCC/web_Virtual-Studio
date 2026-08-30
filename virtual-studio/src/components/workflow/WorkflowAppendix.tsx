"use client";

import Link from "next/link";
import { RawNoteItem } from "@/lib/graphEngine";

interface WorkflowAppendixProps {
  notes: RawNoteItem[];
}

export function WorkflowAppendix({ notes }: WorkflowAppendixProps) {
  return (
    <section id="workflow-appendix" style={{ marginTop: "60px", marginBottom: "40px", borderTop: "2px solid var(--line)", paddingTop: "40px" }}>
      {/* Appendix Masthead */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "12px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          APPENDIX · 实践复盘与产出附录
        </div>
        <h2 style={{ fontSize: "22px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "4px 0 6px" }}>
          工作流衍生智识资产
        </h2>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", margin: 0, maxWidth: "680px", lineHeight: 1.6 }}>
          工具和流程只是脚手架，沉淀出的实战经验、避坑错题本与深度复盘才是真正的价值资产。以下为工作流运行过程中产生的代表性笔记记录：
        </p>
      </div>

      {/* Highlight Featured Project: Obviously Awesome */}
      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--accent)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
          position: "relative",
          boxShadow: "0 6px 20px rgba(194, 67, 27, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--accent)", color: "#ffffff", fontWeight: 700 }}>
                ⭐ 代表性实战复盘
              </span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                2026-07-19 · 耗时 2 天
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Obviously Awesome 本地化项目笔记
            </h3>
          </div>

          <Link
            href="/p/3a11d5da-bc25-80b2-8e28-e4f51fcb5e76"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 16px",
              fontSize: "12px",
              fontFamily: "var(--mono)",
              fontWeight: 700,
              borderRadius: "6px",
              background: "var(--accent)",
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            阅读完整复盘 ↗
          </Link>
        </div>

        <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6, margin: "0 0 16px" }}>
          全书英文原版 31,136 单词，两日内完成高品质出版级汉化与自动排版。详细拆解为什么初译选择 Gemini 3.5 Flash 100万 Token 原生大窗口、审校阶段为何引入 DeepSeek V4 Pro 专家模式挑错，以及 Agent 错题本自愈机制如何彻底替代传统表格翻译。
        </p>

        {/* 3 Core Highlights Badges */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "10px 14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", marginBottom: "2px" }}>Q1: Agent 自愈机制</div>
            <div style={{ fontSize: "11px", color: "var(--ink-2)", lineHeight: 1.4 }}>AGENTS.md 固化习惯 + walkthrough.md 避坑错题本</div>
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "10px 14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#2D6A4F", marginBottom: "2px" }}>Q2: Gemini 3.5 Flash</div>
            <div style={{ fontSize: "11px", color: "var(--ink-2)", lineHeight: 1.4 }}>100万 Token 针大海测试 100% 精准召回，全书不丢术语</div>
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "10px 14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#2C5F8A", marginBottom: "2px" }}>Q3: DeepSeek V4 Pro</div>
            <div style={{ fontSize: "11px", color: "var(--ink-2)", lineHeight: 1.4 }}>MRCR 多范围上下文检索 85% 召回率，专家级润色挑错</div>
          </div>
        </div>
      </div>

      {/* Other Related Notes List from Notion */}
      {notes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {notes
            .filter((n) => !n.title.includes("Obviously Awesome"))
            .slice(0, 6)
            .map((note) => (
              <Link
                key={note.id}
                href={note.htmlContent || `/p/${note.id}`}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: "10px",
                  padding: "16px",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--line)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                  <span>{note.category || "智识笔记"}</span>
                  {note.date && <span>{note.date}</span>}
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.4 }}>
                  {note.title}
                </h4>
                {note.excerpt && (
                  <p style={{ fontSize: "11.5px", color: "var(--ink-2)", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {note.excerpt}
                  </p>
                )}
              </Link>
            ))}
        </div>
      )}
    </section>
  );
}
