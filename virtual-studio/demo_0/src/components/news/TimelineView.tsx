"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { TimelineEntry } from "@/lib/changelog";

interface TimelineViewProps {
  entries: TimelineEntry[];
}

const FILTER_MODELS = [
  "全部",
  "DeepSeek",
  "Kimi",
  "MiniMax",
  "GLM",
  "Gemini",
  "GPT",
  "Grok",
  "Claude",
  "Qwen",
  "Doubao",
  "Mimo",
];

// ─── Arena Data Types ────────────────────────────────────────────────────────
interface ArenaScores {
  overall: number;
  chat: number;
  coding: number;
  longContext: number;
  science: number;
  factuality: number;
  agent: number;
}

interface ArenaModel {
  name: string;
  key: string;
  scores: ArenaScores;
}

interface ArenaData {
  models: ArenaModel[];
  maxElo: number;
  minElo: number;
}

interface BenchmarkScore {
  label: string;
  score: number; // mapped to 0-100
  rawElo: number; 
  avg: number;   // mapped 0-100 for avg
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getModelKey(modelName: string): string {
  const lower = modelName.toLowerCase();
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("kimi") || lower.includes("moonshot")) return "kimi";
  if (lower.includes("minimax")) return "minimax";
  if (lower.includes("glm") || lower.includes("智谱") || lower.includes("zhipu")) return "glm";
  if (lower.includes("gemini") || lower.includes("google")) return "gemini";
  if (lower.includes("gpt") || lower.includes("openai")) return "gpt";
  if (lower.includes("grok") || lower.includes("xai")) return "grok";
  if (lower.includes("claude") || lower.includes("anthropic")) return "claude";
  if (lower.includes("qwen") || lower.includes("千问")) return "qwen";
  if (lower.includes("doubao") || lower.includes("豆包") || lower.includes("云雀")) return "doubao";
  if (lower.includes("mimo")) return "mimo";
  return "";
}

