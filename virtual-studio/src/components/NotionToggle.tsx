"use client";

import { useState } from "react";

export function NotionToggle(props: { summary: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ margin: "16px 0" }}>
      <div
        onClick={() => setOpen((v) => !v)}
        className="toggle-trigger"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: "var(--r)",
          cursor: "pointer",
          background: "var(--bg-2)",
          userSelect: "none",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <span
          className="toggle-arrow"
          style={{
            fontSize: 10,
            color: "var(--ink-3)",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "var(--spring)",
          }}
        >
          ▶
        </span>
        <span>{props.summary}</span>
      </div>
      {open ? (
        <div style={{ padding: "12px 16px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8 }}>
          {props.children}
        </div>
      ) : null}
    </div>
  );
}

