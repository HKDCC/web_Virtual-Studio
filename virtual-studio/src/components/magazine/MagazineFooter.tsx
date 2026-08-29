"use client";

import { usePathname } from "next/navigation";

export function MagazineFooter() {
  const pathname = usePathname();

  // Don't render on retro or demo_0
  if (pathname.startsWith("/retro") || pathname.startsWith("/demo_0")) {
    return null;
  }

  return (
    <footer className="wrap">
      <div className="foot-row">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          GITHUB ↗
        </a>
        <a href="/demo_0" title="demo_0 原版备份方案">
          DEMO_0 备份 ↗
        </a>
        <a href="/retro" title="赛博档案局复古方案">
          RETRO 赛博版 ↗
        </a>
        <a href="#main" title="返回顶部">
          TOP ↑
        </a>
      </div>
      <p className="colophon">
        © 2026 Tech-Linguist Lab · Built with Next.js + Notion
        <br />
        杂志编辑式个人站 · Noto Serif SC / JetBrains Mono · 深度接入 Notion 知识库与无头 CMS 架构
      </p>
    </footer>
  );
}
