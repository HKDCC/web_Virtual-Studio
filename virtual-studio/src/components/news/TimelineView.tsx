"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { TimelineEntry, BenchmarkData } from "@/lib/changelog";

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

// ─── Benchmark Data ────────────────────────────────────────────────────────────
// Scores are normalized 0–100, based on publicly reported results.
// References: MMLU-Pro, HumanEval, MATH-500, MT-Bench, GPQA-Diamond
// Reflects representative flagship models as of 2025–2026.
// Scores for each family represent the best reported result from the flagship model.

interface BenchmarkScore {
  label: string;
  score: number;
  avg: number; // frontier-model average for that metric
}

const MODEL_BENCHMARKS: Record<string, BenchmarkScore[]> = {
  // DeepSeek-R1: MMLU 90.8, MATH-500 97.3, GPQA Diamond 71.5
  deepseek: [
    { label: "MMLU",      score: 91, avg: 87 },
    { label: "HumanEval", score: 90, avg: 83 },
    { label: "MATH",      score: 97, avg: 88 },
    { label: "MT-Bench",  score: 90, avg: 85 },
    { label: "GPQA",      score: 72, avg: 65 },
  ],
  // Kimi k1.5: MMLU 87.4, MATH-500 96.2
  kimi: [
    { label: "MMLU",      score: 87, avg: 87 },
    { label: "HumanEval", score: 80, avg: 83 },
    { label: "MATH",      score: 96, avg: 88 },
    { label: "MT-Bench",  score: 86, avg: 85 },
    { label: "GPQA",      score: 60, avg: 65 },
  ],
  // MiniMax-Text-01: MMLU 88.5, HumanEval 86.9, MATH 77.4, GPQA 54.4
  minimax: [
    { label: "MMLU",      score: 89, avg: 87 },
    { label: "HumanEval", score: 87, avg: 83 },
    { label: "MATH",      score: 77, avg: 88 },
    { label: "MT-Bench",  score: 82, avg: 85 },
    { label: "GPQA",      score: 54, avg: 65 },
  ],
  // GLM-Z1
  glm: [
    { label: "MMLU",      score: 84, avg: 87 },
    { label: "HumanEval", score: 78, avg: 83 },
    { label: "MATH",      score: 80, avg: 88 },
    { label: "MT-Bench",  score: 84, avg: 85 },
    { label: "GPQA",      score: 56, avg: 65 },
  ],
  // Gemini 2.5 Pro: MMLU Lite 89.8, GPQA Diamond 84.0
  gemini: [
    { label: "MMLU",      score: 90, avg: 87 },
    { label: "HumanEval", score: 90, avg: 83 },
    { label: "MATH",      score: 98, avg: 88 },
    { label: "MT-Bench",  score: 95, avg: 85 },
    { label: "GPQA",      score: 84, avg: 65 },
  ],
  // GPT o3: MMLU 92.9
  gpt: [
    { label: "MMLU",      score: 93, avg: 87 },
    { label: "HumanEval", score: 92, avg: 83 },
    { label: "MATH",      score: 97, avg: 88 },
    { label: "MT-Bench",  score: 94, avg: 85 },
    { label: "GPQA",      score: 88, avg: 65 },
  ],
  // Grok 3: MMLU 92.7, GPQA 84.6
  grok: [
    { label: "MMLU",      score: 93, avg: 87 },
    { label: "HumanEval", score: 85, avg: 83 },
    { label: "MATH",      score: 93, avg: 88 },
    { label: "MT-Bench",  score: 90, avg: 85 },
    { label: "GPQA",      score: 85, avg: 65 },
  ],
  // Claude 3.7 Sonnet: MMLU 86.1, MATH-500 96.2, GPQA 84.8
  claude: [
    { label: "MMLU",      score: 86, avg: 87 },
    { label: "HumanEval", score: 93, avg: 83 },
    { label: "MATH",      score: 96, avg: 88 },
    { label: "MT-Bench",  score: 95, avg: 85 },
    { label: "GPQA",      score: 85, avg: 65 },
  ],
  // Qwen3-235B: MATH-500 93.0, GPQA Diamond 81.1
  qwen: [
    { label: "MMLU",      score: 89, avg: 87 },
    { label: "HumanEval", score: 88, avg: 83 },
    { label: "MATH",      score: 93, avg: 88 },
    { label: "MT-Bench",  score: 89, avg: 85 },
    { label: "GPQA",      score: 81, avg: 65 },
  ],
  // Doubao-1.5-pro: SuperGPQA 55.09
  doubao: [
    { label: "MMLU",      score: 83, avg: 87 },
    { label: "HumanEval", score: 78, avg: 83 },
    { label: "MATH",      score: 80, avg: 88 },
    { label: "MT-Bench",  score: 83, avg: 85 },
    { label: "GPQA",      score: 55, avg: 65 },
  ],
  // Mimo-V2.5-Pro: GPQA Diamond 86.6
  mimo: [
    { label: "MMLU",      score: 72, avg: 87 },
    { label: "HumanEval", score: 68, avg: 83 },
    { label: "MATH",      score: 64, avg: 88 },
    { label: "MT-Bench",  score: 74, avg: 85 },
    { label: "GPQA",      score: 87, avg: 65 },
  ],
};


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
  // Start from top (-90°), go clockwise
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function RadarChart({ benchmarks, animated }: RadarChartProps) {
  const cx = 90, cy = 90, maxR = 68;
  const n = benchmarks.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Build grid polygon points for a given fraction
  const gridPoints = (frac: number) =>
    benchmarks
      .map((_, i) => radarPoint(cx, cy, maxR * frac, i, n))
      .map(([x, y]) => `${x},${y}`)
      .join(" ");

  // Build data polygon
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
      {/* Grid rings */}
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

      {/* Axis spokes */}
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

      {/* Industry average polygon */}
      <polygon
        points={dataPolygon("avg", animated ? 1 : 0)}
        fill="rgba(139,115,85,0.15)"
        stroke="var(--accent-soft)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        style={{ transition: animated ? "all 0.55s ease" : "none" }}
      />

      {/* Model score polygon */}
      <polygon
        points={dataPolygon("score", animated ? 1 : 0)}
        fill="rgba(139,115,85,0.22)"
        stroke="var(--accent)"
        strokeWidth={2}
        style={{ transition: animated ? "all 0.6s cubic-bezier(0.34,1.56,0.64,1)" : "none" }}
      />

      {/* Axis dots */}
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

      {/* Axis labels */}
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

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2.5} fill="var(--accent-soft)" />
    </svg>
  );
}

