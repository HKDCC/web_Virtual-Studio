"use client";

import Link from "next/link";
import { FlowStep, ToolItem, SiteItem, PromptItem } from "@/lib/magazineData";

interface WorkflowSectionProps {
  flow?: FlowStep[];
  tools?: ToolItem[];
  sites?: SiteItem[];
  prompts?: PromptItem[];
}

export function WorkflowSection({ flow = [], tools = [], sites = [], prompts = [] }: WorkflowSectionProps) {
  return (
    <section id="workflow" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>02</b> / 链路层 · EFFICIENCY
        </p>
        <Link className="util" href="/workflow" title="查看 3D 星象仪与完整工作流">
          3D 星象仪与全部工作流 ↗
        </Link>
      </div>
      <h2 className="sec-title reveal">工作流与生产力星象仪</h2>
      <p className="sec-lede reveal">
        工具是思维的延伸，工作流是人机协同的实践结晶。基于 Three.js 呈现核心生产力要素的双链关系图谱。
      </p>

      {/* Featured Preset Banner */}
      <div
        className="flow-wrap sec-body reveal"
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--accent)",
          borderRadius: "14px",
          padding: "24px",
          marginBottom: "32px",
          boxShadow: "0 6px 20px rgba(194, 67, 27, 0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10.5px", fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: "4px", background: "var(--accent)", color: "#ffffff", fontWeight: 700 }}>
                ⭐ 代表性工作流
              </span>
              <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                3.1万字 · 两日交付 · 双模型自愈
              </span>
            </div>
            <h3 style={{ fontSize: "20px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              《Obviously Awesome》全书本地化与自动排版
            </h3>
          </div>

          <Link
            href="/workflow"
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
            进入 3D 星系聚焦 ↗
          </Link>
        </div>

        {/* 3 Phases Snapshot */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginTop: "16px" }}>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700 }}>PHASE 01 · 前置意图</div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>PDF 导入 + 正则去噪 + /grill-me 意图拷问</div>
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "#2D6A4F", fontWeight: 700 }}>PHASE 02 · 双轨精润</div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>Gemini 1M 初译 + DeepSeek 专家挑错 + 错题本自愈</div>
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "8px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "#2C5F8A", fontWeight: 700 }}>PHASE 03 · 算法交付</div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--ink)", marginTop: "2px" }}>Pandoc EPUB 编译 + Word COM 排版 + verify 校验</div>
          </div>
        </div>
      </div>

      {/* 经典工作流图解与工具箱 */}
      {flow.length > 0 && (
        <div className="flow-wrap sec-body reveal" style={{ marginTop: "24px" }}>
          <div className="flow" id="flow">
            {flow.map((s, i) => (
              <div key={i} className="step">
                <span className="no">{String(i + 1).padStart(2, "0")}</span>
                <p className="role">{s.role}</p>
                <h3>{s.t}</h3>
                <p className="s-desc">{s.d}</p>
              </div>
            ))}
          </div>
          <aside className="flow-aside">
            <p className="kicker">输入 → 输出</p>
            <p className="fa-big">arXiv 的论文，自动写成双语综述，落进 Notion 知识库。</p>
            <div className="fa-meta">
              <div>
                <span>触发方式</span>
                <span>定时 · RSS</span>
              </div>
              <div>
                <span>运行频率</span>
                <span>每日 08:00</span>
              </div>
              <div>
                <span>节点数量</span>
                <span>{flow.length}</span>
              </div>
              <div>
                <span>当前状态</span>
                <span>
                  <i className="dot"></i>运行中
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 工具箱：三个可复用的「行式列表」 */}
      <div className="toolbox reveal">
        <div className="tb">
          <h4>工具 · Tools</h4>
          <div id="toolList">
            {tools.map((t, i) => (
              <div key={i} className="tool-row">
                <div className="tr-top">
                  <h5>{t.t}</h5>
                  <span className="status">{t.s}</span>
                </div>
                <p>{t.d}</p>
                <a className="tr-link" href={t.url} target="_blank" rel="noopener noreferrer">
                  {t.url.replace(/^https?:\/\//, "")} ↗
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="tb">
          <h4>站点 · Sites</h4>
          <div id="siteList">
            {sites.map((s, i) => (
              <div key={i} className="site-row">
                <div className="sr-top">
                  <h5>{s.t}</h5>
                  <span className="sr-stars">
                    ★★★★★ <b style={{ color: "var(--accent)" }}>{s.r}</b>
                  </span>
                </div>
                <a
                  href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="domain"
                >
                  {s.url} ↗
                </a>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="tb">
          <h4>提示词 · Prompts</h4>
          <div id="promptList">
            {prompts.map((p, i) => (
              <details key={i} className="prompt">
                <summary>{p.t}</summary>
                <div className="prompt-body">{p.body}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

