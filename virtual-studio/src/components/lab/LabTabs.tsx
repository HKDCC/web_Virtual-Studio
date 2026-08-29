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
  const localFallback =
    item.title.includes("MiniReader") || item.title.includes("Reader") ? "/lab/minireader.gif" :
    item.title.includes("Retro") || item.title.includes("Snake") ? "/lab/retro_pixel_snake.gif" :
    item.title.includes("MuseTodo") ? "/lab/musetodo_pink.gif" :
    item.title.includes("Cassette") ? "/lab/cassettecutter.jpg" :
    item.title.includes("SwiftMemo") ? "/lab/swiftmemo.jpg" : null;

  const imgSrc = item.iconUrl || localFallback;

  return (
    <div className="lab-card">
      <Link href={`/p/${item.id}`} className="lab-card-thumb" style={{ overflow: "hidden", position: "relative" }}>
        {imgSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt=""
              aria-hidden="true"
              className="p-card-media-backdrop"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={item.title}
              className="lab-thumb-img"
              loading="lazy"
            />
          </>
        ) : (
          <div className={`lab-badge ${item.type === "vibe" ? "earth" : "blue"}`}>
            {item.badge ?? (item.type === "vibe" ? "Vibe" : "Lab")}
          </div>
        )}
      </Link>
      <div className="lab-body">
        <Link href={`/p/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="lab-title">{item.title}</div>
          {item.description ? <div className="lab-desc">{item.description}</div> : null}
        </Link>
        <div className="lab-links">
          {item.github ? (
            <a
              className="lab-link github"
              href={item.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </a>
          ) : null}
          {item.demo ? (
            <a
              className="lab-link demo"
              href={item.demo}
              target="_blank"
              rel="noreferrer"
            >
              Demo
            </a>
          ) : (
            <Link href={`/p/${item.id}`} className="lab-link demo">
              查看笔记
            </Link>
          )}
        </div>
      </div>
    </div>
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
