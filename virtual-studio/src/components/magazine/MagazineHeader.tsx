"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchOverlay } from "./SearchOverlay";
import type { BookItem, LabItem, ToolItem, SiteItem, PauseItem, TimelineItem, NoteItem, LogItem } from "@/types/magazine";

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

const SECTIONS = [
  { id: "lab", num: "01", name: "实验室", icon: "⚗️" },
  { id: "workflow", num: "02", name: "工作流", icon: "🌀" },
  { id: "notes", num: "03", name: "笔记", icon: "📝" },
  { id: "archive", num: "04", name: "库", icon: "📚" },
  { id: "pause", num: "05", name: "隙", icon: "🌿" },
  { id: "changelog", num: "06", name: "足迹", icon: "👣" },
];

export function MagazineHeader({
  books = [],
  lab = [],
  tools = [],
  sites = [],
  pause = [],
  timeline = [],
  notes = [],
  log = [],
}: MagazineHeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tl-theme") || localStorage.getItem("theme");
      const isDark = saved === "dark" || document.documentElement.dataset.theme === "dark" || document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        setTheme("dark");
        document.documentElement.dataset.theme = "dark";
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setTheme("light");
        document.documentElement.dataset.theme = "light";
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch {}
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut to open search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Scroll listener for sticky dock and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 200);

      // Section scrollspy
      if (pathname === "/") {
        const sectionElements = SECTIONS.map((s) => ({
          id: s.id,
          el: document.getElementById(s.id),
        })).filter((s) => s.el !== null);

        const scrollPosition = scrollY + 250;
        let current = "";
        for (const s of sectionElements) {
          if (s.el && s.el.offsetTop <= scrollPosition) {
            current = s.id;
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("tl-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
    } catch {}
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToSection(id: string, e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 32;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  }

  // Do not render this header on demo_0 routes
  if (pathname.startsWith("/demo_0")) {
    return null;
  }

  const isHome = pathname === "/";
  const navPrefix = isHome ? "" : "/";

  return (
    <>
      {/* ═══════════ 原生顶栏导航（首屏展示） ═══════════ */}
      <header className="masthead wrap">
        <div className="brand-row">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "contain",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            />
            <div>
              <Link href="/" className="brand">
                tl; <b>{"//"}</b> lab
              </Link>
              <div className="issue">VIRTUAL STUDIO · VOL.02 · 杂志版</div>
            </div>
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
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={`${navPrefix}#${s.id}`}
              onClick={(e) => scrollToSection(s.id, e)}
            >
              <b>{s.num}</b>
              {s.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* ═══════════ 丝滑侧边栏悬浮导航（滚动遮挡时动态滑出） ═══════════ */}
      <aside
        className={`magazine-side-dock ${isScrolled ? "dock-active" : ""}`}
        aria-label="侧边快速导航"
      >
        <div className="dock-inner">
          <div className="dock-brand" onClick={scrollToTop} title="回到顶部">
            <span className="dock-logo">tl;</span>
          </div>

          <div className="dock-divider" />

          {/* 01~06 章节链接 */}
          <nav className="dock-nav">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <Link
                  key={s.id}
                  href={`${navPrefix}#${s.id}`}
                  onClick={(e) => scrollToSection(s.id, e)}
                  className={`dock-item ${isActive ? "active" : ""}`}
                  title={`${s.num} ${s.name}`}
                >
                  <span className="dock-num">{s.num}</span>
                  <span className="dock-label">{s.name}</span>
                  {isActive && <span className="dock-active-dot" />}
                </Link>
              );
            })}
          </nav>

          <div className="dock-divider" />

          {/* 快捷工具区 */}
          <div className="dock-tools">
            <button
              type="button"
              className="dock-tool-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="全局搜索"
              title="全局搜索 (⌘K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>

            <button
              type="button"
              className="dock-tool-btn"
              onClick={toggleTheme}
              aria-label="切换深浅主题"
              title="切换主题"
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="dock-tool-btn dock-top-btn"
              onClick={scrollToTop}
              aria-label="回到顶部"
              title="回到顶部"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

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
