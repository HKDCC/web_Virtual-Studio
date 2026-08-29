"use client";

import { useMemo, useState } from "react";
import type { TimelineEntry } from "@/lib/changelog";

interface TimelineViewProps {
  entries: TimelineEntry[];
}

const FILTER_MODELS = [
  "全部",
  "Claude",
  "GPT",
  "Gemini",
  "DeepSeek",
  "Qwen",
  "GLM",
  "Grok",
  "Kimi",
  "Doubao",
  "MiniMax",
  "Mimo",
];

// Official Artificial Analysis Intelligence Index v4.1.1 benchmark data
const OFFICIAL_AA_INDEX = [
  { name: "Claude Opus 5 (max)", provider: "Claude", score: 63, color: "#D97757", tag: "Anthropic" },
  { name: "Claude Fable 5 (with fallback)", provider: "Claude", score: 62, color: "#D97757", tag: "Anthropic" },
  { name: "GPT-5.6 Sol (max)", provider: "GPT", score: 61, color: "#10A37F", tag: "OpenAI" },
  { name: "Grok 4.6 (high)", provider: "Grok", score: 61, color: "#1D9BF0", tag: "xAI" },
  { name: "Kimi K3 (max)", provider: "Kimi", score: 60, color: "#5046E5", tag: "Moonshot" },
  { name: "GLM-5.3 (max)", provider: "GLM", score: 60, color: "#3B82F6", tag: "Z.ai" },
  { name: "Qwen3.8 2.4T A95B", provider: "Qwen", score: 58, color: "#FF6A00", tag: "Alibaba" },
  { name: "GLM-5.3-Flash", provider: "GLM", score: 57, color: "#3B82F6", tag: "Z.ai" },
  { name: "GPT-5.6 Terra (max)", provider: "GPT", score: 57, color: "#10A37F", tag: "OpenAI" },
  { name: "Gemini 3.7 Flash (high)", provider: "Gemini", score: 56, color: "#4285F4", tag: "Google" },
  { name: "DeepSeek V4 Pro 0813 (max)", provider: "DeepSeek", score: 53, color: "#4D6BFE", tag: "DeepSeek" },
  { name: "GPT-5.6 Luna (max)", provider: "GPT", score: 52, color: "#10A37F", tag: "OpenAI" },
  { name: "Qwen3.8 27B (xhigh)", provider: "Qwen", score: 52, color: "#FF6A00", tag: "Alibaba" },
  { name: "MiniMax-M3", provider: "MiniMax", score: 45, color: "#FF3366", tag: "MiniMax" },
  { name: "Gemini 3.5 Flash-Lite", provider: "Gemini", score: 37, color: "#4285F4", tag: "Google" },
  { name: "Claude 4.5 Haiku", provider: "Claude", score: 30, color: "#D97757", tag: "Anthropic" },
];

