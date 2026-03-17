"use client";

import { useMemo, useState } from "react";

export type WorkflowItem = {
  id: string;
  section: "tools" | "websites" | "setup" | "prompts";
  title: string;
  description?: string | null;
  emoji?: string | null;
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

function wfTab(active: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    padding: "8px 20px",
    cursor: "pointer",
    color: active ? "var(--accent)" : "var(--ink-2)",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    transition: "var(--transition)",
    fontWeight: active ? 500 : 400,
    marginBottom: -1,
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
  };
}

function tagStyle(): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 9,
    padding: "2px 7px",
    borderRadius: 4,
    background: "var(--accent-pale)",
    color: "var(--accent)",
    letterSpacing: "0.05em",
  };
}

function stars(rating: number | null | undefined) {
  if (!rating) return null;
  const r = Math.max(0, Math.min(5, rating));
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`} style={{ fontSize: 14, color: "#E8A020" }}>
          ★
        </span>
      ))}
      {half ? (
        <span style={{ fontSize: 14, color: "#E8A020", opacity: 0.5 }}>
          ★
        </span>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} style={{ fontSize: 14, color: "var(--bg-3)" }}>
          ★
        </span>
      ))}
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", marginLeft: 6 }}>{r.toFixed(1)}</span>
    </div>
  );
}

function PromptCard(props: { title: string; zh?: string | null; en?: string | null; lang: "zh" | "en" }) {
  const [open, setOpen] = useState(false);
  const body = props.lang === "zh" ? props.zh : props.en;

  return (
    <div
      onClick={() => setOpen((v) => !v)}
      style={{
        border: "1px solid var(--bg-3)",
        borderRadius: "var(--r)",
        overflow: "hidden",
        cursor: "pointer",
        background: "var(--bg)",
        transition: "var(--transition)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{props.title}</span>
        <span style={{ fontSize: 10, color: "var(--ink-3)", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "var(--spring)" }}>
          ▶
        </span>
      </div>
      {open ? (
        <div
          style={{
            padding: "16px 18px",
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--ink-2)",
            lineHeight: 1.9,
            background: "var(--bg-2)",
            whiteSpace: "pre-wrap",
          }}
        >
          {body ?? "（该条 Prompt 未填写内容）"}
        </div>
      ) : null}
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
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "24px 48px 0",
          maxWidth: 1200,
          margin: "0 auto",
          borderBottom: "1px solid var(--bg-3)",
          overflowX: "auto",
        }}
      >
        <button type="button" onClick={() => setTab("tools")} style={wfTab(tab === "tools")}>
          效率工具
        </button>
        <button type="button" onClick={() => setTab("websites")} style={wfTab(tab === "websites")}>
          网站推荐
        </button>
        <button type="button" onClick={() => setTab("setup")} style={wfTab(tab === "setup")}>
          装备清单
        </button>
        <button type="button" onClick={() => setTab("prompts")} style={wfTab(tab === "prompts")}>
          AI 提示词库
        </button>
      </div>

      {tab === "tools" ? (
        <div style={{ padding: "40px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bySection.tools.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 24px",
                  border: "1px solid var(--bg-3)",
                  borderRadius: "var(--r)",
                  background: "var(--bg)",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-pale)", fontSize: 22 }}>
                  {t.emoji ?? "🧩"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{t.title}</div>
                  {t.description ? <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{t.description}</div> : null}
                </div>
                {t.badge ? (
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "4px 10px", borderRadius: 20, border: "1px solid var(--bg-3)", color: "var(--ink-2)" }}>
                    {t.badge}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "websites" ? (
        <div style={{ padding: "40px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 800 }}>
            {bySection.websites.map((w) => (
              <div
                key={w.id}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "20px 24px",
                  border: "1px solid var(--bg-3)",
                  borderRadius: "var(--r)",
                  background: "var(--bg)",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {w.emoji ?? "🔗"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{w.title}</span>
                    {w.siteUrl ? (
                      <a
                        href={w.siteUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)", textDecoration: "none", opacity: 0.7 }}
                      >
                        {w.siteUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : null}
                  </div>
                  {w.description ? <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 12 }}>{w.description}</div> : null}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {w.tags.slice(0, 6).map((t) => (
                        <span key={t} style={tagStyle()}>
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
        <div style={{ padding: "40px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              border: "1px solid var(--bg-3)",
              background: "var(--bg-2)",
              padding: 24,
              maxWidth: 900,
            }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.1em", marginBottom: 10 }}>
              SETUP GALLERY（来自 Workflow DB 的 Scene/Params）
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bySection.setup.map((s) => (
                <div key={s.id} style={{ padding: 14, borderRadius: 12, background: "var(--bg)", border: "1px solid var(--bg-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {s.emoji ?? "📦"} {s.title}
                    </div>
                    {s.scene ? <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{s.scene}</div> : null}
                  </div>
                  {s.params ? <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-2)", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{s.params}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "prompts" ? (
        <div style={{ padding: "40px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 560 }}>
              按使用场景分类的 Prompt 集合，每条提供中英文双版本。点击卡片可展开完整提示词。
            </p>
            <div style={{ display: "flex", border: "1px solid var(--bg-3)", borderRadius: 8, overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => setLang("zh")}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  border: "none",
                  background: lang === "zh" ? "var(--accent)" : "transparent",
                  color: lang === "zh" ? "white" : "var(--ink-2)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  border: "none",
                  background: lang === "en" ? "var(--accent)" : "transparent",
                  color: lang === "en" ? "white" : "var(--ink-2)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                English
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 900 }}>
            {bySection.prompts.map((p) => (
              <PromptCard key={p.id} title={p.title} zh={p.promptZh} en={p.promptEn} lang={lang} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