function getModelLogoUrl(modelName: string): string | null {
  const lower = modelName.toLowerCase();
  if (lower.includes("deepseek")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek.svg";
  if (lower.includes("kimi") || lower.includes("moonshot")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi.svg";
  if (lower.includes("minimax")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/minimax.svg";
  if (lower.includes("glm") || lower.includes("智谱") || lower.includes("zhipu") || lower.includes("chatglm")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/zhipu.svg";
  if (lower.includes("gemini") || lower.includes("google")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini.svg";
  if (lower.includes("gpt") || lower.includes("openai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg";
  if (lower.includes("grok") || lower.includes("xai")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg";
  if (lower.includes("claude") || lower.includes("anthropic")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude.svg";
  if (lower.includes("qwen") || lower.includes("千问")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen.svg";
  if (lower.includes("doubao") || lower.includes("豆包") || lower.includes("云雀")) return "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/doubao.svg";
  if (lower.includes("mimo")) return "/mimo.png";
  return null;
}

function matchesFilter(modelName: string, filter: string): boolean {
  if (filter === "全部") return true;
  const mLower = modelName.toLowerCase();
  const fLower = filter.toLowerCase();
  if (mLower.includes(fLower)) return true;
  if (fLower === "gpt"    && (mLower.includes("openai") || mLower.includes("gpt"))) return true;
  if (fLower === "gemini" && (mLower.includes("google") || mLower.includes("gemini"))) return true;
  if (fLower === "glm"    && (mLower.includes("智谱") || mLower.includes("glm"))) return true;
  if (fLower === "claude" && (mLower.includes("anthropic") || mLower.includes("claude"))) return true;
  if (fLower === "grok"   && (mLower.includes("xai") || mLower.includes("grok"))) return true;
  if (fLower === "qwen"   && (mLower.includes("qwen") || mLower.includes("千问"))) return true;
  if (fLower === "doubao" && (mLower.includes("doubao") || mLower.includes("豆包") || mLower.includes("云雀"))) return true;
  return false;
}

function getBadgeClass(modelName: string): string {
  const lower = modelName.toLowerCase();
  if (lower.includes("deepseek")) return "badge-deepseek";
  if (lower.includes("kimi")) return "badge-kimi";
  if (lower.includes("minimax")) return "badge-minimax";
  if (lower.includes("glm") || lower.includes("智谱")) return "badge-glm";
  if (lower.includes("gemini") || lower.includes("google")) return "badge-gemini";
  if (lower.includes("gpt") || lower.includes("openai")) return "badge-gpt";
  if (lower.includes("grok") || lower.includes("xai")) return "badge-grok";
  if (lower.includes("claude") || lower.includes("anthropic")) return "badge-claude";
  if (lower.includes("qwen") || lower.includes("千问")) return "badge-qwen";
  if (lower.includes("doubao") || lower.includes("豆包") || lower.includes("云雀")) return "badge-doubao";
  if (lower.includes("mimo")) return "badge-mimo";
  return "badge-default";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[0]}年${parseInt(parts[1]!)}月${parseInt(parts[2]!)}日`;
  }
  return dateStr;
}

// ─── SVG Radar Chart ──────────────────────────────────────────────────────────

interface RadarChartProps {
  benchmarks: BenchmarkScore[];
  animated: boolean;
}

function radarPoint(cx: number, cy: number, r: number, index: number, total: number): [number, number] {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function RadarChart({ benchmarks, animated }: RadarChartProps) {
  const cx = 90, cy = 90, maxR = 68;
  const n = benchmarks.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const gridPoints = (frac: number) =>
    benchmarks
      .map((_, i) => radarPoint(cx, cy, maxR * frac, i, n))
      .map(([x, y]) => `${x},${y}`)
      .join(" ");

  const dataPolygon = (key: "score" | "avg", fraction: number) =>
    benchmarks
      .map((b, i) => {
        const val = (b[key] / 100) * fraction;
        const [x, y] = radarPoint(cx, cy, maxR * val, i, n);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg
      width={180}
      height={180}
      viewBox="0 0 180 180"
      className="benchmark-radar-svg"
      aria-label="Radar chart"
    >
      {levels.map((frac) => (
        <polygon
          key={frac}
          points={gridPoints(frac)}
          fill="none"
          stroke="var(--bg-3)"
          strokeWidth={1}
          strokeDasharray={frac < 1 ? "3 3" : "none"}
        />
      ))}

      {benchmarks.map((_, i) => {
        const [x, y] = radarPoint(cx, cy, maxR, i, n);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x} y2={y}
            stroke="var(--bg-3)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPolygon("avg", animated ? 1 : 0)}
        fill="rgba(139,115,85,0.15)"
        stroke="var(--accent-soft)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        style={{ transition: animated ? "all 0.55s ease" : "none" }}
      />

      <polygon
        points={dataPolygon("score", animated ? 1 : 0)}
        fill="rgba(139,115,85,0.22)"
        stroke="var(--accent)"
        strokeWidth={2}
        style={{ transition: animated ? "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" : "none" }}
      />

      {benchmarks.map((b, i) => {
        const [x, y] = radarPoint(cx, cy, maxR * (b.score / 100), i, n);
        return (
          <circle
            key={i}
            cx={x} cy={y} r={3.5}
            fill="var(--accent)"
            stroke="var(--bg)"
            strokeWidth={1.5}
            style={{
              opacity: animated ? 1 : 0,
              transition: `opacity 0.3s ease ${i * 80 + 400}ms`,
            }}
          />
        );
      })}

      {benchmarks.map((b, i) => {
        const labelR = maxR + 14;
        const [lx, ly] = radarPoint(cx, cy, labelR, i, n);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8.5}
            fontFamily="var(--font-mono), monospace"
            fill="var(--ink-2)"
          >
            {b.label}
          </text>
        );
      })}

      <circle cx={cx} cy={cy} r={2.5} fill="var(--accent-soft)" />
    </svg>
  );
}

// ─── Benchmark Popover (6-Axes Live Radar) ───────────────────────────────────

function normalizeElo(elo: number, minElo: number, maxElo: number) {
  if (elo <= minElo) return 10; // floor at 10%
  if (elo >= maxElo) return 100; // ceil at 100%
  return Math.round(((elo - minElo) / (maxElo - minElo)) * 90 + 10);
}

function resolveArenaScores(model: ArenaModel, globalData: ArenaData): BenchmarkScore[] {
  // calculate average elo for each dimension across all models in globalData
  const getAvg = (key: keyof ArenaScores) => {
    if (globalData.models.length === 0) return 0;
    const sum = globalData.models.reduce((acc, m) => acc + m.scores[key], 0);
    return Math.round(sum / globalData.models.length);
  };

  const axes = [
    { label: "科学推理", key: "science" as keyof ArenaScores },
    { label: "长文本推理", key: "longContext" as keyof ArenaScores },
    { label: "指令遵循", key: "chat" as keyof ArenaScores },
    { label: "工具调用", key: "agent" as keyof ArenaScores },
    { label: "代码编程", key: "coding" as keyof ArenaScores },
    { label: "事实可靠性", key: "factuality" as keyof ArenaScores },
  ];

  return axes.map(axis => {
    const rawElo = model.scores[axis.key];
    const avgElo = getAvg(axis.key);
    return {
      label: axis.label,
      score: normalizeElo(rawElo, globalData.minElo, globalData.maxElo),
      rawElo: rawElo,
      avg: normalizeElo(avgElo, globalData.minElo, globalData.maxElo)
    };
  });
}

interface BenchmarkPopoverProps {
  modelName: string;
  arenaModel: ArenaModel;
  arenaData: ArenaData;
  visible: boolean;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  isLeft: boolean;
  sourceText: string;
}

function BenchmarkPopover({ modelName, arenaModel, arenaData, visible, anchorRef, isLeft, sourceText }: BenchmarkPopoverProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const [animated, setAnimated] = useState(false);

  const benchmarks = resolveArenaScores(arenaModel, arenaData);
  const logoUrl = getModelLogoUrl(modelName);

  const computePos = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const GAP = 16;

    if (isLeft) {
      setStyle({
        position: "fixed",
        top: rect.top,
        right: window.innerWidth - rect.left + GAP,
        zIndex: 999,
      });
    } else {
      setStyle({
        position: "fixed",
        top: rect.top,
        left: rect.right + GAP,
        zIndex: 999,
      });
    }
  }, [anchorRef, isLeft]);

  useEffect(() => {
    if (visible && anchorRef.current) {
      computePos();
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true))
      );
    } else {
      setAnimated(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible, anchorRef, computePos]);

  if (!mounted || benchmarks.length === 0) return null;

  return (
    <div
      className={`benchmark-popover ${animated ? "benchmark-popover--visible" : ""} ${
        isLeft ? "benchmark-popover--to-left" : "benchmark-popover--to-right"
      }`}
      style={style}
    >
      <div className="benchmark-popover-inner">
        <div className="benchmark-header">
          {logoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt={modelName} className="benchmark-logo" />
          )}
          <span className="benchmark-model-name">{arenaModel.name}</span>
          <span className="benchmark-subtitle">Arena Live Rating</span>
        </div>

        <div className="benchmark-body">
          <div className="benchmark-radar-wrap">
            <div className="benchmark-radar-sweep" />
            <RadarChart benchmarks={benchmarks} animated={animated} />
            <div className="benchmark-radar-legend">
              <span className="benchmark-legend-item">
                <span className="benchmark-legend-dot benchmark-legend-model" />
                模型
              </span>
              <span className="benchmark-legend-item">
                <span className="benchmark-legend-dot benchmark-legend-avg" />
                均值
              </span>
            </div>
          </div>

          <div className="benchmark-bars">
            {benchmarks.map((b, i) => (
              <div key={b.label} className="benchmark-row">
                <span className="benchmark-label">{b.label}</span>
                <div className="benchmark-bar-track">
                  <div
                    className="benchmark-bar-avg"
                    style={{
                      width: `${b.avg}%`,
                      transitionDelay: `${i * 40}ms`,
                    }}
                  />
                  <div
                    className="benchmark-bar-score"
                    style={{
                      width: animated ? `${b.score}%` : "0%",
                      transitionDelay: `${i * 60 + 80}ms`,
                    }}
                  />
                </div>
                <span
                  className="benchmark-score-val"
                  style={{
                    opacity: animated ? 1 : 0,
                    transitionDelay: `${i * 60 + 180}ms`,
                    color: 'var(--accent)'
                  }}
                >
                  {b.rawElo}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="benchmark-source">
          🟢 LIVE DATA · 来源：{sourceText}
        </p>
      </div>
    </div>
  );
}

// ─── Timeline Card ─────────────────────────────────────────────────────────────

interface TimelineCardProps {
  entry: TimelineEntry;
  isLeft: boolean;
  index: number;
  arenaData: ArenaData | null;
  arenaSource: string;
}

function TimelineCard({ entry, isLeft, index, arenaData, arenaSource }: TimelineCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const badgeClass = getBadgeClass(entry.model);
  const logoUrl = getModelLogoUrl(entry.model);
  const modelKey = getModelKey(entry.model);
  
  // Find matching arena model
  const arenaModel = arenaData?.models.find(m => m.key === modelKey);
  const hasBenchmark = !!arenaModel && !!arenaData;

  function handleMouseEnter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setHovered(true), 320);
  }
  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(false);
  }

  return (
    <div
      className={`timeline-item ${isLeft ? "left" : "right"}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={hasBenchmark ? handleMouseEnter : undefined}
      onMouseLeave={hasBenchmark ? handleMouseLeave : undefined}
    >
      <div className="timeline-dot" />
      <div className="timeline-card-wrapper">
        <div
          ref={cardRef}
          className={`timeline-card ${hovered ? "timeline-card--active" : ""}`}
        >
          <div className="timeline-card-header">
            <span className="timeline-date">{formatDate(entry.date)}</span>
            <span
              className={`timeline-badge ${badgeClass}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              {logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoUrl}
                  alt={entry.model}
                  style={{ width: "12px", height: "12px", objectFit: "contain", flexShrink: 0 }}
                />
              ) : (
                <span style={{ fontSize: "9px" }}>⚡</span>
              )}
              <span>{entry.model}</span>
            </span>
            {entry.version && <span className="timeline-version">{entry.version}</span>}
            {hasBenchmark && (
              <span className="timeline-benchmark-hint" title="悬停查看跑分">📊</span>
            )}
          </div>
          <h3 className="timeline-title">{entry.name}</h3>
          {entry.highlights && (
            <p className="timeline-desc">{entry.highlights}</p>
          )}
        </div>
      </div>

      {hasBenchmark && (
        <BenchmarkPopover
          modelName={entry.model}
          arenaModel={arenaModel}
          arenaData={arenaData}
          visible={hovered}
          anchorRef={cardRef}
          isLeft={isLeft}
          sourceText={arenaSource}
        />
      )}
    </div>
  );
}

// ─── Global Leaderboard ────────────────────────────────────────────────────────

function ArenaLeaderboard({ data, source }: { data: ArenaData | null, source: string }) {
  if (!data || data.models.length === 0) return null;
  
  // Sort by overall score descending
  const sorted = [...data.models].sort((a, b) => b.scores.overall - a.scores.overall);
  
  return (
    <div className="arena-leaderboard" style={{
      border: '1px solid var(--accent-soft)',
      background: 'rgba(139, 115, 85, 0.03)',
      padding: '24px',
      marginBottom: '64px',
      fontFamily: 'var(--font-mono)',
      overflowX: 'auto',
      maxWidth: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--accent-soft)', paddingBottom: '12px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', color: 'var(--ink)' }}>GLOBAL INTELLIGENCE LEADERBOARD</h2>
        <span style={{ fontSize: '11px', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }}></span>
          {source}
        </span>
      </div>
      <table style={{ width: '100%', fontSize: '13px', textAlign: 'left', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ color: 'var(--ink-2)', borderBottom: '1px dashed var(--accent-soft)' }}>
            <th style={{ padding: '8px 0', width: '40px' }}>RK</th>
            <th style={{ padding: '8px 0', width: '200px' }}>MODEL ID</th>
            <th style={{ padding: '8px 0', width: 'auto' }}>PERFORMANCE (OVERALL)</th>
            <th style={{ padding: '8px 0', textAlign: 'right', width: '80px' }}>OVERALL</th>
            <th style={{ padding: '8px 0', textAlign: 'right', width: '80px' }}>AGENT</th>
            <th style={{ padding: '8px 0', textAlign: 'right', width: '80px' }}>CODING</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 10).map((m, i) => (
            <tr key={m.key + m.name} style={{ borderBottom: '1px solid rgba(139, 115, 85, 0.1)', color: 'var(--ink)' }}>
              <td style={{ padding: '12px 0', color: i < 3 ? 'var(--gold)' : 'var(--ink-2)' }}>#{i + 1}</td>
              <td style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getModelLogoUrl(m.name) || undefined} alt="" style={{ width: '14px', height: '14px' }} />
                {m.name}
              </td>
              <td style={{ padding: '12px 0', paddingRight: '24px' }}>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-3)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="arena-leaderboard-bar-fill" style={{ width: `${Math.max(5, (m.scores.overall - 1200) / 200 * 100)}%`, height: '100%', background: i < 3 ? 'var(--accent)' : 'var(--ink-2)' }} />
                </div>
              </td>
              <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: i < 3 ? 600 : 400, color: i < 3 ? 'var(--accent)' : 'var(--ink)' }}>
                {m.scores.overall}
              </td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ink-2)' }}>
                {m.scores.agent}
              </td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--ink-2)' }}>
                {m.scores.coding}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ─── Main TimelineView ─────────────────────────────────────────────────────────

export function TimelineView({ entries = [] }: TimelineViewProps) {
  const [selectedModel, setSelectedModel] = useState<string>("全部");
  const [arenaData, setArenaData] = useState<ArenaData | null>(null);
  const [arenaSource, setArenaSource] = useState<string>("Loading...");

  // Fetch Arena Data
  useEffect(() => {
    async function fetchArena() {
      try {
        const res = await fetch('/api/arena');
        const json = await res.json();
        if (json.success && json.data) {
          setArenaData(json.data);
          setArenaSource(json.source);
        }
      } catch (e) {
        console.error("Failed to fetch arena data:", e);
        setArenaSource("LMSYS Offline");
      }
    }
    fetchArena();
  }, []);

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.filter((entry) => matchesFilter(entry.model, selectedModel));
  }, [entries, selectedModel]);

  return (
    <div className="timeline-view-wrapper">
      
      {/* Global Arena Leaderboard */}
      <ArenaLeaderboard data={arenaData} source={arenaSource} />

      {/* Filter Tabs */}
      <div className="timeline-filter-tabs" id="timeline-filters">
        {FILTER_MODELS.map((model) => (
          <button
            key={model}
            type="button"
            className={`timeline-filter-tab ${selectedModel === model ? "active" : ""}`}
            onClick={() => setSelectedModel(model)}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {filteredEntries.length === 0 ? (
        <div className="timeline-empty">暂无相关迭代动态</div>
      ) : (
        <div className="timeline-container">
          {filteredEntries.map((entry, index) => (
            <TimelineCard
              key={entry.id || `${entry.date}-${entry.model}-${index}`}
              entry={entry}
              isLeft={index % 2 === 0}
              index={index}
              arenaData={arenaData}
              arenaSource={arenaSource}
            />
          ))}
        </div>
      )}
    </div>
  );
}
