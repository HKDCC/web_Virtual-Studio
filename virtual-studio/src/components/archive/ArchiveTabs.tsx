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

function wfTab(active: boolean): React.CSSProperties {
  return {
    fontSize: 13,
    padding: "8px 20px",
    cursor: "pointer",
    color: active ? "var(--accent)" : "var(--ink-2)",
    borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
    transition: "var(--transition)",
    fontWeight: active ? 500 : 400,
    marginBottom: -1,
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
  };
}

function tagStyle(): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 9,
    padding: "2px 7px",
    borderRadius: 4,
    background: "var(--accent-pale)",
    color: "var(--accent)",
    letterSpacing: "0.05em",
  };
}

function BookCover(props: { title: string; coverUrl?: string | null; tone: number }) {
  if (props.coverUrl) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: "2 / 3",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "var(--shadow)",
          background: "var(--bg-2)",
        }}
      >
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
    <div
      style={{
        width: "100%",
        aspectRatio: "2 / 3",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        background: tones[props.tone % tones.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        color: "white",
        textAlign: "center",
        lineHeight: 1.5,
        fontFamily: "var(--serif)",
        fontSize: 14,
        fontWeight: 400,
      }}
    >
      {props.title}
    </div>
  );
}

export function ArchiveTabs(props: { books: ArchiveBook[]; notes: ArchiveNote[] }) {
  const [tab, setTab] = useState<"library" | "notes">("library");

  const books = useMemo(() => props.books, [props.books]);
  const notes = useMemo(() => props.notes, [props.notes]);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "24px 48px 0",
          maxWidth: 1200,
          margin: "0 auto",
          borderBottom: "1px solid var(--bg-3)",
        }}
      >
        <button type="button" onClick={() => setTab("library")} style={wfTab(tab === "library")}>
          电子书架
        </button>
        <button type="button" onClick={() => setTab("notes")} style={wfTab(tab === "notes")}>
          读书笔记
        </button>
      </div>

      {tab === "library" ? (
        <div style={{ padding: "32px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 24,
            }}
          >
            {books.map((b, idx) => (
              <Link
                key={b.id}
                href={`/p/${b.id}`}
                style={{ textDecoration: "none", color: "inherit", cursor: "pointer", transition: "var(--spring)" }}
              >
                <BookCover title={b.title} coverUrl={b.coverUrl} tone={idx} />
                <div style={{ padding: "12px 0 0" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4, lineHeight: 1.4 }}>
                    {b.title || "Untitled"}
                  </div>
                  {b.author ? (
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{b.author}</div>
                  ) : null}
                  {b.tags.length ? (
                    <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                      {b.tags.slice(0, 4).map((t) => (
                        <span key={t} style={tagStyle()}>
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
        <div style={{ padding: "32px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {notes.map((n) => (
              <Link
                key={n.id}
                href={`/p/${n.id}`}
                style={{
                  border: "1px solid var(--bg-3)",
                  borderRadius: "var(--r)",
                  padding: 24,
                  cursor: "pointer",
                  transition: "var(--spring)",
                  background: "var(--bg)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
                  {n.category ? (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "var(--accent-pale)",
                        color: "var(--accent)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {n.category}
                    </span>
                  ) : null}
                  {n.date ? <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{n.date}</span> : null}
                </div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, marginBottom: 10, color: "var(--ink)" }}>
                  {n.title || "Untitled"}
                </h3>
                {n.excerpt ? <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{n.excerpt}</p> : null}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {n.tags.slice(0, 4).map((t) => (
                      <span key={t} style={tagStyle()}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span style={{ color: "var(--accent)", fontSize: 16, transition: "var(--transition)" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

