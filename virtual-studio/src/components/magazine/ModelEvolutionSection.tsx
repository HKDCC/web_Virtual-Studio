"use client";

import { useState } from "react";
import Link from "next/link";
import { ARENA_WEBDEV_LEADERBOARD } from "@/data/arenaLeaderboardData";

export function ModelEvolutionSection() {
  const [showAll, setShowAll] = useState(false);

  // Top score for calculating relative visual bar widths (max is 1691)
  const maxScore = ARENA_WEBDEV_LEADERBOARD[0]?.score || 1700;
  // Floor score for meaningful bar contrast (min scale 1400)
  const minBaseScore = 1450;

  const displayList = showAll ? ARENA_WEBDEV_LEADERBOARD : ARENA_WEBDEV_LEADERBOARD.slice(0, 6);

  return (
    <section id="timeline" className="block wrap">
      {/* Section Header */}
      <div className="sec-head reveal">
        <p className="kicker">
          <b>04</b> / 观测层 · OBSERVATION
        </p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a
            href="https://arena.ai/leaderboard/code/webdev"
            target="_blank"
            rel="noopener noreferrer"
            className="util"
            title="查看 Arena.ai 官方排行榜"
            style={{ fontSize: "11px" }}
          >
            Arena.ai 官方榜单 ↗
          </a>
          <Link className="util" href="/aievolutionlog" title="大模型迭代时间轴">
            全部更迭 ↗
          </Link>
        </div>
      </div>

      <h2 className="sec-title reveal">模型更迭</h2>
      <p className="sec-lede reveal">
        主流大语言模型在 Arena WebDev 代码与全栈前端开发评测中的官方 Elo 智力基准。
      </p>

      {/* Model Evolution Leaderboard Grid */}
      <div
        className="sec-body reveal"
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.02)",
        }}
      >
        {/* Table Subheader */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(180px, 1.4fr) minmax(180px, 2fr) minmax(80px, 0.6fr)",
            alignItems: "center",
            paddingBottom: "10px",
            borderBottom: "1px solid var(--line)",
            fontSize: "11px",
            fontFamily: "var(--mono)",
            color: "var(--ink-3)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <div>排名 / 模型架构</div>
          <div>WebDev Benchmark 可视化基准</div>
          <div style={{ textAlign: "right" }}>Elo 评分</div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {displayList.map((m) => {
            // Calculate percentage for progress bar (relative to range minBaseScore -> maxScore)
            const percentage = Math.min(
              100,
              Math.max(15, ((m.score - minBaseScore) / (maxScore - minBaseScore)) * 100)
            );

            const isTop3 = m.rank <= 3;
            const rankBadgeColor =
              m.rank === 1 ? "#D97706" : m.rank === 2 ? "#64748B" : m.rank === 3 ? "#B45309" : "var(--ink-3)";

            return (
              <div
                key={m.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(180px, 1.4fr) minmax(180px, 2fr) minmax(80px, 0.6fr)",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: isTop3 ? "var(--paper)" : "transparent",
                  border: isTop3 ? "1px solid var(--line)" : "1px solid transparent",
                  transition: "all 0.15s ease",
                  gap: "16px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--paper)";
                  e.currentTarget.style.borderColor = "var(--line)";
                }}
                onMouseLeave={(e) => {
                  if (!isTop3) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                {/* Column 1: Rank & Logo & Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      color: rankBadgeColor,
                      width: "24px",
                      flexShrink: 0,
                    }}
                  >
                    #{String(m.rank).padStart(2, "0")}
                  </span>

                  {/* Logo Container */}
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      background: "#ffffff",
                      border: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                      padding: "3px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.logoUrl}
                      alt={m.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      loading="lazy"
                    />
                  </div>

                  {/* Name and Provider */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.3,
                      }}
                      title={m.name}
                    >
                      {m.name}
                    </div>
                    <div style={{ fontSize: "10.5px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                      {m.provider} · {m.license}
                    </div>
                  </div>
                </div>

                {/* Column 2: Visual Benchmark Progress Bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "4px",
                      background: "var(--line)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        borderRadius: "4px",
                        background: `linear-gradient(90deg, ${m.color}88 0%, ${m.color} 100%)`,
                        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  </div>
                  {m.highlightNote && (
                    <div
                      style={{
                        fontSize: "10.5px",
                        color: "var(--ink-2)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.2,
                      }}
                      title={m.highlightNote}
                    >
                      {m.highlightNote}
                    </div>
                  )}
                </div>

                {/* Column 3: Exact Score and CI */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontFamily: "var(--mono)", fontWeight: 800, color: "var(--ink)" }}>
                    {m.score}
                  </div>
                  <div style={{ fontSize: "10px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
                    CI {m.ci}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions / Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--line)",
            paddingTop: "14px",
            marginTop: "4px",
          }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              background: "transparent",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "11.5px",
              fontFamily: "var(--mono)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            {showAll ? "收起部分榜单 ▲" : `展开更多模型 (${ARENA_WEBDEV_LEADERBOARD.length} 款) ▼`}
          </button>

          <Link
            href="/aievolutionlog"
            style={{
              fontSize: "12px",
              fontFamily: "var(--mono)",
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            查看大模型全量演进历史 ➔
          </Link>
        </div>
      </div>
    </section>
  );
}
