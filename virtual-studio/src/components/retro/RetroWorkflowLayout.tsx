"use client";

import React from "react";
import { MermaidChart } from "./MermaidChart";

export type ItemProps = {
  id: string;
  title: string | null;
  desc: string | null; // This will hold the Mermaid code for workflows
  tags: string[];
  url: string | null;
  coverUrl: string | null;
  icon: string | null;
};

export function RetroWorkflowLayout({ prompts, tools }: { prompts: ItemProps[]; tools: ItemProps[] }) {
  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.03</div>
        <div>
          <h2 className="retro-chapter-title">架构 <em>Workflow</em></h2>
          <div className="retro-chapter-sub">INTERACTIVE DIAGRAMS. {prompts.length} WORKFLOWS, {tools.length} TOOLS.</div>
        </div>
      </div>
      
      {/* Quick Navigation */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
        <a 
          href="#workflows-section" 
          style={{ textDecoration: 'none', padding: '8px 24px', border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: 13, background: 'rgba(205, 97, 85, 0.05)' }}
        >
          [01] WORKFLOWS 
        </a>
        <a 
          href="#tools-section" 
          style={{ textDecoration: 'none', padding: '8px 24px', border: '1px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: 13 }}
        >
          [02] TOOL LIBRARY
        </a>
      </div>

      {/* TOP SECTION: WORKFLOWS */}
      <div id="workflows-section" style={{ marginBottom: 64, scrollMarginTop: 100 }}>
        <h3 style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", borderBottom: "1px dashed var(--accent-soft)", paddingBottom: 8, marginBottom: 24 }}>
          [01] SYSTEM WORKFLOWS
        </h3>
        {prompts.length === 0 ? (
          <div style={{ color: "var(--ink-2)" }}>No workflows defined yet. Add items with Section=&quot;Prompts&quot; and write Mermaid code in Description.</div>
        ) : (
          <div className="retro-accordion-group" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {prompts.map((flow) => (
              <details key={flow.id} className="retro-accordion" style={{ 
                border: "2px solid var(--ink)", 
                background: "var(--paper-solid)",
                transition: "all 0.3s ease"
              }}>
                <summary style={{ 
                  padding: "16px 24px", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 16, 
                  fontWeight: "bold",
                  fontSize: 18,
                  fontFamily: "var(--font-heading)",
                  userSelect: "none"
                }} className="retro-accordion-header hover-glitch">
                  <span className="accordion-icon" style={{ fontSize: 14 }}>[+]</span>
                  <div style={{ width: 12, height: 12, background: "var(--teal)", borderRadius: "50%", display: "inline-block" }}></div>
                  <h4 style={{ fontSize: 20, margin: 0, display: "inline-block" }}>{flow.title}</h4>
                </summary>
                <div style={{ padding: "0 24px 24px 24px", borderTop: "2px dashed var(--ink-2)" }}>
                  {/* Render Mermaid Chart */}
                  <MermaidChart chart={flow.desc || "flowchart TD\\nA[Empty]"} tools={tools} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION: TOOL LIBRARY */}
      <div id="tools-section" style={{ scrollMarginTop: 100 }}>
        <h3 style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)", borderBottom: "1px dashed var(--accent-soft)", paddingBottom: 8, marginBottom: 24 }}>
          [02] TOOL LIBRARY
        </h3>
        <div className="retro-card-grid retro-grid-3">
          {tools.map((item, idx) => (
            <div 
              key={item.id} 
              id={`tool-card-${item.id}`} 
              className="retro-card" 
              style={{ '--stagger-index': idx, scrollMarginTop: 120 } as React.CSSProperties}
            >
              <div className="retro-card-label rust">TOOL</div>
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
      </div>
      
      {/* Dynamic Pulse Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-card {
          0% { box-shadow: 0 0 0 0 rgba(205, 97, 85, 0.7); border-color: var(--rust); transform: translateY(-5px); }
          70% { box-shadow: 0 0 0 15px rgba(205, 97, 85, 0); border-color: var(--rust); transform: translateY(-5px); }
          100% { box-shadow: 0 0 0 0 rgba(205, 97, 85, 0); border-color: var(--ink); transform: translateY(0); }
        }
        .pulse-highlight {
          animation: pulse-card 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          background: rgba(205, 97, 85, 0.05);
        }

        details.retro-accordion > summary {
          list-style: none;
        }
        details.retro-accordion > summary::-webkit-details-marker {
          display: none;
        }
        details.retro-accordion[open] > summary .accordion-icon {
          content: "[-]";
        }
        details.retro-accordion[open] {
          box-shadow: 4px 4px 0px var(--accent-2);
        }
        details.retro-accordion:not([open]):hover {
          box-shadow: 4px 4px 0px var(--ink);
          transform: translate(-2px, -2px);
        }
        .retro-accordion-header:hover {
          background: var(--paper);
          color: var(--accent);
        }

        /* Glitch text effect */
        .hover-glitch:hover {
          animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(-2deg); }
          40% { transform: skew(2deg); }
          60% { transform: skew(-1deg); }
          80% { transform: skew(1deg); }
          100% { transform: skew(0deg); }
        }
      `}} />
    </section>
  );
}
