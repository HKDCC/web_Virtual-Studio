"use client";

import { useState } from "react";

type ItemProps = {
  id: string;
  title: string | null;
  desc: string | null;
  tags: string[];
  url: string | null;
  coverUrl: string | null;
  icon: string | null;
};

export function RetroWorkflowTabs({ prompts, tools }: { prompts: ItemProps[]; tools: ItemProps[] }) {
  const [activeTab, setActiveTab] = useState<"prompts" | "tools">("prompts");

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.03</div>
        <div>
          <h2 className="retro-chapter-title">流程 <em>Workflow</em></h2>
          <div className="retro-chapter-sub">PROCESSORS AND COMMANDS. {prompts.length} PROMPTS, {tools.length} TOOLS.</div>
        </div>
      </div>

      <div style={{ marginBottom: 32, display: 'flex', gap: 16 }}>
        <button
          onClick={() => setActiveTab("prompts")}
          style={{
            background: activeTab === "prompts" ? 'var(--ink)' : 'transparent',
            color: activeTab === "prompts" ? 'var(--paper-solid)' : 'var(--ink-2)',
            border: '2px solid var(--ink)',
            padding: '8px 24px',
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .2s'
          }}
        >
          PROMPTS
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          style={{
            background: activeTab === "tools" ? 'var(--ink)' : 'transparent',
            color: activeTab === "tools" ? 'var(--paper-solid)' : 'var(--ink-2)',
            border: '2px solid var(--ink)',
            padding: '8px 24px',
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .2s'
          }}
        >
          TOOLS
        </button>
      </div>

      <div className="retro-card-grid retro-grid-3">
        {(activeTab === "prompts" ? prompts : tools).map((item) => (
          <div key={item.id} className="retro-card">
            <div className={`retro-card-label ${activeTab === "prompts" ? 'teal' : 'rust'}`}>
              {activeTab === "prompts" ? 'PROMPT' : 'TOOL'}
            </div>
            {item.coverUrl ? (
              <div className="retro-img-frame aspect-video" data-id={item.id.split('-')[0]}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.coverUrl} alt={item.title || "COVER"} />
              </div>
            ) : null}
            <h3 className="retro-card-title">
              {item.icon && item.icon.length < 5 ? (
                <span style={{ marginRight: 8, filter: 'grayscale(1)' }}>{item.icon}</span>
              ) : item.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.icon} alt="icon" style={{ width: 20, height: 20, display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 8, filter: 'grayscale(1)' }} />
              ) : null}
              {item.title || "UNTITLED"}
            </h3>
            <div className="retro-card-body">
              <p>{item.desc || "NO_DESC"}</p>
              <p style={{ marginTop: 12 }}><strong>TAGS:</strong> {item.tags.join(", ") || "NONE"}</p>
              {item.url && (
                <p style={{ marginTop: 12 }}>
                  <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-2)', fontWeight: 'bold' }}>
                    [ EXECUTE ]
                  </a>
                </p>
              )}
            </div>
            <div className="retro-card-num">W</div>
          </div>
        ))}
      </div>
    </section>
  );
}
