"use client";

import { useMemo, useState } from "react";
import { WorkflowCanvas, PRESETS } from "./WorkflowCanvas";

export type WorkflowItem = {
  id: string;
  section: "tools" | "websites" | "prompts";
  title: string;
  description?: string | null;
  emoji?: string | null;
  iconUrl?: string | null;
  badge?: string | null;
  siteUrl?: string | null;
  rating?: number | null;
  tags: string[];
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
    <div 
      className="site-stars"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        fontSize: "11px",
        color: "#ffd700"
      }}
    >
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f-${i}`}>★</span>
      ))}
      {half ? (
        <span>★</span>
      ) : null}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e-${i}`} style={{ opacity: 0.2 }}>★</span>
      ))}
      <span style={{ marginLeft: "4px", color: "var(--ink-2)", fontWeight: 500 }}>{r.toFixed(1)}</span>
    </div>
  );
}

function PromptCard({ title, zh, en }: { title: string; zh?: string | null; en?: string | null }) {
  const [open, setOpen] = useState(false);
  const [localLang, setLocalLang] = useState<"zh" | "en">("zh");
  const [copied, setCopied] = useState(false);

  const body = localLang === "zh" ? zh : en;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = localLang === "zh" ? zh : en;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className={`prompt-card-custom ${open ? "open" : ""}`}
      style={{
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: "12px",
        padding: "16px",
        width: "100%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* Header */}
      <div 
        onClick={() => setOpen(!open)} 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{title}</h4>
        <span style={{
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          fontSize: "9px",
          color: "var(--ink-2)"
        }}>▶</span>
      </div>

      {/* Body content */}
      {open && (
        <div style={{ marginTop: "12px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
          {/* Lang Tabs & Copy btn */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setLocalLang("zh"); }}
                style={{
                  padding: "2px 8px",
                  fontSize: "10px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  background: localLang === "zh" ? "var(--accent-pale)" : "transparent",
                  color: localLang === "zh" ? "var(--accent)" : "var(--ink-2)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s"
                }}
              >中</button>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setLocalLang("en"); }}
                style={{
                  padding: "2px 8px",
                  fontSize: "10px",
                  borderRadius: "4px",
                  border: "1px solid var(--border)",
                  background: localLang === "en" ? "var(--accent-pale)" : "transparent",
                  color: localLang === "en" ? "var(--accent)" : "var(--ink-2)",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s"
                }}
              >En</button>
            </div>
            <button 
              type="button"
              onClick={handleCopy}
              disabled={!body}
              style={{
                padding: "4px 10px",
                fontSize: "10px",
                borderRadius: "6px",
                background: copied ? "var(--green)" : "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                transition: "background-color 0.25s, transform 0.1s",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
              }}
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>

          {/* Text block */}
          <div style={{
            fontSize: "11.5px",
            color: "var(--ink-2)",
            lineHeight: 1.6,
            background: "var(--bg-2)",
            padding: "12px",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            maxHeight: "220px",
            overflowY: "auto",
            fontFamily: "var(--mono), monospace",
            border: "1px solid var(--border)"
          }}>
            {body || "（该语言版本暂无内容）"}
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkflowTabs(props: { items: WorkflowItem[] }) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>("preset-academic");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const items = useMemo(() => props.items, [props.items]);
  
  // Real-time Search and Filter
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(it => {
      return (
        it.title.toLowerCase().includes(q) ||
        (it.description ?? "").toLowerCase().includes(q) ||
        it.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [items, searchQuery]);

  // Categorize items
  const categorized = useMemo(() => {
    const out = { tools: [] as WorkflowItem[], websites: [] as WorkflowItem[], prompts: [] as WorkflowItem[] };
    for (const it of filteredItems) {
      if (it.section === "tools") out.tools.push(it);
      else if (it.section === "websites") out.websites.push(it);
      else if (it.section === "prompts") out.prompts.push(it);
    }
    out.tools.sort((a, b) => a.title.localeCompare(b.title));
    out.websites.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    out.prompts.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }, [filteredItems]);

  const activePreset = useMemo(() => {
    return PRESETS.find(p => p.id === activePresetId) || PRESETS[0];
  }, [activePresetId]);

  const activeNodes = activePreset.nodes;

  // Map Notion card IDs back to Node IDs for hover callbacks
  const cardNodeMap = useMemo(() => {
    const map: Record<string, string> = {};
    activeNodes.forEach(node => {
      const matchedItem = items.find(it => {
        const title = it.title.toLowerCase();
        return node.cardKeywords.some(kw => title.includes(kw.toLowerCase()));
      });
      if (matchedItem) {
        map[matchedItem.id] = node.id;
      }
    });
    return map;
  }, [items, activeNodes]);

  // Handle clicking a node in the canvas: scroll page down to card
  const handleNodeSelect = (nodeId: string | null, cardId: string | null) => {
    setActiveNodeId(nodeId);
    setActiveCardId(cardId);

    if (cardId) {
      const cardEl = document.getElementById(cardId);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
        // Apply gold ripple highlight
        cardEl.classList.add("flash-highlight");
        setTimeout(() => {
          cardEl.classList.remove("flash-highlight");
        }, 1500);
      }
    }
  };

  // Handle hovering a card in the toolbox: highlight matching node
  const handleCardMouseEnter = (cardId: string) => {
    setActiveCardId(cardId);
    const nodeId = cardNodeMap[cardId];
    if (nodeId) {
      setActiveNodeId(nodeId);
    }
  };

  const handleCardMouseLeave = () => {
    setActiveCardId(null);
    setActiveNodeId(null);
  };

  // Smooth scroll helper for vertical sections
  const scrollToSection = (sectionId: string) => {
    const sec = document.getElementById(sectionId);
    if (sec) {
      sec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Scope component local styling for highlight ripples and hover contrast */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash-glow {
          0% {
            box-shadow: 0 0 0 0px rgba(139, 115, 85, 0.8);
            border-color: var(--accent);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(139, 115, 85, 0.4);
            border-color: var(--accent);
          }
          100% {
            box-shadow: 0 0 0 0px rgba(139, 115, 85, 0);
          }
        }
        .flash-highlight {
          animation: flash-glow 1.5s cubic-bezier(0.25, 1, 0.5, 1);
          border-color: var(--accent) !important;
        }
        .tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .toolbox-card {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          position: relative;
          box-shadow: 0 4px 14px rgba(139, 115, 85, 0.05), 0 1px 2px rgba(0,0,0,0.02);
        }
        .toolbox-card:hover, .toolbox-card.highlight {
          border-color: var(--accent);
          background: var(--bg) !important;
          box-shadow: 0 8px 24px rgba(139, 115, 85, 0.12);
          transform: translateY(-4px);
        }
        .toolbox-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .toolbox-card-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          transition: color 0.3s;
        }
        .toolbox-card-badge {
          font-size: 9px;
          text-transform: uppercase;
          background: var(--bg-2);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--ink-2);
          transition: background-color 0.3s, color 0.3s;
        }
        .toolbox-card-desc {
          font-size: 11px;
          color: var(--ink-2);
          line-height: 1.5;
          min-height: 33px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s;
        }
        .toolbox-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          border-top: 1px solid var(--border);
          padding-top: 10px;
          color: var(--ink-2);
          transition: border-color 0.3s, color 0.3s;
        }
        .toolbox-card-link {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }
        .toolbox-card-link:hover {
          text-decoration: underline;
        }
        .toolbox-anchor-bar {
          background: var(--bg-2);
          border-bottom: 1px solid var(--border);
          padding: 10px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 60px;
          z-index: 8;
          transition: background-color 0.3s, border-color 0.3s;
        }
        .toolbox-anchor-btn {
          background: transparent;
          border: none;
          color: var(--ink-2);
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: color 0.2s;
        }
        .toolbox-anchor-btn:hover {
          color: var(--accent);
        }
        .toolbox-section-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 3px solid var(--accent);
          padding-left: 10px;
        }
        .toolbox-search-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px rgba(139, 115, 85, 0.12);
        }
        .empty-placeholder {
          text-align: center;
          padding: 30px;
          color: var(--ink-3);
          font-size: 12px;
          border: 1px dashed var(--border);
          border-radius: 8px;
          background: rgba(139, 115, 85, 0.02);
        }
      `}} />

      {/* ─── Upper Canvas Layer ─── */}
      <WorkflowCanvas 
        items={items} 
        activeNodeId={activeNodeId} 
        onNodeSelect={handleNodeSelect}
        isFocused={isFocused}
        onToggleFocus={() => setIsFocused(!isFocused)}
        activePresetId={activePresetId}
        onPresetChange={(id) => {
          setActivePresetId(id);
          setActiveNodeId(null);
          setActiveCardId(null);
        }}
      />

      {/* ─── Lower Toolbox Layer with Brass Separator (Hidden in Focus Mode) ─── */}
      {!isFocused && (
        <div 
          className="toolbox-panel"
          style={{
            background: "var(--toolbox-bg)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            zIndex: 5,
            transition: "background-color 0.3s, border-color 0.3s"
          }}
        >
          {/* Brass separating ruler */}
          <div 
            style={{
              position: "absolute",
              top: "calc(var(--divider-height) * -1)",
              left: 0,
              right: 0,
              height: "var(--divider-height)",
              background: "var(--divider-ruler)",
              boxShadow: "var(--divider-shadow)",
              zIndex: 10,
              transition: "background 0.3s, box-shadow 0.3s"
            }}
          />

          {/* Categories Quick Anchors and Search bar */}
          <div className="toolbox-anchor-bar">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <button className="toolbox-anchor-btn" onClick={() => scrollToSection("sec-tools")}>工具</button>
              <span style={{ color: "var(--border)", fontSize: "11px" }}>|</span>
              <button className="toolbox-anchor-btn" onClick={() => scrollToSection("sec-websites")}>网站</button>
              <span style={{ color: "var(--border)", fontSize: "11px" }}>|</span>
              <button className="toolbox-anchor-btn" onClick={() => scrollToSection("sec-prompts")}>提示词</button>
            </div>
            
            {/* Search Input Box */}
            <div className="search-input-container" style={{ position: "relative", width: "240px" }}>
              <input 
                type="text" 
                placeholder="搜索..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 12px 6px 28px",
                  fontSize: "11.5px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--ink)",
                  outline: "none",
                  transition: "all 0.25s"
                }}
                className="toolbox-search-input"
              />
              <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "var(--ink-3)", pointerEvents: "none" }}>🔍</span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: "var(--ink-2)",
                    padding: "2px"
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grouped Contents wrapper */}
          <div style={{ padding: "30px 48px", display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* Section 1: Tools */}
            <section id="sec-tools">
              <h3 className="toolbox-section-title">
                工具
                {searchQuery && <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 400, color: "var(--ink-2)" }}>({categorized.tools.length})</span>}
              </h3>
              {categorized.tools.length > 0 ? (
                <div className="tool-grid">
                  {categorized.tools.map(t => (
                    <div 
                      key={t.id} 
                      id={t.id}
                      className={`toolbox-card ${activeCardId === t.id ? "highlight" : ""}`}
                      onMouseEnter={() => handleCardMouseEnter(t.id)}
                      onMouseLeave={handleCardMouseLeave}
                      onClick={() => t.siteUrl && window.open(t.siteUrl, "_blank")}
                    >
                      <div className="toolbox-card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {t.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={t.iconUrl} alt="" style={{ width: "20px", height: "20px", borderRadius: "4px", objectFit: "cover" }} />
                          ) : t.emoji ? (
                            <span style={{ fontSize: "16px", lineHeight: 1 }}>{t.emoji}</span>
                          ) : null}
                          <span className="toolbox-card-title">{t.title}</span>
                        </div>
                        <span className="toolbox-card-badge">{t.badge || "工具"}</span>
                      </div>
                      <p className="toolbox-card-desc">{t.description || "暂无工具详细描述。"}</p>
                      <div className="toolbox-card-bottom">
                        {t.siteUrl ? (
                          <span className="toolbox-card-link">链接 ↗</span>
                        ) : (
                          <span style={{ color: "var(--ink-3)" }}>本地配置</span>
                        )}
                        {t.badge && t.badge.includes("核心") && (
                          <span style={{ color: "var(--accent)", fontWeight: 700 }}>核心推荐</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-placeholder">没有匹配的效率工具。</div>
              )}
            </section>

            {/* Section 2: Websites */}
            <section id="sec-websites">
              <h3 className="toolbox-section-title">
                网站
                {searchQuery && <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 400, color: "var(--ink-2)" }}>({categorized.websites.length})</span>}
              </h3>
              {categorized.websites.length > 0 ? (
                <div className="tool-grid">
                  {categorized.websites.map(w => (
                    <div 
                      key={w.id} 
                      id={w.id}
                      className={`toolbox-card ${activeCardId === w.id ? "highlight" : ""}`}
                      onMouseEnter={() => handleCardMouseEnter(w.id)}
                      onMouseLeave={handleCardMouseLeave}
                      onClick={() => w.siteUrl && window.open(w.siteUrl, "_blank")}
                    >
                      <div className="toolbox-card-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {w.iconUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={w.iconUrl} alt="" style={{ width: "20px", height: "20px", borderRadius: "4px", objectFit: "cover" }} />
                          ) : w.emoji ? (
                            <span style={{ fontSize: "16px", lineHeight: 1 }}>{w.emoji}</span>
                          ) : null}
                          <span className="toolbox-card-title">{w.title}</span>
                        </div>
                        <span className="toolbox-card-badge">网站</span>
                      </div>
                      <p className="toolbox-card-desc">{w.description || "暂无推荐网站详细描述。"}</p>
                      <div className="toolbox-card-bottom">
                        {w.siteUrl ? (
                          <span className="toolbox-card-link">{w.siteUrl.replace(/^https?:\/\//, "")} ↗</span>
                        ) : (
                          <span style={{ color: "var(--ink-3)" }}>空置链接</span>
                        )}
                        {stars(w.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-placeholder">没有匹配的网站推荐。</div>
              )}
            </section>

            {/* Section 3: Prompts */}
            <section id="sec-prompts">
              <h3 className="toolbox-section-title">
                提示词
                {searchQuery && <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 400, color: "var(--ink-2)" }}>({categorized.prompts.length})</span>}
              </h3>
              {categorized.prompts.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", maxWidth: "900px" }}>
                  {categorized.prompts.map(p => (
                    <div 
                      key={p.id}
                      id={p.id}
                      onMouseEnter={() => handleCardMouseEnter(p.id)}
                      onMouseLeave={handleCardMouseLeave}
                    >
                      <PromptCard 
                        title={p.title} 
                        zh={p.promptZh} 
                        en={p.promptEn} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-placeholder">没有匹配的 AI 提示词。</div>
              )}
            </section>

          </div>

        </div>
      )}
    </>
  );
}
