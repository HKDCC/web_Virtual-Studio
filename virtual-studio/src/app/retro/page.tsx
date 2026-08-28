"use client";

import Link from "next/link";
import { useRetroSound } from "@/hooks/useRetroSound";

export default function RetroPage() {
  const { playHover, playClick } = useRetroSound();
  return (
    <>
      <div className="retro-marquee">
        <div className="retro-marquee-track">
          <span className="retro-marquee-item">SYSTEM ONLINE // ARCHIVE ACTIVE // 100% SECURE // PROTOCOL INITIATED //</span>
          <span className="retro-marquee-item">SYSTEM ONLINE // ARCHIVE ACTIVE // 100% SECURE // PROTOCOL INITIATED //</span>
          <span className="retro-marquee-item">SYSTEM ONLINE // ARCHIVE ACTIVE // 100% SECURE // PROTOCOL INITIATED //</span>
          <span className="retro-marquee-item">SYSTEM ONLINE // ARCHIVE ACTIVE // 100% SECURE // PROTOCOL INITIATED //</span>
        </div>
      </div>
      <section className="retro-hero">
        <div className="retro-hero-top">
          <div>EDITORIAL KNOWLEDGE BASE</div>
          <div className="retro-hero-stamp">SYSTEM ONLINE</div>
        </div>
        
        <div className="retro-hero-center">
          <div className="retro-hero-eyebrow">VIRTUAL STUDIO</div>
          <h1 className="retro-hero-title">TECH-LINGUIST LAB</h1>
          <div className="retro-hero-title-cn">科技语言学实验室</div>
          
          <div className="retro-hero-meta">
            <div className="retro-hero-meta-item">
              <div className="retro-hero-meta-key">状态 (STATUS)</div>
              <div className="retro-hero-meta-val">正常运行中<br/><em style={{color:'var(--teal)'}}>System Active</em></div>
              <svg width="100%" height="20" style={{marginTop: 12}}>
                <polyline points="0,15 20,15 30,5 50,5 60,15 100,15" fill="none" stroke="var(--teal)" strokeWidth="2"/>
                <circle cx="30" cy="5" r="3" fill="var(--teal)"/>
              </svg>
            </div>
            <div className="retro-hero-meta-item">
              <div className="retro-hero-meta-key">架构 (ARCH)</div>
              <div className="retro-hero-meta-val">Next.js App Router<br/><em style={{color:'var(--rust)'}}>React Server Components</em></div>
              <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
                <div style={{ flex: 1, height: 8, background: 'var(--rust)' }}></div>
                <div style={{ flex: 2, height: 8, background: 'var(--rust)', opacity: 0.3 }}></div>
                <div style={{ flex: 1, height: 8, background: 'var(--rust)' }}></div>
              </div>
            </div>
            <div className="retro-hero-meta-item">
              <div className="retro-hero-meta-key">数据库 (DATA)</div>
              <div className="retro-hero-meta-val">Notion API<br/><em style={{color:'var(--gold)'}}>Headless CMS</em></div>
              <svg width="100%" height="20" style={{marginTop: 12}}>
                <rect x="0" y="8" width="8" height="8" fill="var(--gold)"/>
                <rect x="12" y="4" width="8" height="12" fill="var(--gold)"/>
                <rect x="24" y="0" width="8" height="16" fill="var(--gold)"/>
                <rect x="36" y="10" width="8" height="6" fill="var(--gold)"/>
                <rect x="48" y="2" width="8" height="14" fill="var(--gold)"/>
              </svg>
            </div>
            <div className="retro-hero-meta-item">
              <div className="retro-hero-meta-key">渲染主题 (THEME)</div>
              <div className="retro-hero-meta-val">赛博档案局<br/><em style={{color:'var(--magenta)'}}>Vintage x Cyber</em></div>
              <div style={{ display: 'flex', gap: 2, marginTop: 12 }}>
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} style={{ width: 4, height: 16, background: 'var(--magenta)', opacity: ((i * 3 + 2) % 7) / 7 * 0.7 + 0.3 }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Nav for New Users */}
          <div className="retro-quick-nav" style={{ display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
            <Link href="/retro/archive" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label">DIR</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>01. 档案Archive</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>系统核心数据库，存放所有沉淀的知识与思考卷宗。</p>
            </Link>
            <Link href="/retro/lab" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label" style={{ color: 'var(--teal)', borderColor: 'var(--teal)' }}>EXE</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>02. 实验Lab</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>正在进行中的原型验证、灵感片段与代码实验。</p>
            </Link>
            <Link href="/retro/workflow" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label" style={{ color: 'var(--magenta)', borderColor: 'var(--magenta)' }}>WRK</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>03. 流程Workflow</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>沉淀的提示词资产与核心工具流体系。</p>
            </Link>
            <Link href="/retro/aievolutionlog" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label" style={{ color: 'var(--gold)', borderColor: 'var(--gold)' }}>LOG</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>04. 进化史AI Log</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>大语言模型演进时间轴及基准测试跑分全记录。</p>
            </Link>
            <Link href="/retro/pause" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label" style={{ color: 'var(--rust)', borderColor: 'var(--rust)' }}>LIF</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>05. 生活Pause</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>生活碎片，工作与技术之外的物理世界锚点。</p>
            </Link>
            <Link href="/retro/changelog" className="retro-card" style={{ flex: 1, minWidth: 200, textDecoration: 'none', color: 'inherit' }} onMouseEnter={playHover} onMouseDown={playClick}>
              <div className="retro-card-label" style={{ color: 'var(--ink-2)', borderColor: 'var(--ink-2)' }}>VER</div>
              <h3 style={{ margin: '16px 0 8px', fontSize: 18 }}>06. 记录Changelog</h3>
              <p style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>系统迭代记录，技术架构及版本的历史归档。</p>
            </Link>
          </div>
        </div>

        <div className="retro-hero-bottom">
          <div className="retro-hero-quote">
            “语言是技术的最终归宿”
            <div className="retro-hero-quote-author">— TECH-LINGUIST LAB</div>
          </div>
          <div className="retro-hero-pageno">P.00</div>
        </div>
      </section>
    </>
  );
}