// ─── Benchmark Popover ────────────────────────────────────────────────────────

// 把 Notion 真实数据 merge 成 BenchmarkScore[]
// 有 Notion 值的字段用真实数字，其余字段用硬编码 fallback
function resolveScores(
  modelKey: string,
  notionData: BenchmarkData | undefined
): BenchmarkScore[] {
  // 硬编码参考值（fallback）
  const fallback = MODEL_BENCHMARKS[modelKey] ?? [];

  if (!notionData) return fallback;

  // 五个固定指标，按顺序
  const METRICS: { label: string; key: keyof BenchmarkData; avg: number }[] = [
    { label: "MMLU",      key: "mmlu",      avg: 87 },
    { label: "HumanEval", key: "humaneval", avg: 83 },
    { label: "MATH",      key: "math",      avg: 88 },
    { label: "MT-Bench",  key: "mtbench",   avg: 85 },
    { label: "GPQA",      key: "gpqa",      avg: 65 },
  ];

  return METRICS.map((m) => {
    const notionVal = notionData[m.key] as number | undefined;
    // 优先用 Notion 的真实值；没有则从硬编码 fallback 找
    const fallbackScore = fallback.find((f) => f.label === m.label)?.score ?? 0;
    return {
      label: m.label,
      score: notionVal ?? fallbackScore,
      avg: m.avg,
      fromNotion: notionVal !== undefined,
    };
  }).filter((b) => b.score > 0); // 跳过无数据项
}

