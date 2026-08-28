"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRetroSound } from "@/hooks/useRetroSound";

export function RetroHeader() {
  const pathname = usePathname();
  const { playHover, playClick } = useRetroSound();

  function isActive(href: string) {
    if (href === "/retro") return pathname === "/retro";
    return pathname.startsWith(href);
  }

  return (
    <aside className="retro-sidebar">
      <div className="retro-brand">
        <div className="retro-brand-mark">KB</div>
        <Link href="/retro" className="retro-brand-title" style={{ display: 'block' }} onMouseEnter={playHover} onMouseDown={playClick}>Virtual Studio</Link>
        <div className="retro-brand-sub">知识引擎与系统档案</div>
        <div className="retro-brand-deco">V.S.</div>
      </div>
      <div className="retro-toc-label">目录</div>
      <ul className="retro-toc">
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro" data-active={isActive("/retro")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">00</span>
            <span className="retro-led" />
            <span>首页 Home</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/archive" data-active={isActive("/retro/archive")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">01</span>
            <span className="retro-led" />
            <span>档案 Archive</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/lab" data-active={isActive("/retro/lab")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">02</span>
            <span className="retro-led" />
            <span>实验 Lab</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/workflow" data-active={isActive("/retro/workflow")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">03</span>
            <span className="retro-led" />
            <span>流程 Workflow</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/aievolutionlog" data-active={isActive("/retro/aievolutionlog")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">04</span>
            <span className="retro-led" />
            <span>AI进化史 AI Log</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/pause" data-active={isActive("/retro/pause")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">05</span>
            <span className="retro-led" />
            <span>定格 Pause</span>
          </Link>
        </li>
        <li className="retro-toc-item">
          <Link className="retro-toc-link" href="/retro/changelog" data-active={isActive("/retro/changelog")} onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num">06</span>
            <span className="retro-led" />
            <span>系统足迹 Logs</span>
          </Link>
        </li>
        <li className="retro-toc-item" style={{ marginTop: 24 }}>
          <Link className="retro-toc-link exit-link" href="/" onMouseEnter={playHover} onMouseDown={playClick}>
            <span className="retro-toc-num" style={{ color: 'var(--rust)' }}>{"<-"}</span>
            <span className="retro-led" style={{ background: 'var(--rust)' }} />
            <span style={{ color: 'var(--rust)' }}>退出终端 (Exit)</span>
          </Link>
        </li>
      </ul>

      <div style={{ padding: '40px 24px', fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--muted)', whiteSpace: 'pre', lineHeight: 1.2, opacity: 0.7 }}>
        {`\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
+SYS.CORE.V.9.4
[##########] 100%
DATA.LINK: SECURE
MEM.DUMP: OK
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\`}
      </div>
    </aside>
  );
}
