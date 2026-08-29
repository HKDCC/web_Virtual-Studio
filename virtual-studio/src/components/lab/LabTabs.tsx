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
  appIcon?: { type: "emoji" | "image"; value: string } | null;
};

function LabCard(props: { item: LabItem; index?: number }) {
  const { item, index = 0 } = props;
  const isReverse = index % 2 === 1;
  const localFallback =
    item.title.includes("WhisperX") || item.title.includes("Whisper") ? "/lab/whisperx_gui.mp4" :
    item.title.includes("MiniReader") || item.title.includes("Reader") ? "/lab/minireader.gif" :
    item.title.includes("Retro") || item.title.includes("Snake") ? "/lab/retro_pixel_snake.gif" :
    item.title.includes("MuseTodo") ? "/lab/musetodo_pink.gif" :
    item.title.includes("Cassette") ? "/lab/cassettecutter.jpg" :
    item.title.includes("SwiftMemo") ? "/lab/swiftmemo.jpg" : null;

  const imgSrc = localFallback || item.iconUrl;

  return (
    <div className={`lab-card ${isReverse ? "is-reverse" : ""}`}>
      <Link href={`/p/${item.id}`} className="lab-card-thumb" style={{ overflow: "hidden", position: "relative" }}>
        {imgSrc ? (
          imgSrc.endsWith(".mp4") ? (
            <video
              src={imgSrc}
              autoPlay
              loop
              muted
              playsInline
              className="lab-thumb-img"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : (
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
          )
        ) : (
          <div className={`lab-badge ${item.type === "vibe" ? "earth" : "blue"}`}>
            {item.badge ?? (item.type === "vibe" ? "Vibe" : "Lab")}
          </div>
        )}
      </Link>
      <div className="lab-body">
        <Link href={`/p/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          {(() => {
            const localAppIcon =
              item.title.includes("WhisperX") || item.title.includes("Whisper") ? { type: "image" as const, value: "/lab/icons/whisperx.png" } :
              item.title.includes("MiniReader") || item.title.includes("Reader") ? { type: "image" as const, value: "/lab/icons/minireader.png" } :
              item.title.includes("Cassette") || item.title.includes("MagicCutter") || item.title.includes("Cutter") ? { type: "image" as const, value: "/lab/icons/magiccutter.png" } :
              item.title.includes("SwiftMemo") ? { type: "image" as const, value: "/lab/icons/swiftmemo.png" } :
              item.title.includes("Retro") || item.title.includes("Snake") ? { type: "image" as const, value: "/lab/icons/snake.png" } :
              item.title.includes("MuseTodo") ? { type: "emoji" as const, value: "🌸" } : null;
            const resolvedIcon = localAppIcon || item.appIcon;

            return (
              <div className="lab-card-header">
                {resolvedIcon?.type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolvedIcon.value}
                    alt=""
                    className="p-app-icon img"
                    aria-hidden="true"
                    loading="lazy"
                  />
                )}
                {resolvedIcon?.type === "emoji" && (
                  <span className="p-app-icon emoji" aria-hidden="true">
                    {resolvedIcon.value}
                  </span>
                )}
                <div className="lab-header-text">
                  <div className="p-tag">{item.badge ?? (item.type === "vibe" ? "Vibe Coding" : "AI 实践")}</div>
                  <div className="lab-title">{item.title}</div>
                </div>
              </div>
            );
          })()}
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
              Demo ↗
            </a>
          ) : (
            <Link href={`/p/${item.id}`} className="lab-link demo">
              查看笔记 ↗
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
        <div className="lab-list">
          {props.ai.map((item, idx) => (
            <LabCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>

      <div className={`wf-panel ${tab === "vibe" ? "active" : ""}`} id="lab-vibe">
        <div className="lab-list">
          {props.vibe.map((item, idx) => (
            <LabCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </>
  );
}
