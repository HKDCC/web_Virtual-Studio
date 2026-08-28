"use client";

import { useState } from "react";
import Link from "next/link";
import { useRetroSound } from "@/hooks/useRetroSound";

type BookProps = {
  id: string;
  title: string | null;
  author: string | null;
  tags: string[];
  coverUrl: string | null;
};

type NoteProps = {
  id: string;
  title: string | null;
  category: string | null;
  date: string | null;
  tags: string[];
  coverUrl: string | null;
};

export function RetroArchiveTabs({ books, notes }: { books: BookProps[]; notes: NoteProps[] }) {
  const [activeTab, setActiveTab] = useState<"books" | "notes">("books");
  const { playHover, playClick } = useRetroSound();

  return (
    <section className="retro-chapter">
      <div className="retro-chapter-header">
        <div className="retro-chapter-num">CH.01</div>
        <div>
          <h2 className="retro-chapter-title">档案 <em>Archive</em></h2>
          <div className="retro-chapter-sub">ACCESSING DEEP STORAGE... {books.length} BKS, {notes.length} NTS FOUND.</div>
        </div>
      </div>

      <div style={{ marginBottom: 32, display: 'flex', gap: 16 }}>
        <button
          onClick={() => setActiveTab("books")}
          onMouseEnter={playHover}
          onMouseDown={playClick}
          style={{
            background: activeTab === "books" ? 'var(--ink)' : 'transparent',
            color: activeTab === "books" ? 'var(--paper-solid)' : 'var(--ink-2)',
            border: '2px solid var(--ink)',
            padding: '8px 24px',
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .2s'
          }}
        >
          BOOKS
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          onMouseEnter={playHover}
          onMouseDown={playClick}
          style={{
            background: activeTab === "notes" ? 'var(--ink)' : 'transparent',
            color: activeTab === "notes" ? 'var(--paper-solid)' : 'var(--ink-2)',
            border: '2px solid var(--ink)',
            padding: '8px 24px',
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all .2s'
          }}
        >
          NOTES
        </button>
      </div>

      {activeTab === "books" && (
        books.length === 0 ? (
          <div className="retro-empty-state" />
        ) : (
          <div className="retro-card-grid retro-grid-5">
            {books.map((b) => (
              <Link key={b.id} href={`/retro/p/${b.id}`} className="retro-card" onMouseEnter={playHover} onMouseDown={playClick}>
                <div className="retro-card-label">BOOK</div>
                {b.coverUrl ? (
                  <div className="retro-img-frame aspect-portrait" data-id={b.id.split('-')[0]}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.coverUrl} alt={b.title || "COVER"} />
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--line)', marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>NO_COVER</div>
                )}
                <h3 className="retro-card-title">{b.title || "UNTITLED"}</h3>
                <div className="retro-card-body">
                  <p><strong>AUTHOR:</strong> {b.author || "N/A"}</p>
                  <p><strong>TAGS:</strong> {b.tags.join(", ") || "NONE"}</p>
                </div>
                <div className="retro-card-num">B</div>
              </Link>
            ))}
          </div>
        )
      )}

      {activeTab === "notes" && (
        notes.length === 0 ? (
          <div className="retro-empty-state" />
        ) : (
          <div className="retro-card-grid retro-grid-3">
            {notes.map((n) => (
              <Link key={n.id} href={`/retro/p/${n.id}`} className="retro-card" onMouseEnter={playHover} onMouseDown={playClick}>
                <div className="retro-card-label teal">{n.category || "NOTE"}</div>
                {n.coverUrl ? (
                  <div className="retro-img-frame aspect-video" data-id={n.id.split('-')[0]}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.coverUrl} alt={n.title || "COVER"} />
                  </div>
                ) : (
                  <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--line)', marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>NO_COVER</div>
                )}
                <h3 className="retro-card-title">{n.title || "UNTITLED"}</h3>
                <div className="retro-card-body">
                  <p><strong>DATE:</strong> {n.date || "UNKNOWN"}</p>
                  <p><strong>TAGS:</strong> {n.tags.join(", ") || "NONE"}</p>
                </div>
                <div className="retro-card-num">N</div>
              </Link>
            ))}
          </div>
        )
      )}
    </section>
  );
}
