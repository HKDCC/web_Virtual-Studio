"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

function isActive(pathname: string, href: string) {
  if (href === "/demo_0") return pathname === "/demo_0";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Demo0Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <Link className="logo" href="/demo_0">
        <span>tl; // lab (demo_0)</span>
      </Link>

      <nav className="primary-nav">
        <Link href="/demo_0/aievolutionlog" data-active={isActive(pathname, "/demo_0/aievolutionlog")}>
          AI 模型更迭
        </Link>
        <Link href="/demo_0/archive" data-active={isActive(pathname, "/demo_0/archive")}>
          库 Archive
        </Link>
        <Link href="/demo_0/lab" data-active={isActive(pathname, "/demo_0/lab")}>
          实验室 Lab
        </Link>
        <Link href="/demo_0/workflow" data-active={isActive(pathname, "/demo_0/workflow")}>
          工作流 Workflow
        </Link>
        <Link href="/demo_0/pause" data-active={isActive(pathname, "/demo_0/pause")}>
          隙 Pause
        </Link>
        <Link href="/demo_0/changelog" data-active={isActive(pathname, "/demo_0/changelog")}>
          足迹
        </Link>
      </nav>

      <div className="search-wrap">
        <Link
          href="/"
          title="返回新版杂志主页"
          style={{
            textDecoration: "none",
            color: "var(--ink-2)",
            fontSize: 12,
            padding: "4px 8px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            marginRight: 6,
          }}
        >
          返回新版 ↗
        </Link>
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
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
