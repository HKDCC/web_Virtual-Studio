"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import { BookItem, LabItem, ToolItem, SiteItem, PauseItem, TimelineItem, NoteItem, LogItem } from "@/lib/magazineData";

interface MagazineHeaderProps {
  books?: BookItem[];
  lab?: LabItem[];
  tools?: ToolItem[];
  sites?: SiteItem[];
  pause?: PauseItem[];
  timeline?: TimelineItem[];
  notes?: NoteItem[];
  log?: LogItem[];
}

export function MagazineHeader({
  books,
  lab,
  tools,
  sites,
  pause,
  timeline,
  notes,
  log,
}: MagazineHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tl-theme");
      const isDark = saved === "dark" || document.documentElement.dataset.theme === "dark";
      if (isDark) {
        setTheme("dark");
        document.documentElement.dataset.theme = "dark";
      } else {
        setTheme("light");
        document.documentElement.removeAttribute("data-theme");
      }
    } catch {
      // ignore
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.dataset.theme = "dark";
      try {
        localStorage.setItem("tl-theme", "dark");
      } catch {}
    } else {
      document.documentElement.removeAttribute("data-theme");
      try {
        localStorage.setItem("tl-theme", "light");
      } catch {}
    }
  }

  // Do not render this header on retro or demo_0 routes
  if (pathname.startsWith("/retro") || pathname.startsWith("/demo_0")) {
    return null;
  }

  const isHome = pathname === "/";
  const navPrefix = isHome ? "" : "/";

  return (
    <>
      <header className="masthead wrap">
        <div className="brand-row">
          <div>
            <Link href="/" className="brand">
              tl; <b>{"//"}</b> lab
            </Link>
            <div className="issue">VIRTUAL STUDIO · VOL.02 · 杂志版</div>
          </div>
          <div className="actions">
            <div className="theme-versions" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <Link
                href="/demo_0"
                className="version-pill"
                title="切换至 demo_0 原版方案"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  padding: "4px 8px",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                }}
              >
                demo_0 备份
              </Link>
              <Link
                href="/retro"
                className="version-pill"
                title="切换至赛博档案局复古方案"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  padding: "4px 8px",
                  border: "1px solid var(--line)",
                  borderRadius: "999px",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                }}
              >
                赛博档案版
              </Link>
            </div>
            <button
              className="icon-btn"
              id="btnSearch"
              aria-label="搜索"
              type="button"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <button
              className="icon-btn"
              id="btnTheme"
              aria-label="切换深色模式"
              type="button"
              onClick={toggleTheme}
            >
              <svg className="i-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
              </svg>
              <svg className="i-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="mainnav" aria-label="栏目导航">
          <Link href={`${navPrefix}#lab`}>
            <b>01</b>实验室
          </Link>
          <Link href={`${navPrefix}#notes`}>
            <b>02</b>笔记
          </Link>
          <Link href={`${navPrefix}#archive`}>
            <b>03</b>库
          </Link>
          <Link href={`${navPrefix}#timeline`}>
            <b>04</b>时间线
          </Link>
          <Link href={`${navPrefix}#pause`}>
            <b>05</b>隙
          </Link>
          <Link href={`${navPrefix}#changelog`}>
            <b>06</b>足迹
          </Link>
        </nav>
      </header>

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        books={books}
        lab={lab}
        tools={tools}
        sites={sites}
        pause={pause}
        timeline={timeline}
        notes={notes}
        log={log}
      />
    </>
  );
}
