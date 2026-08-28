"use client";

import { useState } from "react";

type RepoProps = {
  id: string;
  title: string | null;
  desc: string | null;
  category: string | null;
  url: string | null;
  tags: string[];
  coverUrl: string | null;
  icon: string | null;
};

export function RetroLabTabs({ repos }: { repos: RepoProps[] }) {
  const [activeTab, setActiveTab] = useState<"projects" | "experiments">("projects");

  const experiments = repos.filter(r => {
    const cat = r.category?.toLowerCase() || "";
    return cat.includes("exp") || cat.includes("play");
  });
  const projects = repos.filter(r => !experiments.includes(r));

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.02</div>
        <div>
          <h2 className="retro-chapter-title">实验 <em>Lab</em></h2>
          <div className="retro-chapter-sub">EXPERIMENTAL DEPLOYMENTS. {repos.length} ACTIVE MODULES.</div>
        </div>
      </div>

      <div style={{ marginBottom: 32, display: 'flex', gap: 16 }}>
        <button
          onClick={() => setActiveTab("projects")}
          className={`retro-tab-btn ${activeTab === "projects" ? "active" : ""}`}
        >
          PROJECTS
        </button>
        <button
          onClick={() => setActiveTab("experiments")}
          className={`retro-tab-btn ${activeTab === "experiments" ? "active" : ""}`}
        >
          EXPERIMENTS
        </button>
      </div>

      <div className="retro-card-grid retro-grid-3">
        {(activeTab === "projects" ? projects : experiments).map((r, idx) => (
          <div key={r.id} className="retro-card" style={{ '--stagger-index': idx } as React.CSSProperties}>
            <div className={`retro-card-label ${activeTab === "projects" ? 'rust' : 'gold'}`}>
              {r.category?.toUpperCase() || "LAB"}
            </div>
            {r.coverUrl ? (
              <div className="retro-img-frame aspect-video" data-id={r.id.split('-')[0]}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.coverUrl} alt={r.title || "COVER"} />
              </div>
            ) : null}
            <h3 className="retro-card-title">
              {r.icon && r.icon.length < 5 ? (
                <span style={{ marginRight: 8, filter: 'grayscale(1)' }}>{r.icon}</span>
              ) : r.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.icon} alt="icon" style={{ width: 20, height: 20, display: 'inline-block', verticalAlign: 'text-bottom', marginRight: 8, filter: 'grayscale(1)' }} />
              ) : null}
              {r.title || "UNTITLED"}
            </h3>
            <div className="retro-card-body">
              <p>{r.desc || "NO_DESC"}</p>
              <p style={{ marginTop: 12 }}><strong>TAGS:</strong> {r.tags.join(", ") || "NONE"}</p>
              {r.url && (
                <p style={{ marginTop: 12 }}>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-1)', fontWeight: 'bold' }}>
                    [ LAUNCH_MODULE ]
                  </a>
                </p>
              )}
            </div>
            <div className="retro-card-num">L</div>
          </div>
        ))}
      </div>
    </section>
  );
}
