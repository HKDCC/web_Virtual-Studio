"use client";

import { useMemo, useState } from "react";
import type { ChangelogMonth, ChangelogEntry } from "@/lib/changelog";

function ModelBadge(props: { model: string }) {
  const colors: Record<string, string> = {
    OpenAI: "#10a37f",
    Anthropic: "#d9792b",
    "Google Gemini": "#4e7cf8",
    DeepSeek: "#0369a1",
    Qwen: "#c9251a",
    智谱GLM: "#5c47b6",
    Kimi: "#7c3aed",
    MiniMax: "#2563eb",
    文心一言: "#2563eb",
  };
  const color = colors[props.model] || "#6b7280";
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "10px",
        padding: "2px 8px",
        borderRadius: "4px",
        background: `${color}18`,
        color: color,
        letterSpacing: "0.04em",
      }}
    >
      {props.model}
    </span>
  );
}

function PricingTag(props: { text: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "10px",
        padding: "2px 7px",
        borderRadius: "4px",
        background: "#05966918",
        color: "#059669",
      }}
    >
      💰 {props.text}
    </span>
  );
}

function EntryCard(props: { entry: ChangelogEntry }) {
  const e = props.entry;

  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--bg-3)",
        borderRadius: "var(--r)",
        padding: "18px 22px",
        transition: "var(--spring)",
        cursor: "default",
      }}
      onMouseEnter={(ev) => {
        (ev.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (ev.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)";
        (ev.currentTarget as HTMLElement).style.borderColor = "var(--accent-soft)";
      }}
      onMouseLeave={(ev) => {
        (ev.currentTarget as HTMLElement).style.transform = "";
        (ev.currentTarget as HTMLElement).style.boxShadow = "";
        (ev.currentTarget as HTMLElement).style.borderColor = "";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        <ModelBadge model={e.model} />
        {e.version && (
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--ink-3)" }}>
            {e.version}
          </span>
        )}
        {e.pricing && <PricingTag text={e.pricing} />}
      </div>

      <h3
        style={{
          fontFamily: "var(--serif)",
          fontSize: "16px",
          fontWeight: "400",
          color: "var(--ink-1)",
          lineHeight: "1.45",
          margin: "0 0 8px",
        }}
      >
        {e.change}
      </h3>

      {e.detail && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--ink-3)",
            lineHeight: "1.6",
            margin: "0",
          }}
        >
          {e.detail}
        </p>
      )}
    </div>
  );
}

export function ChangelogView(props: { months: ChangelogMonth[] }) {
  const [activeMonth, setActiveMonth] = useState<string>(props.months[0]?.key || "all");

  const activeData = useMemo(() => {
    if (activeMonth === "all") return props.months;
    return props.months.filter((m) => m.key === activeMonth);
  }, [activeMonth, props.months]);

  const totalEntries = useMemo(() => {
    return activeData.reduce((sum, m) => sum + m.entries.length, 0);
  }, [activeData]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 48px 80px" }}>
      {/* Month filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "32px",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--bg-3)",
        }}
      >
        <button
          onClick={() => setActiveMonth("all")}
          style={{
            fontFamily: "var(--mono)",
            fontSize: "12px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "1px solid",
            borderColor: activeMonth === "all" ? "var(--accent)" : "var(--bg-3)",
            background: activeMonth === "all" ? "var(--accent)" : "transparent",
            color: activeMonth === "all" ? "#fff" : "var(--ink-3)",
            cursor: "pointer",
            transition: "var(--spring)",
          }}
        >
          全部
        </button>
        {props.months.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMonth(m.key)}
            style={{
              fontFamily: "var(--mono)",
              fontSize: "12px",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: activeMonth === m.key ? "var(--accent)" : "var(--bg-3)",
              background: activeMonth === m.key ? "var(--accent)" : "transparent",
              color: activeMonth === m.key ? "#fff" : "var(--ink-3)",
              cursor: "pointer",
              transition: "var(--spring)",
            }}
          >
            {m.title}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--ink-4)" }}>
          {totalEntries} 条更新
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--ink-4)" }}>
          {activeData.reduce((s, m) => s + new Set(m.entries.map((e) => e.model)).size, 0)} 家模型
        </div>
      </div>

      {/* Content */}
      {activeData.map((month) => (
        <div key={month.key} style={{ marginBottom: "56px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "24px",
              paddingTop: "28px",
              borderTop: "1px solid var(--bg-3)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: "20px",
                fontWeight: "400",
                color: "var(--ink-1)",
              }}
            >
              {month.title}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "11px",
                color: "var(--ink-4)",
              }}
            >
              {month.entries.length} 条
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: "14px",
            }}
          >
            {month.entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {activeData.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--ink-4)",
            fontSize: "14px",
          }}
        >
          暂无内容
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .changelog-container {
            padding: 20px !important;
          }
          .changelog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
