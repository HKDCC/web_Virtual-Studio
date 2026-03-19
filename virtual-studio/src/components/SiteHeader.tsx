"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EasterEggOverlay } from "@/components/EasterEggOverlay";
import { useTheme } from "@/components/ThemeProvider";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

type SearchItem = {
  id: string;
  title: string;
  type: "note" | "book";
  url: string;
};

export function SiteHeader() {
  const pathname = usePathname();
  const [awakened, setAwakened] = useState(false);
  const [open, setOpen] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchCloseTimer = useRef<number | null>(null);
  const searchFetchTimer = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const allItems = useRef<SearchItem[]>([]);

  useEffect(() => {
    // Fetch all search items on mount
    async function fetchSearchItems() {
      try {
        const res = await fetch("/api/search");
        const data = await res.json();
        allItems.current = data.items || [];
      } catch {
        allItems.current = [];
      }
    }
    fetchSearchItems();
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
      if (searchCloseTimer.current) window.clearTimeout(searchCloseTimer.current);
      if (searchFetchTimer.current) window.clearTimeout(searchFetchTimer.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearchQuery(value);

    if (searchFetchTimer.current) window.clearTimeout(searchFetchTimer.current);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    searchFetchTimer.current = window.setTimeout(() => {
      const query = value.toLowerCase();
      const results = allItems.current.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
      );
      setSearchResults(results.slice(0, 5));
      setSearchLoading(false);
    }, 150);
  }

  return (
    <>
      <header className="site-header">
        <Link
          className="logo"
          href="/"
          onMouseEnter={() => {
            hoverTimer.current = window.setTimeout(() => {
              setAwakened(true);
              window.setTimeout(() => setOpen(true), 400);
            }, 7000);
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
            if (!open) setAwakened(false);
          }}
        >
          <span style={{ opacity: awakened ? 0 : 1, transition: "var(--transition)" }}>tl; // lab</span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: awakened ? 1 : 0,
              transition: "var(--transition)",
              fontSize: 18,
              letterSpacing: 0,
            }}
          >
            ( ˶ˆ꒳ˆ˵ )
          </span>
        </Link>

        <nav className="primary-nav">
          <Link href="/archive" data-active={isActive(pathname, "/archive")}>
            库 Archive
          </Link>
          <Link href="/lab" data-active={isActive(pathname, "/lab")}>
            实验室 Lab
          </Link>
          <Link href="/workflow" data-active={isActive(pathname, "/workflow")}>
            工作流 Workflow
          </Link>
          <Link href="/pause" data-active={isActive(pathname, "/pause")}>
            隙 Pause
          </Link>
          <Link href="/changelog" data-active={isActive(pathname, "/changelog")}>
            足迹
          </Link>
        </nav>

        <div className="search-wrap">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              padding: "4px 8px",
              opacity: 0.7,
              transition: "var(--transition)",
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className="search-icon"
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              if (!searchOpen) {
                window.setTimeout(() => {
                  const el = document.getElementById("searchInput") as HTMLInputElement | null;
                  el?.focus();
                }, 0);
              }
            }}
            aria-label="Search"
          >
            ⌕
          </button>
          <input
            id="searchInput"
            className={`search-input ${searchOpen ? "open" : ""}`}
            placeholder="搜索笔记、标签..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              searchCloseTimer.current = window.setTimeout(() => setSearchOpen(false), 200);
            }}
          />
          {searchOpen && (searchResults.length > 0 || searchLoading) && (
            <div
              className="search-results"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 280,
                background: "var(--bg)",
                border: "1px solid var(--bg-3)",
                borderRadius: "var(--r)",
                boxShadow: "var(--shadow-hover)",
                overflow: "hidden",
                zIndex: 200,
              }}
            >
              {searchLoading ? (
                <div style={{ padding: "12px 16px", color: "var(--ink-2)", fontSize: 13 }}>搜索中...</div>
              ) : (
                searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="search-result-item"
                    style={{
                      display: "block",
                      padding: "10px 16px",
                      textDecoration: "none",
                      color: "var(--ink)",
                      fontSize: 13,
                      borderBottom: "1px solid var(--bg-3)",
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
                      {item.type === "note" ? "笔记" : "书籍"}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </header>

      <EasterEggOverlay
        open={open}
        onClose={() => {
          setOpen(false);
          setAwakened(false);
        }}
      />
    </>
  );
}

