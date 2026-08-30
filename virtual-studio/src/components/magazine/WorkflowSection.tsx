"use client";

import Link from "next/link";

export function WorkflowSection() {
  return (
    <section id="workflow" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>02</b> / 链路层 · WORKFLOW
        </p>
        <Link className="util" href="/workflow" title="查看全部工作流">
          查看全部 ↗
        </Link>
      </div>
      <h2 className="sec-title reveal">工作流</h2>
      <p className="sec-lede reveal">工具是思维的延伸</p>

      {/* 2 代表性工作流卡片网格 */}
      <div
        className="sec-body reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Card 1: Obviously Awesome 本地化 */}
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--accent)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 4px 16px rgba(194, 67, 27, 0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--accent)", color: "#ffffff", fontWeight: 700 }}>
              实战标杆 · 3.1万字
            </span>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
              学术本地化
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: "17px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
              《Obviously Awesome》全书本地化与自动排版
            </h3>
            <p style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
              两日交付 3.1 万字。大上下文初译、双模型专家挑错、错题本自愈排版全闭环。
            </p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--line)" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 1: 正则去噪 & /grill-me
            </span>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 2: Gemini + DeepSeek
            </span>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 3: Pandoc 自动排版
            </span>
          </div>

          <Link
            href="/workflow"
            style={{
              fontSize: "11.5px",
              fontFamily: "var(--mono)",
              fontWeight: 700,
              color: "var(--accent)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "4px",
            }}
          >
            查看工作流详情 ➔
          </Link>
        </div>

        {/* Card 2: 占位工作流（全栈代码重构） */}
        <div
          style={{
            background: "var(--card)",
            border: "1px dashed var(--line)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--line)", color: "var(--ink-2)", fontWeight: 600 }}>
              占位 · 规划中
            </span>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
              代码工程
            </span>
          </div>

          <div>
            <h3 style={{ fontSize: "17px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
              全栈代码重构与端到端架构自愈
            </h3>
            <p style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
              从架构意图拷问到全自动化单元测试，智能体闭环解决复杂技术债务。
            </p>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--line)" }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-3)" }}>
              Phase 1: AST 分析扫描
            </span>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-3)" }}>
              Phase 2: Claude + DeepSeek
            </span>
            <span style={{ fontSize: "10px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "3px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-3)" }}>
              Phase 3: 严格类型自愈
            </span>
          </div>

          <Link
            href="/workflow"
            style={{
              fontSize: "11.5px",
              fontFamily: "var(--mono)",
              fontWeight: 600,
              color: "var(--ink-2)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "4px",
            }}
          >
            进入工作流二级页 ➔
          </Link>
        </div>
      </div>

      {/* 全局关系图谱快速入口卡片 */}
      <div
        className="sec-body reveal"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
            全局关系图谱
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--ink-2)", marginTop: "2px" }}>
            呈现生产力工具、大模型、提示词与工作流之间的双向关联网络。
          </div>
        </div>

        <Link
          href="/workflow"
          style={{
            padding: "6px 16px",
            fontSize: "11.5px",
            fontFamily: "var(--mono)",
            fontWeight: 700,
            borderRadius: "6px",
            background: "var(--ink)",
            color: "var(--paper)",
            textDecoration: "none",
          }}
        >
          探索关系图谱 ➔
        </Link>
      </div>
    </section>
  );
}