function getModelLogoUrl(modelName: string): string | null {
  const lower = modelName.toLowerCase();
  if (lower.includes("deepseek")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg";
  if (lower.includes("kimi") || lower.includes("moonshot")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi.svg";
  if (lower.includes("minimax")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/minimax.svg";
  if (lower.includes("glm") || lower.includes("智谱") || lower.includes("zhipu") || lower.includes("z.ai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg";
  if (lower.includes("gemini") || lower.includes("google")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg";
  if (lower.includes("gpt") || lower.includes("openai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg";
  if (lower.includes("grok") || lower.includes("xai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg";
  if (lower.includes("claude") || lower.includes("anthropic")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg";
  if (lower.includes("qwen") || lower.includes("千问") || lower.includes("alibaba")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg";
  if (lower.includes("doubao") || lower.includes("豆包") || lower.includes("云雀")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/doubao.svg";
  if (lower.includes("mimo")) return "/mimo.png";
  return null;
}

function matchesFilter(modelName: string, filter: string): boolean {
  if (filter === "全部") return true;
  const mLower = modelName.toLowerCase();
  const fLower = filter.toLowerCase();
  if (mLower.includes(fLower)) return true;
  if (fLower === "gpt" && (mLower.includes("openai") || mLower.includes("gpt"))) return true;
  if (fLower === "gemini" && (mLower.includes("google") || mLower.includes("gemini"))) return true;
  if (fLower === "glm" && (mLower.includes("智谱") || mLower.includes("glm") || mLower.includes("z.ai"))) return true;
  if (fLower === "claude" && (mLower.includes("anthropic") || mLower.includes("claude"))) return true;
  if (fLower === "grok" && (mLower.includes("xai") || mLower.includes("grok"))) return true;
  if (fLower === "qwen" && (mLower.includes("qwen") || mLower.includes("千问"))) return true;
  if (fLower === "doubao" && (mLower.includes("doubao") || mLower.includes("豆包") || mLower.includes("云雀"))) return true;
  return false;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, "·");
}

export function TimelineView({ entries = [] }: TimelineViewProps) {
  const [selectedModel, setSelectedModel] = useState<string>("全部");
  const [showAllLeaderboard, setShowAllLeaderboard] = useState<boolean>(false);

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.filter((entry) => matchesFilter(entry.model || entry.name, selectedModel));
  }, [entries, selectedModel]);

  const displayedLeaderboard = showAllLeaderboard
    ? OFFICIAL_AA_INDEX
    : OFFICIAL_AA_INDEX.slice(0, 10);

  return (
    <div className="model-evolution-container">
      {/* ═══════════════ 1. Artificial Analysis 智力榜单 ═══════════════ */}
      <section className="aa-leaderboard-section">
        <div className="aa-leaderboard-header">
          <div className="aa-header-left">
            <div className="aa-badge-group">
              <span className="aa-badge-active">Artificial Analysis Intelligence Index</span>
              <span className="aa-badge-sub">v4.1.1 · 9 Evaluations</span>
            </div>
            <h2 className="aa-title">
              Artificial Analysis 官方智力榜单
              <a
                href="https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index"
                target="_blank"
                rel="noopener noreferrer"
                className="aa-outlink"
                title="访问 Artificial Analysis 官方评测报告"
              >
                ↗
              </a>
            </h2>
            <p className="aa-subtitle">
              整合 GDPval-AA v2、τ³-Banking、Terminal-Bench v2.1、SciCode、GPQA Diamond、CritPt 等 9 大权威基准测试综合智力值。
            </p>
          </div>
          <button
            type="button"
            className="aa-toggle-btn"
            onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
          >
            {showAllLeaderboard ? "收起部分模型 ↑" : `查看完整榜单 (${OFFICIAL_AA_INDEX.length}) ↓`}
          </button>
        </div>

        {/* 智力柱状榜单 */}
        <div className="aa-chart-grid">
          {displayedLeaderboard.map((item, idx) => {
            const logo = getModelLogoUrl(item.provider);
            const percentage = (item.score / 70) * 100;
            const isTop3 = idx < 3;

            return (
              <div key={item.name} className={`aa-chart-card ${isTop3 ? "aa-card-top" : ""}`}>
                <div className="aa-card-rank">
                  <span className={`rank-num rank-${idx + 1}`}>#{idx + 1}</span>
                  {logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt={item.provider} className="aa-card-logo" />
                  )}
                </div>

                <div className="aa-card-info">
                  <div className="aa-model-name-row">
                    <span className="aa-model-name" title={item.name}>
                      {item.name}
                    </span>
                    <span className="aa-provider-tag">{item.tag}</span>
                  </div>

                  <div className="aa-bar-track">
                    <div
                      className="aa-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(10, percentage))}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>

                <div className="aa-card-score">
                  <span className="score-val">{item.score}</span>
                  <span className="score-unit">INDEX</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ 2. 模型筛选器 ═══════════════ */}
      <div className="model-filter-bar">
        <div className="filter-title-wrap">
          <span className="filter-icon">⚡</span>
          <span className="filter-title">模型家族速选：</span>
        </div>
        <div className="filter-chips">
          {FILTER_MODELS.map((model) => (
            <button
              key={model}
              type="button"
              className={`filter-chip ${selectedModel === model ? "active" : ""}`}
              onClick={() => setSelectedModel(model)}
            >
              {model !== "全部" && getModelLogoUrl(model) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getModelLogoUrl(model)!} alt="" className="filter-chip-logo" />
              )}
              <span>{model}</span>
              {selectedModel === model && <span className="chip-dot" />}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ 3. 中轴实时模型树 ═══════════════ */}
      <section className="model-tree-section">
        <div className="model-tree-wrapper">
          {/* 中央竖向主干线 */}
          <div className="tree-central-spine" />

          {filteredEntries.length === 0 ? (
            <div className="tree-empty-state">未找到匹配的模型更迭记录</div>
          ) : (
            <div className="tree-nodes-list">
              {filteredEntries.map((entry, index) => {
                const isLeft = index % 2 === 0;
                const logo = getModelLogoUrl(entry.model);
                const hasAAScore = typeof entry.aaIntelligence === "number";

                return (
                  <div
                    key={entry.id || `${entry.date}-${entry.model}-${index}`}
                    className={`tree-node-row ${isLeft ? "node-left" : "node-right"}`}
                  >
                    {/* 中央节点锚点 */}
                    <div className="tree-spine-anchor">
                      <div className="spine-dot" />
                      <div className="spine-branch-line" />
                    </div>

                    {/* 模型内容卡片 */}
                    <div className="tree-card-shell">
                      <div className="tree-model-card">
                        {/* 头部元信息 */}
                        <div className="tree-card-header">
                          <div className="tree-date-chip">
                            <span className="date-icon">📅</span>
                            <span>{formatDate(entry.date)}</span>
                          </div>

                          <div className="tree-model-badge">
                            {logo && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={logo} alt="" className="badge-logo" />
                            )}
                            <span>{entry.model}</span>
                          </div>

                          {entry.version && (
                            <span className="tree-version-tag">{entry.version}</span>
                          )}

                          {hasAAScore && (
                            <div className="tree-aa-pill" title="Artificial Analysis 智力值">
                              <span className="pill-prefix">AA 智力值</span>
                              <span className="pill-score">{entry.aaIntelligence}</span>
                            </div>
                          )}
                        </div>

                        {/* 模型主标题 */}
                        <h3 className="tree-model-title">{entry.name}</h3>

                        {/* 亮点与突破摘要 */}
                        {entry.highlights && (
                          <p className="tree-model-desc">{entry.highlights}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