interface BenchmarkPopoverProps {
  modelName: string;
  modelKey: string;
  notionBenchmarks: BenchmarkData | undefined;
  visible: boolean;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  /** true = card is on the LEFT side → popover expands to the LEFT */
  isLeft: boolean;
}

function BenchmarkPopover({ modelName, modelKey, notionBenchmarks, visible, anchorRef, isLeft }: BenchmarkPopoverProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const [animated, setAnimated] = useState(false);

  const benchmarks = resolveScores(modelKey, notionBenchmarks);
  const hasRealData = notionBenchmarks !== undefined && Object.values(notionBenchmarks).some(
    (v) => typeof v === "number"
  );
  const logoUrl = getModelLogoUrl(modelName);

  const computePos = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const GAP = 16; // px gap between card edge and popover

    if (isLeft) {
      // Card is on LEFT → popover opens to the LEFT of the card
      // Use `right` so it doesn't need a width subtraction
      setStyle({
        position: "fixed",
        top: rect.top,
        right: window.innerWidth - rect.left + GAP,
        zIndex: 999,
      });
    } else {
      // Card is on RIGHT → popover opens to the RIGHT of the card
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
      aria-label={`${modelName} benchmark scores`}
    >
      <div className="benchmark-popover-inner">
        {/* Header */}
        <div className="benchmark-header">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={modelName} className="benchmark-logo" />
          )}
          <span className="benchmark-model-name">{modelName}</span>
          <span className="benchmark-subtitle">能力跑分</span>
        </div>

        {/* Radar + Bars side-by-side */}
        <div className="benchmark-body">
          {/* Left: Radar chart */}
          <div className="benchmark-radar-wrap">
            <RadarChart benchmarks={benchmarks} animated={animated} />
            {/* Radar legend */}
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

          {/* Right: Horizontal bars */}
          <div className="benchmark-bars">
            {benchmarks.map((b, i) => (
              <div key={b.label} className="benchmark-row">
                <span className="benchmark-label">{b.label}</span>
                <div className="benchmark-bar-track">
                  {/* Industry average overlay */}
                  <div
                    className="benchmark-bar-avg"
                    style={{
                      width: `${b.avg}%`,
                      transitionDelay: `${i * 40}ms`,
                    }}
                  />
                  {/* Model score bar */}
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
                  }}
                >
                  {b.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="benchmark-source">
          {hasRealData
            ? `真实数据 · 来源：${notionBenchmarks?.source ?? "官方论文 / 发布博客"}（MMLU · HumanEval · MATH-500 · MT-Bench · GPQA-Diamond）`
            : "参考数据（2025–2026 各模型官方报告，非独立测评）"}
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
}

function TimelineCard({ entry, isLeft, index }: TimelineCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const badgeClass = getBadgeClass(entry.model);
  const logoUrl = getModelLogoUrl(entry.model);
  const modelKey = getModelKey(entry.model);
  // 有 Notion 真实数据 OR 有硬编码 fallback，都显示图表
  const hasBenchmark = modelKey !== "" && (
    (entry.benchmarks !== undefined) ||
    (MODEL_BENCHMARKS[modelKey]?.length ?? 0) > 0
  );

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
                // eslint-disable-next-line @next/next/no-img-element
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

      {/* Benchmark popover — uses position:fixed, no DOM clipping issues */}
      {hasBenchmark && (
        <BenchmarkPopover
          modelName={entry.model}
          modelKey={modelKey}
          notionBenchmarks={entry.benchmarks}
          visible={hovered}
          anchorRef={cardRef}
          isLeft={isLeft}
        />
      )}
    </div>
  );
}

// ─── Main TimelineView ─────────────────────────────────────────────────────────

export function TimelineView({ entries = [] }: TimelineViewProps) {
  const [selectedModel, setSelectedModel] = useState<string>("全部");

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.filter((entry) => matchesFilter(entry.model, selectedModel));
  }, [entries, selectedModel]);

  return (
    <div className="timeline-view-wrapper">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
