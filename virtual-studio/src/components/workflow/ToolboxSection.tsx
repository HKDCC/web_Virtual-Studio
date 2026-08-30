"use client";

import { useState, useMemo } from "react";
import { GraphNode } from "@/lib/graphEngine";

interface ToolboxSectionProps {
  nodes: GraphNode[];
  onFilterWorkflowsByEntity: (entityName: string) => void;
}

function PromptItemCard({ node }: { node: GraphNode }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [copied, setCopied] = useState(false);

  const text = lang === "zh" ? node.promptZh : node.promptEn;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            {node.name}
          </h4>
          <p style={{ fontSize: "11px", color: "var(--ink-2)", margin: "4px 0 0" }}>
            {node.description}
          </p>
        </div>
        <span
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            fontSize: "10px",
            color: "var(--ink-2)",
          }}
        >
          ▶
        </span>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setLang("zh")}
                style={{
                  padding: "2px 8px",
                  fontSize: "10px",
                  fontFamily: "var(--mono)",
                  borderRadius: "4px",
                  border: "1px solid var(--line)",
                  background: lang === "zh" ? "var(--accent)" : "transparent",
                  color: lang === "zh" ? "#ffffff" : "var(--ink-2)",
                  cursor: "pointer",
                }}
              >
                中
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                style={{
                  padding: "2px 8px",
                  fontSize: "10px",
                  fontFamily: "var(--mono)",
                  borderRadius: "4px",
                  border: "1px solid var(--line)",
                  background: lang === "en" ? "var(--accent)" : "transparent",
                  color: lang === "en" ? "#ffffff" : "var(--ink-2)",
                  cursor: "pointer",
                }}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              style={{
                padding: "3px 10px",
                fontSize: "11px",
                fontFamily: "var(--mono)",
                borderRadius: "5px",
                background: copied ? "#2D6A4F" : "var(--accent)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? "✓ 已复制" : "复制"}
            </button>
          </div>

          <pre
            style={{
              fontSize: "11.5px",
              color: "var(--ink)",
              lineHeight: 1.6,
              background: "var(--paper)",
              padding: "12px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              maxHeight: "200px",
              overflowY: "auto",
              fontFamily: "var(--mono)",
              border: "1px solid var(--line)",
              margin: 0,
            }}
          >
            {text || "（暂无该语言版本提示词）"}
          </pre>
        </div>
      )}
    </div>
  );
}

export function ToolboxSection({
  nodes,
  onFilterWorkflowsByEntity,
}: ToolboxSectionProps) {
  const [activeTab, setActiveTab] = useState<"tools" | "models" | "websites" | "prompts">("tools");
  const [sortBy, setSortBy] = useState<"frequency" | "name" | "rating">("frequency");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Categorize nodes
  const nonWorkflowNodes = useMemo(() => {
    return nodes.filter((n) => n.type !== "workflow");
  }, [nodes]);

  const currentNodes = useMemo(() => {
    let list = nonWorkflowNodes.filter((n) => {
      if (activeTab === "tools") return n.type === "tool" || n.type === "script";
      if (activeTab === "models") return n.type === "model";
      if (activeTab === "websites") return n.type === "website";
      if (activeTab === "prompts") return n.type === "prompt";
      return true;
    });

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    return list.sort((a, b) => {
      if (sortBy === "frequency") return b.workflowCount - a.workflowCount;
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [nonWorkflowNodes, activeTab, searchFilter, sortBy]);

  return (
    <section style={{ marginTop: "44px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ELEMENTS
          </div>
          <h2 style={{ fontSize: "20px", fontFamily: "var(--serif)", fontWeight: 700, color: "var(--ink)", margin: "4px 0 0" }}>
            工具与模型列表
          </h2>
        </div>

        {/* Sort selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-2)" }}>排序方式:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              padding: "4px 8px",
              fontSize: "11.5px",
              fontFamily: "var(--mono)",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--card)",
              color: "var(--ink)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="frequency">按参与工作流频次</option>
            <option value="rating">按评分</option>
            <option value="name">按名称字母序</option>
          </select>
        </div>
      </div>

      {/* Tabs & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--line)",
          paddingBottom: "12px",
          marginBottom: "20px",
        }}
      >
        {/* Element Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { key: "tools", label: "效率工具与脚本", count: nonWorkflowNodes.filter((n) => n.type === "tool" || n.type === "script").length },
            { key: "models", label: "AI 模型", count: nonWorkflowNodes.filter((n) => n.type === "model").length },
            { key: "websites", label: "精选网站", count: nonWorkflowNodes.filter((n) => n.type === "website").length },
            { key: "prompts", label: "提示词库", count: nonWorkflowNodes.filter((n) => n.type === "prompt").length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                style={{
                  padding: "5px 12px",
                  fontSize: "11.5px",
                  fontFamily: "var(--mono)",
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: "6px",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--line)"}`,
                  background: isActive ? "var(--accent-soft)" : "var(--card)",
                  color: isActive ? "var(--accent)" : "var(--ink-2)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: "180px" }}>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px 6px 26px",
              fontSize: "11.5px",
              borderRadius: "6px",
              border: "1px solid var(--line)",
              background: "var(--paper)",
              color: "var(--ink)",
              outline: "none",
            }}
          />
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === "prompts" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {currentNodes.map((node) => (
            <PromptItemCard key={node.id} node={node} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {currentNodes.map((node) => (
            <div
              key={node.id}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line)";
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {node.iconUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={node.iconUrl} alt="" style={{ width: "22px", height: "22px", borderRadius: "4px", objectFit: "cover" }} />
                  ) : (
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: node.color }} />
                  )}
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{node.name}</span>
                </div>
                {node.badge && (
                  <span style={{ fontSize: "9.5px", fontFamily: "var(--mono)", padding: "2px 6px", borderRadius: "4px", background: "var(--line)", color: "var(--ink-2)" }}>
                    {node.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: "11.5px", color: "var(--ink-2)", margin: 0, lineHeight: 1.5, minHeight: "34px" }}>
                {node.description}
              </p>

              {/* Bottom bar with Frequency Badge & Link */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "10px", marginTop: "auto" }}>
                {node.workflowCount > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterWorkflowsByEntity(node.name);
                      window.scrollTo({ top: 580, behavior: "smooth" });
                    }}
                    style={{
                      fontSize: "10.5px",
                      fontFamily: "var(--mono)",
                      color: "var(--accent)",
                      fontWeight: 700,
                      background: "var(--accent-soft)",
                      border: "none",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    title="点击在工作流列表中筛选"
                  >
                    参与 {node.workflowCount} 个工作流
                  </button>
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--ink-3)", fontFamily: "var(--mono)" }}>通用要素</span>
                )}

                {node.siteUrl && (
                  <a
                    href={node.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: "11px", color: "var(--ink-2)", fontWeight: 600 }}
                  >
                    访问 ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentNodes.length === 0 && (
        <div style={{ padding: "30px", textAlign: "center", color: "var(--ink-3)", border: "1px dashed var(--line)", borderRadius: "10px" }}>
          暂无匹配要素。
        </div>
      )}
    </section>
  );
}
