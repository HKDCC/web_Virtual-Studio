"use client";

import Link from "next/link";
import { RawNoteItem } from "@/lib/graphEngine";

interface WorkflowAppendixProps {
  notes: RawNoteItem[];
}

// 8 Defined Notes (1 Live Notion note + 7 Structured Placeholders for 人工探索)
const APPENDIX_NOTES_8 = [
  {
    id: "e774b57f-e15a-83e7-b633-818781fe9a41",
    title: "AI agent如何在2天内从0到1产出出版社级别的译文？",
    date: "2026-07-19",
    category: "人工探索",
    badge: "实战复盘",
    isLive: true,
    excerpt: "全书英文原版 31,136 单词，两日内完成高品质出版级汉化与自动排版。详细拆解为什么初译选择 Gemini 3.5 Flash 100万 Token 原生大窗口、审校阶段为何引入 DeepSeek V4 Pro 专家模式挑错，以及 Agent 错题本自愈机制如何彻底替代传统表格翻译。",
    tags: ["大模型翻译", "Agent自愈", "Pandoc排版"],
  },
  {
    id: "placeholder-2",
    title: "三维力导向图谱在 Next.js 与 Cloudflare 边缘环境的渲染优化",
    date: "2026-08-15",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "探讨 WebGL 内存生命周期、动态 LOD 视锥体裁剪与 Serverless 边缘渲染的性能平衡策略。",
    tags: ["Three.js", "WebGL", "性能优化"],
  },
  {
    id: "placeholder-3",
    title: "基于 AST 与 Agent 错题本的自动化代码重构实践",
    date: "2026-08-10",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "解析大型 TypeScript 项目重构中的类型自愈、AST 语法树扫描与自动化单元回归校验方案。",
    tags: ["AST分析", "代码重构", "自动化测试"],
  },
  {
    id: "placeholder-4",
    title: "从零构建百万 Token 长上下文研读流水线",
    date: "2026-08-02",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "对比 Gemini 1M 与 Claude 3.7 在长文档结构抽取与专业术语召回率中的实战表现。",
    tags: ["长上下文", "信息抽取", "论文综述"],
  },
  {
    id: "placeholder-5",
    title: "AI 辅助技术文档排版：Pandoc 与 Word COM 自动化集成",
    date: "2026-07-28",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "探索从 Markdown 到专业出版物版式的全自动编译、样式注入与校验脚本闭环。",
    tags: ["Pandoc", "文档排版", "脚本自动化"],
  },
  {
    id: "placeholder-6",
    title: "生产力工作流的度数中心度与关联网络建模",
    date: "2026-07-22",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "如何通过图论算法量化高频工具的枢纽权重，并构建自适应工作流依赖网络。",
    tags: ["图论算法", "中心度", "网络建模"],
  },
  {
    id: "placeholder-7",
    title: "大模型意图拷问协议 /grill-me 的实战设计与推导",
    date: "2026-07-15",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "通过结构化双向对话消除需求模糊性与架构设计分歧的高效 prompt 工程范式。",
    tags: ["Prompt工程", "意图对齐", "需求分析"],
  },
  {
    id: "placeholder-8",
    title: "多模型协同纠错机制在学术本地化中的应用",
    date: "2026-07-08",
    category: "人工探索",
    badge: "规划中",
    isLive: false,
    excerpt: "设计双轨模型互审流水线与术语一致性校验的算法闭环，解决翻译幻觉问题。",
    tags: ["模型互审", "学术翻译", "一致性校验"],
  },
];

export function WorkflowAppendix(_props?: WorkflowAppendixProps) {
  void _props;
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

      {/* 8 Note Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {APPENDIX_NOTES_8.map((note) => {
          const targetUrl = note.isLive ? `/workflow/notes?id=${note.id}` : `/workflow/notes?id=${note.id}`;

          return (
            <Link
              key={note.id}
              href={targetUrl}
              style={{
                background: "var(--card)",
                border: note.isLive ? "1.5px solid var(--accent)" : "1px solid var(--line)",
                borderRadius: "10px",
                padding: "16px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "all 0.2s ease",
                boxShadow: note.isLive ? "0 4px 14px rgba(194, 67, 27, 0.05)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = note.isLive ? "var(--accent)" : "var(--line)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Header meta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "9.5px",
                    fontFamily: "var(--mono)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    background: note.isLive ? "var(--accent)" : "var(--line)",
                    color: note.isLive ? "#ffffff" : "var(--ink-2)",
                    fontWeight: 700,
                  }}
                >
                  {note.badge}
                </span>
                <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                  {note.date}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", margin: 0, lineHeight: 1.45 }}>
                {note.title}
              </h3>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: "11.5px",
                  color: "var(--ink-2)",
                  margin: 0,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {note.excerpt}
              </p>

              {/* Tags & Action Link */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--line)" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {note.tags.slice(0, 2).map((t) => (
                    <span key={t} style={{ fontSize: "9.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                      #{t}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 600 }}>
                  {note.isLive ? "阅读文档 ➔" : "查看详情 ➔"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
