"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type WorkflowItem = {
  id: string;
  section: "tools" | "websites" | "setup" | "prompts";
  title: string;
  description?: string | null;
  emoji?: string | null;
  iconUrl?: string | null;
  badge?: string | null;

  // websites
  siteUrl?: string | null;
  rating?: number | null;
  tags: string[];

  // setup gallery
  scene?: string | null;
  params?: string | null;

  // prompts
  promptZh?: string | null;
  promptEn?: string | null;
};

function stars(rating: number | null | undefined) {
  if (!rating) return null;
  const r = Math.max(0, Math.min(5, rating));
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="site-stars">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} className="star filled">
          ★
        </span>
      ))}
      {half ? (
        <span className="star half">
          ★
        </span>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} className="star">
          ★
        </span>
      ))}
      <span className="star-num">{r.toFixed(1)}</span>
    </div>
  );
}

function PromptCard(props: { title: string; id: string; zh?: string | null; en?: string | null; lang: "zh" | "en" }) {
  const [open, setOpen] = useState(false);
  const body = props.lang === "zh" ? props.zh : props.en;

  return (
    <Link href={`/p/${props.id}`} className={`prompt-card ${open ? "open" : ""}`}>
      <div className="prompt-card-head" onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}>
        <span className="prompt-title">{props.title}</span>
        <span className="prompt-arrow">
          ▶
        </span>
      </div>
      <div className="prompt-body">{body ?? "（该条 Prompt 未填写内容）"}</div>
    </Link>
  );
}

