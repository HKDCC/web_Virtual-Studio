"use client";

import { Suspense, useMemo, useState, useEffect } from "react";

export type ArchiveBook = {
  id: string;
  title: string;
  author?: string | null;
  tags: string[];
  coverUrl?: string | null;
  tagline?: string | null;
  rating?: number | null;
  downloadUrl?: string | null;
};

export type ArchiveNote = {
  id: string;
  title: string;
  category?: string | null;
  date?: string | null;
  excerpt?: string | null;
  tags: string[];
  coverUrl?: string | null;
  htmlContent?: string | null;
};

type MappedNote = {
  id: string;
  title: string;
  type: "html" | "md" | "notion";
  url: string;
  date?: string | null;
  excerpt?: string | null;
  category?: string | null;
  tags?: string[];
};

function BookCover(props: { title: string; coverUrl?: string | null; tone: number }) {
  if (props.coverUrl) {
    return (
      <div className="book-cover">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.coverUrl} alt={props.title} referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

function getRelatedNotes(book: ArchiveBook, allNotes: ArchiveNote[], localFiles: string[]): MappedNote[] {
  const related: MappedNote[] = [];

  const isMatch = (bookTitle: string, bookAuthor: string, targetName: string) => {
    const bt = bookTitle.toLowerCase();
    const ba = (bookAuthor || "").toLowerCase();
    const tn = targetName.toLowerCase();
    
    // Explicit key manual mapping for demo / precision
    if (bt.includes("经济学原理") && (tn.includes("mankiw") || tn.includes("经济学"))) return true;
    if (bt.includes("纳瓦尔") && (tn.includes("naval") || tn.includes("纳瓦尔"))) return true;
    
    // Check if entire book title or author is contained in targetName
    if (tn.includes(bt)) return true;
    if (ba && tn.includes(ba)) return true;
    
    // Fallback: search for overlap of at least 3 chars
    if (bt.length >= 3) {
      for (let i = 0; i <= bt.length - 3; i++) {
        const sub = bt.substring(i, i + 3);
        if (tn.includes(sub)) return true;
      }
    }
    return false;
  };

  // 1. Notion Notes
  allNotes.forEach((n) => {
    if (isMatch(book.title, book.author || "", n.title) || n.tags.some(t => isMatch(book.title, book.author || "", t))) {
      related.push({
        id: n.id,
        title: n.title,
        type: "notion",
        url: `/p/${n.id}`,
        date: n.date,
        excerpt: n.excerpt,
        category: n.category,
        tags: n.tags,
      });
    }
  });

  // 2. Local Files
  localFiles.forEach((file) => {
    if (isMatch(book.title, book.author || "", file)) {
      const isMd = file.endsWith(".md");
      let displayTitle = file.replace(/\.(html|md)$/, "");
      displayTitle = displayTitle.replace(/^【读书笔记】/, "");
      related.push({
        id: file,
        title: displayTitle,
        type: isMd ? "md" : "html",
        url: `/notes/${file}`,
      });
    }
  });

  return related;
}

function parseMarkdown(md: string): string {
  if (!md) return "";

  // Escape HTML tags to prevent XSS
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Lists
  const lines = html.split("\n");
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.substring(2);
      if (!inList) {
        lines[i] = "<ul><li>" + content + "</li>";
        inList = true;
      } else {
        lines[i] = "<li>" + content + "</li>";
      }
    } else {
      if (inList) {
        lines[i] = "</ul>" + lines[i];
        inList = false;
      }
    }
  }
  if (inList) {
    lines.push("</ul>");
  }
  html = lines.join("\n");

  // Paragraphs
  html = html
    .split(/\n{2,}/)
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      if (
        p.startsWith("<h") ||
        p.startsWith("<ul") ||
        p.startsWith("<li") ||
        p.startsWith("<pre") ||
        p.startsWith("<blockquote")
      ) {
        return p;
      }
      return `<p>${p.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="rating-stars" title={`评分：${rating}`}>
      {"★".repeat(fullStars)}
      {halfStar && "½"}
      {"☆".repeat(Math.max(0, emptyStars))}
    </span>
  );
}

function ArchiveTabsContent(props: { books: ArchiveBook[]; notes: ArchiveNote[]; localNotes: string[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<ArchiveBook | null>(null);
  const [activeNote, setActiveNote] = useState<MappedNote | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoadingMd, setIsLoadingMd] = useState(false);

  const closeDrawer = () => {
    setSelectedBook(null);
    setActiveNote(null);
    setMarkdownContent("");
  };

  const handleBackToList = () => {
    setActiveNote(null);
    setMarkdownContent("");
  };

  // Fetch MD content when note changes to MD
  useEffect(() => {
    if (activeNote && activeNote.type === "md") {
      setIsLoadingMd(true);
      setMarkdownContent("");
      fetch(activeNote.url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load markdown content");
          return res.text();
        })
        .then((text) => {
          setMarkdownContent(text);
          setIsLoadingMd(false);
        })
        .catch((err) => {
          console.error("Failed to load markdown:", err);
          setMarkdownContent("加载笔记失败，请重试。");
          setIsLoadingMd(false);
        });
    }
  }, [activeNote]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return props.books;
    const q = searchQuery.toLowerCase();
    return props.books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [props.books, searchQuery]);

  const relatedNotes = useMemo(() => {
    if (!selectedBook) return [];
    return getRelatedNotes(selectedBook, props.notes, props.localNotes);
  }, [selectedBook, props.notes, props.localNotes]);

  const handleCopyUrl = (note: MappedNote) => {
    const fullUrl = typeof window !== "undefined" ? window.location.origin + note.url : note.url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert("笔记链接已复制！");
    }).catch((err) => {
      console.error("Copy failed:", err);
    });
  };

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Archive · 输入层</p>
          <h1 className="section-title">库</h1>
        </div>
        <p className="section-desc">收藏与阅读是认知的基础设施。这里存放所有值得二次翻阅的内容。</p>
      </div>

      <div className={`archive-container ${selectedBook ? "drawer-open" : ""}`}>
        <div className="archive-main-content">
          <div className="archive-search-container">
            <div className="search-box-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="搜索书籍、作者、标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="archive-search-input"
              />
            </div>
          </div>

          <div className="shelf-grid">
            {filteredBooks.map((b, idx) => (
              <div
                key={b.id}
                className={`book-card ${selectedBook?.id === b.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedBook(b);
                  if (selectedBook?.id !== b.id) {
                    setActiveNote(null);
                    setMarkdownContent("");
                  }
                }}
                style={{ outline: "none" }}
              >
                <BookCover title={b.title} coverUrl={b.coverUrl} tone={idx} />
                <div className="book-meta">
                  <div className="book-name">{b.title || "Untitled"}</div>
                  {b.author ? <div className="book-author">{b.author}</div> : null}
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
              </div>
            ))}
            {filteredBooks.length === 0 && (
              <div className="shelf-empty">无匹配的书籍。</div>
            )}
          </div>
        </div>

        {/* Drawer Overlay */}
        <div
          className={`drawer-overlay ${selectedBook ? "active" : ""}`}
          onClick={closeDrawer}
        />

        {/* Drawer Panel */}
        <div className={`reading-drawer ${selectedBook ? "active" : ""}`}>
          {selectedBook && (
            <>
              {activeNote ? (
                // State B: Reading Note
                <>
                  <div className="drawer-header">
                    <button className="drawer-back-btn" onClick={handleBackToList}>
                      ← 列表
                    </button>
                    <span className="drawer-note-title" title={activeNote.title}>
                      {activeNote.title}
                    </span>
                    <div className="drawer-tools">
                      <button className="drawer-btn" onClick={() => handleCopyUrl(activeNote)}>
                        复制
                      </button>
                      <a
                        className="drawer-btn"
                        href={activeNote.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        新开 ↗
                      </a>
                      <button className="drawer-close" onClick={closeDrawer}>
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="drawer-body">
                    {activeNote.type === "md" ? (
                      <div className="drawer-reader-pane">
                        {isLoadingMd ? (
                          <div className="reader-loading">加载中...</div>
                        ) : (
                          <div
                            className="markdown-body"
                            dangerouslySetInnerHTML={{
                              __html: parseMarkdown(markdownContent),
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <iframe
                        src={activeNote.type === "notion" ? `${activeNote.url}?embed=true` : activeNote.url}
                        className="note-iframe"
                        title={activeNote.title}
                      />
                    )}
                  </div>
                </>
              ) : (
                // State A: Book Profile & Related Notes List
                <>
                  <div className="drawer-header">
                    <span className="drawer-title">书籍详情</span>
                    <button className="drawer-close" onClick={closeDrawer}>
                      ✕
                    </button>
                  </div>
                  <div className="drawer-body-list">
                    <div className="drawer-book-profile">
                      <div className="drawer-book-cover-wrap">
                        <BookCover
                          title={selectedBook.title}
                          coverUrl={selectedBook.coverUrl}
                          tone={0}
                        />
                      </div>
                      <div className="drawer-book-info">
                        <h2 className="drawer-book-title">{selectedBook.title}</h2>
                        {selectedBook.author && (
                          <p className="drawer-book-author">作者：{selectedBook.author}</p>
                        )}
                        {selectedBook.rating && (
                          <div className="drawer-book-rating">
                            {renderStars(selectedBook.rating)}
                            <span className="rating-num">{selectedBook.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {selectedBook.tagline && (
                          <p className="drawer-book-tagline">“ {selectedBook.tagline} ”</p>
                        )}
                        {selectedBook.downloadUrl && (
                          <a
                            href={selectedBook.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="drawer-book-download-btn"
                          >
                            链接 ↗
                          </a>
                        )}
                        {selectedBook.tags.length > 0 && (
                          <div className="drawer-book-tags">
                            {selectedBook.tags.map((t) => (
                              <span key={t} className="book-tag">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="drawer-notes-section">
                      <h3 className="drawer-section-title">相关笔记 ({relatedNotes.length})</h3>
                      {relatedNotes.length > 0 ? (
                        <div className="drawer-notes-list">
                          {relatedNotes.map((n) => (
                            <div
                              key={n.id}
                              className="drawer-note-item-card"
                              onClick={() => setActiveNote(n)}
                            >
                              <div className="drawer-note-item-meta">
                                <span className={`format-badge format-${n.type}`}>
                                  {n.type.toUpperCase()}
                                </span>
                                {n.date && <span className="drawer-note-item-date">{n.date}</span>}
                              </div>
                              <h4 className="drawer-note-item-title">{n.title}</h4>
                              {n.excerpt && (
                                <p className="drawer-note-item-excerpt">{n.excerpt}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="drawer-notes-empty">
                          暂无关联笔记。
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function ArchiveTabs(props: { books: ArchiveBook[]; notes: ArchiveNote[]; localNotes: string[] }) {
  return (
    <Suspense fallback={<div className="shelf-empty">加载中...</div>}>
      <ArchiveTabsContent {...props} />
    </Suspense>
  );
}
