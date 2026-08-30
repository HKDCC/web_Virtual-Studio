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

      {/* 真实实战工作流卡片 */}
      <div
        className="sec-body reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Obviously Awesome 本地化实战卡片 */}
        <div
          style={{
            background: "var(--card)",
            border: "1.5px solid var(--accent)",
            borderRadius: "12px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
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
            <h3 style={{ fontSize: "18px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
              《Obviously Awesome》全书本地化与自动排版
            </h3>
            <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
              两日交付 3.1 万字。大上下文初译、双模型专家挑错、错题本自愈排版全闭环。
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--line)" }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", padding: "3px 8px", borderRadius: "4px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 1: 正则去噪 & /grill-me 拷问协议
            </span>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", padding: "3px 8px", borderRadius: "4px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 2: Gemini 1M 初译 + DeepSeek 专家审校
            </span>
            <span style={{ fontSize: "11px", fontFamily: "var(--mono)", padding: "3px 8px", borderRadius: "4px", background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
              Phase 3: Pandoc 编译 + verify.py 终验
            </span>
          </div>

          <Link
            href="/workflow"
            style={{
              fontSize: "12px",
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
      </div>
    </section>
  );
}