function SetupGallery(props: { items: WorkflowItem[] }) {
  const [idx, setIdx] = useState(0);
  const current = props.items[idx];

  if (!current) return null;

  return (
    <div style={{ padding: "40px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          borderRadius: "var(--r-lg)",
          overflow: "hidden",
          border: "1px solid var(--bg-3)",
          background: "var(--bg-2)",
        }}
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", padding: "20px 24px 0" }}>
          SETUP GALLERY
        </div>

        {/* Main display */}
        <Link href={`/p/${current.id}`} style={{ display: "block", textDecoration: "none" }}>
          <div className="gallery-main" style={{ position: "relative", height: 320, background: "var(--bg-3)", overflow: "hidden" }}>
            {current.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.iconUrl}
                alt={current.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48 }}>
                {current.emoji ?? "📦"}
              </div>
            )}
            <div className="gallery-scene" style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 24px 20px",
              background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
              color: "white",
              fontFamily: "var(--mono)",
              fontSize: 12,
            }}>
              {current.scene || current.title}
            </div>
          </div>
        </Link>

        {/* Params display */}
        {current.params ? (
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--bg-3)" }}>
            <pre style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.8, margin: 0 }}>
              {current.params}
            </pre>
          </div>
        ) : null}

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid var(--bg-3)" }}>
          <div className="gallery-dots" style={{ display: "flex", gap: 8 }}>
            {props.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 20 : 8,
                  height: 8,
                  borderRadius: 3,
                  background: i === idx ? "var(--accent)" : "var(--bg-3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "var(--spring)",
                  padding: 0,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setIdx((i) => (i - 1 + props.items.length) % props.items.length)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid var(--bg-3)",
                background: "var(--bg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "var(--spring)",
              }}
            >
              ←
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % props.items.length)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid var(--bg-3)",
                background: "var(--bg)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "var(--spring)",
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="gallery-thumbs" style={{ display: "flex", gap: 12, padding: "0 24px 20px", overflowX: "auto" }}>
          {props.items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIdx(i)}
              className={`gallery-thumb ${i === idx ? "active" : ""}`}
              style={{
                flexShrink: 0,
                width: 64,
                height: 64,
                borderRadius: 8,
                border: i === idx ? "2px solid var(--accent)" : "2px solid var(--bg-3)",
                background: "var(--bg)",
                cursor: "pointer",
                overflow: "hidden",
                transition: "var(--spring)",
              }}
            >
              {item.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.iconUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 24 }}>
                  {item.emoji ?? "📦"}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkflowTabs(props: { items: WorkflowItem[] }) {
  const [tab, setTab] = useState<WorkflowItem["section"]>("tools");
  const [lang, setLang] = useState<"zh" | "en">("zh");

  const items = useMemo(() => props.items, [props.items]);
  const bySection = useMemo(() => {
    const out: Record<WorkflowItem["section"], WorkflowItem[]> = { tools: [], websites: [], setup: [], prompts: [] };
    for (const it of items) out[it.section].push(it);
    out.tools.sort((a, b) => a.title.localeCompare(b.title));
    out.websites.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    out.setup.sort((a, b) => a.title.localeCompare(b.title));
    out.prompts.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [items]);

  return (
    <>
      <div className="workflow-tabs">
        <button type="button" onClick={() => setTab("tools")} className={`wf-tab ${tab === "tools" ? "active" : ""}`}>
          效率工具
        </button>
        <button type="button" onClick={() => setTab("websites")} className={`wf-tab ${tab === "websites" ? "active" : ""}`}>
          网站推荐
        </button>
        <button type="button" onClick={() => setTab("setup")} className={`wf-tab ${tab === "setup" ? "active" : ""}`}>
          装备清单
        </button>
        <button type="button" onClick={() => setTab("prompts")} className={`wf-tab ${tab === "prompts" ? "active" : ""}`}>
          AI 提示词库
        </button>
      </div>

      {tab === "tools" ? (
        <div className="wf-panel active" id="wf-tools">
          <div className="tool-list">
            {bySection.tools.map((t) =>
              t.siteUrl ? (
                <a
                  key={t.id}
                  href={t.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="tool-item"
                >
                  <div className="tool-icon" style={{ background: "var(--accent-pale)" }}>
                    {t.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.iconUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span>{t.emoji ?? "🧩"}</span>
                    )}
                  </div>
                  <div className="tool-info">
                    <div className="tool-name">{t.title}</div>
                    {t.description ? <div className="tool-desc">{t.description}</div> : null}
                  </div>
                  {t.badge ? (
                    <span className={`tool-badge ${t.badge.includes("核心") ? "rec" : ""}`}>{t.badge}</span>
                  ) : null}
                </a>
              ) : (
                <div key={t.id} className="tool-item">
                  <div className="tool-icon" style={{ background: "var(--accent-pale)" }}>
                    {t.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.iconUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span>{t.emoji ?? "🧩"}</span>
                    )}
                  </div>
                  <div className="tool-info">
                    <div className="tool-name">{t.title}</div>
                    {t.description ? <div className="tool-desc">{t.description}</div> : null}
                  </div>
                  {t.badge ? (
                    <span className={`tool-badge ${t.badge.includes("核心") ? "rec" : ""}`}>{t.badge}</span>
                  ) : null}
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      {tab === "websites" ? (
        <div className="wf-panel active" id="wf-websites">
          <div className="site-list">
            {bySection.websites.map((w) => (
              <div key={w.id} className="site-item">
                <div className="site-favicon">{w.emoji ?? "🔗"}</div>
                <div className="site-info">
                  <div className="site-top">
                    <span className="site-name">{w.title}</span>
                    {w.siteUrl ? (
                      <a
                        href={w.siteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="site-url"
                      >
                        {w.siteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : null}
                  </div>
                  {w.description ? <div className="site-desc">{w.description}</div> : null}
                  <div className="site-bottom">
                    <div className="site-tags">
                      {w.tags.slice(0, 6).map((t) => (
                        <span key={t} className="book-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    {stars(w.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "setup" ? (
        <SetupGallery items={bySection.setup} />
      ) : null}

      {tab === "prompts" ? (
        <div className="wf-panel active" id="wf-prompts">
          <div className="prompt-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 560 }}>
              按使用场景分类的 Prompt 集合，每条提供中英文双版本。点击卡片可展开完整提示词，点击标题箭头收起。
            </p>
            <div className="lang-toggle">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`lang-btn ${lang === "zh" ? "active" : ""}`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
              >
                English
              </button>
            </div>
          </div>

          <div className="prompt-grid" style={{ maxWidth: 900 }}>
            {bySection.prompts.map((p) => (
              <PromptCard key={p.id} id={p.id} title={p.title} zh={p.promptZh} en={p.promptEn} lang={lang} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
