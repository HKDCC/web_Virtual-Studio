"use client";

import { FlowStep, ToolItem, SiteItem, PromptItem } from "@/lib/magazineData";

interface WorkflowSectionProps {
  flow: FlowStep[];
  tools: ToolItem[];
  sites: SiteItem[];
  prompts: PromptItem[];
}

export function WorkflowSection({ flow, tools, sites, prompts }: WorkflowSectionProps) {
  return (
    <section id="workflow" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>03</b> / 效率层 · EFFICIENCY
        </p>
        <a className="util" href="/workflow" title="查看完整工作流">
          全部工作流 ↗
        </a>
      </div>
      <h2 className="sec-title reveal">工作流</h2>
      <p className="sec-lede reveal">工具是思维的延伸。以「学术翻译」为例，一条完整的自动化流水线——</p>
      <div className="flow-wrap sec-body reveal">
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
