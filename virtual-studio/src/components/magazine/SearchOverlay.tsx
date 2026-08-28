"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookItem, LabItem, ToolItem, SiteItem, PauseItem, TimelineItem, NoteItem, LogItem } from "@/lib/magazineData";

export interface SearchIndexItem {
  k: string;
  t: string;
  s: string;
  href: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  books?: BookItem[];
  lab?: LabItem[];
  tools?: ToolItem[];
  sites?: SiteItem[];
  pause?: PauseItem[];
  timeline?: TimelineItem[];
  notes?: NoteItem[];
  log?: LogItem[];
}

export function SearchOverlay({
  isOpen,
  onClose,
  books = [],
  lab = [],
  tools = [],
  sites = [],
  pause = [],
  timeline = [],
  notes = [],
  log = [],
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const index: SearchIndexItem[] = [
    ...books.map((b) => ({ k: "书籍", t: b.t, s: b.a, href: b.id ? `/p/${b.id}` : "#archive" })),
    ...lab.map((p) => ({ k: "项目", t: p.t, s: p.d, href: p.id ? `/p/${p.id}` : "#lab" })),
    ...tools.map((x) => ({ k: "工具", t: x.t, s: x.d, href: "#workflow" })),
    ...sites.map((x) => ({ k: "站点", t: x.t, s: x.d, href: "#workflow" })),
    ...pause.map((x) => ({ k: "隙", t: x.t, s: `${x.loc} · ${x.d}`, href: x.id ? `/p/${x.id}` : "#pause" })),
    ...timeline.map((x) => ({ k: "模型", t: x.t, s: x.note, href: "#timeline" })),
    ...notes.map((x) => ({ k: "笔记", t: x.text, s: x.src, href: x.id ? `/p/${x.id}` : "#notes" })),
    ...log.map((x) => ({ k: "足迹", t: x.t, s: x.d, href: x.id ? `/p/${x.id}` : "#changelog" })),
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? index.filter((x) => (x.t + " " + x.s + " " + x.k).toLowerCase().includes(trimmed)).slice(0, 10)
    : [];

  return (
    <div
      className="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="站内搜索">
        <div className="search-bar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            id="searchInput"
            type="search"
            placeholder="搜索书名、项目、地点、模型…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button id="btnClose" type="button" onClick={onClose}>
            ESC
          </button>
        </div>
        <div className="results">
          {results.length > 0 ? (
            results.map((r, i) => (
              <Link key={i} className="result-row" href={r.href} onClick={onClose}>
                <span className="r-k">{r.k}</span>
                <span className="r-t">{r.t}</span>
                <span className="r-s">{r.s}</span>
              </Link>
            ))
          ) : (
            <p className="r-empty">{trimmed ? "没有找到相关条目。" : "试试：翻译 / 便签 / 上海 / Gemini"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
