"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ArchiveBook = {
  id: string;
  title: string;
  author?: string | null;
  tags: string[];
  coverUrl?: string | null;
};

export type ArchiveNote = {
  id: string;
  title: string;
  category?: string | null;
  date?: string | null;
  excerpt?: string | null;
  tags: string[];
  coverUrl?: string | null;
};

function BookCover(props: { title: string; coverUrl?: string | null; tone: number }) {
  if (props.coverUrl) {
    return (
      <div className="book-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.coverUrl} alt={props.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  const tones = [
    "linear-gradient(145deg, #2C5F8A, #1a3a5c)",
    "linear-gradient(145deg, #8B7355, #5a4a38)",
    "linear-gradient(145deg, #2D6A4F, #1a4030)",
    "linear-gradient(145deg, #6B4226, #3d2516)",
    "linear-gradient(145deg, #4A4063, #2a243a)",
    "linear-gradient(145deg, #B5451B, #7a2e12)",
  ];

  return (
    <div className="book-cover">
      <div className="book-cover-inner" style={{ background: tones[props.tone % tones.length] }}>
        {props.title}
      </div>
    </div>
  );
}

export function ArchiveTabs(props: { books: ArchiveBook[]; notes: ArchiveNote[] }) {
  const [tab, setTab] = useState<"library" | "notes">("library");

  const books = useMemo(() => props.books, [props.books]);
  const notes = useMemo(() => props.notes, [props.notes]);

  return (
    <>
      <div className="workflow-tabs">
        <button type="button" onClick={() => setTab("library")} className={`wf-tab ${tab === "library" ? "active" : ""}`}>
          电子书架
        </button>
        <button type="button" onClick={() => setTab("notes")} className={`wf-tab ${tab === "notes" ? "active" : ""}`}>
          读书笔记
        </button>
      </div>

      {tab === "library" ? (
        <div className="wf-panel active" id="archive-library">
          <div className="shelf-grid">
            {books.map((b, idx) => (
              <Link
                key={b.id}
                href={`/p/${b.id}`}
                className="book-card"
              >
                <BookCover title={b.title} coverUrl={b.coverUrl} tone={idx} />
                <div className="book-meta">
                  <div className="book-name">{b.title || "Untitled"}</div>
                  {b.author ? (
                    <div className="book-author">{b.author}</div>
                  ) : null}
                  {b.tags.length ? (
                    <div className="book-tags">
                      {b.tags.slice(0, 4).map((t) => (
                        <span key={t} className="book-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="wf-panel active" id="archive-notes">
          <div className="notes-container">
            {notes.map((n) => (
              <Link
                key={n.id}
                href={`/p/${n.id}`}
                className="note-card"
              >
                <div className="note-card-meta">
                  {n.category ? (
                    <span className="note-cat">{n.category}</span>
                  ) : null}
                  {n.date ? <span className="note-date">{n.date}</span> : null}
                </div>
                <h3 className="note-title">{n.title || "Untitled"}</h3>
                {n.excerpt ? <p className="note-excerpt">{n.excerpt}</p> : null}
                <div className="note-footer">
                  <div className="note-tags">
                    {n.tags.slice(0, 4).map((t) => (
                      <span key={t} className="book-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="note-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

