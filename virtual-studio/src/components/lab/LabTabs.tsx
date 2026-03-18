"use client";

import { useState } from "react";
import Link from "next/link";

export type LabItem = {
  id: string;
  title: string;
  type: "ai" | "vibe";
  badge?: string | null;
  description?: string | null;
  github?: string | null;
  demo?: string | null;
  iconUrl?: string | null;
};

function LabCard(props: { item: LabItem }) {
  const { item } = props;
  const thumbStyle = item.iconUrl
    ? { backgroundImage: `url(${item.iconUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : undefined;

  return (
    <Link href={`/p/${item.id}`} className="lab-card">
      <div className="lab-card-thumb" style={thumbStyle}>
        {!item.iconUrl && (
          <div className={`lab-badge ${item.type === "vibe" ? "earth" : "blue"}`}>
            {item.badge ?? (item.type === "vibe" ? "Vibe" : "Lab")}
          </div>
        )}
      </div>
      <div className="lab-body">
        <div className="lab-title">{item.title}</div>
        {item.description ? <div className="lab-desc">{item.description}</div> : null}
        <div className="lab-links">
          {item.github ? (
            <a className="lab-link github" href={item.github} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          ) : null}
          {item.demo ? (
            <a className="lab-link demo" href={item.demo} target="_blank" rel="noreferrer">
              Demo
            </a>
          ) : (
            <span className="lab-link demo">查看笔记</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function LabTabs(props: { ai: LabItem[]; vibe: LabItem[] }) {
  const [tab, setTab] = useState<"ai" | "vibe">("ai");

  return (
    <>
      <div className="workflow-tabs">
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`wf-tab ${tab === "ai" ? "active" : ""}`}
        >
          AI 实践
        </button>
        <button
          type="button"
          onClick={() => setTab("vibe")}
          className={`wf-tab ${tab === "vibe" ? "active" : ""}`}
        >
          Vibe Coding
        </button>
      </div>

      <div className={`wf-panel ${tab === "ai" ? "active" : ""}`} id="lab-ai">
        <div className="lab-grid">
          {props.ai.map((item) => (
            <LabCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className={`wf-panel ${tab === "vibe" ? "active" : ""}`} id="lab-vibe">
        <div className="lab-grid">
          {props.vibe.map((item) => (
            <LabCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
