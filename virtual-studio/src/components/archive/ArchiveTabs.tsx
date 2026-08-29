"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TagPill } from "../common/TagPill";

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
        <img
          src={props.coverUrl}
          alt={props.title}
          referrerPolicy="no-referrer"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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

    if (bt.includes("经济学原理") && (tn.includes("mankiw") || tn.includes("经济学"))) return true;
    if (bt.includes("纳瓦尔") && (tn.includes("naval") || tn.includes("纳瓦尔"))) return true;

    if (tn.includes(bt)) return true;
    if (ba && tn.includes(ba)) return true;

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
    if (isMatch(book.title, book.author || "", n.title) || n.tags.some((t) => isMatch(book.title, book.author || "", t))) {
      related.push({
        id: n.id,
        title: n.title,
        type: n.htmlContent ? "html" : "notion",
        url: n.htmlContent || `/p/${n.id}`,
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

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  const lines = html.split("\n");
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        lines[i] = "<ul><li>" + line.substring(2) + "</li>";
        inList = true;
      } else {
        lines[i] = "<li>" + line.substring(2) + "</li>";
      }
    } else if (inList) {
      lines[i - 1] += "</ul>";
      inList = false;
    }
  }
  if (inList) {
    lines[lines.length - 1] += "</ul>";
  }
  html = lines.join("\n");

  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
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
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab") === "notes" ? "notes" : "books";
  const [activeTab, setActiveTab] = useState<"books" | "notes">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<ArchiveBook | null>(null);
  const [activeNote, setActiveNote] = useState<MappedNote | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [isLoadingMd, setIsLoadingMd] = useState(false);

  useEffect(() => {
    if (searchParams?.get("tab") === "notes") {
      setActiveTab("notes");
    }
  }, [searchParams]);

  const closeDrawer = () => {
    setSelectedBook(null);
    setActiveNote(null);
    setMarkdownContent("");
  };

  const handleBackToList = () => {
    setActiveNote(null);
    setMarkdownContent("");
  };

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

  const [isExpandedTags, setIsExpandedTags] = useState(false);

  // Extract all unique tags for active tab
  const noteTagsList = useMemo(() => {
    const map = new Map<string, number>();
    props.notes.forEach((n) => {
      n.tags?.forEach((t) => {
        if (t !== "读书笔记") { // filter redundant category tag
          map.set(t, (map.get(t) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [props.notes]);

  const bookTagsList = useMemo(() => {
    const map = new Map<string, number>();
    props.books.forEach((b) => {
      b.tags?.forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [props.books]);

  const currentTagsList = activeTab === "books" ? bookTagsList : noteTagsList;
  const visibleTagsList = isExpandedTags ? currentTagsList : currentTagsList.slice(0, 12);

  const filteredBooks = useMemo(() => {
    let list = props.books;
    if (selectedTag) {
      list = list.filter((b) => b.tags?.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.author || "").toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [props.books, selectedTag, searchQuery]);

  const filteredNotes = useMemo(() => {
    let list = props.notes;
    if (selectedTag) {
      list = list.filter((n) => n.tags?.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.category || "").toLowerCase().includes(q) ||
          (n.excerpt || "").toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [props.notes, selectedTag, searchQuery]);

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

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  const totalCount = activeTab === "books" ? props.books.length : props.notes.length;
  const currentCount = activeTab === "books" ? filteredBooks.length : filteredNotes.length;

  return (
    <div className="archive-page-wrap">
      {/* Breadcrumb Navigation */}
      <nav className="archive-breadcrumb-nav">
        <Link href="/" className="archive-breadcrumb-link">
          首页
        </Link>
        <span>/</span>
        <Link href="/#archive" className="archive-breadcrumb-link">
          03 库 · 书架
        </Link>
        <span>/</span>
        <span style={{ color: "var(--ink)" }}>
          {activeTab === "books" ? "书架归档" : "全部深度笔记"}
        </span>
      </nav>

      {/* Header Box */}
      <div className="archive-header-box">
        <h1 className="archive-page-title">
          {activeTab === "books" ? "书库 · 藏书与精选" : "全部笔记 · 智识资产"}
        </h1>
        <p className="archive-page-desc">
          收藏、深度阅读与知识沉淀。这里存放所有经过系统化思考并值得反复研读的智识资产。
        </p>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="archive-tab-switcher">
        <button
          className={`archive-tab-btn ${activeTab === "books" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("books");
            setSelectedTag(null);
            closeDrawer();
          }}
          type="button"
        >
          <span>📚 书库 · Books</span>
          <span className="archive-tab-count">{props.books.length}</span>
        </button>
        <button
          className={`archive-tab-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("notes");
            setSelectedTag(null);
            closeDrawer();
          }}
          type="button"
        >
          <span>📝 全部笔记 · Notes</span>
          <span className="archive-tab-count">{props.notes.length}</span>
        </button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="archive-filter-bar">
        <div className="archive-search-box">
          <span className="archive-search-icon">🔍</span>
          <input
            type="text"
            placeholder={activeTab === "books" ? "搜索书名、作者、标签、主题..." : "搜索笔记标题、标签、关键词、核心摘要..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="archive-search-input-field"
          />
          {searchQuery && (
            <button
              className="archive-search-clear"
              onClick={() => setSearchQuery("")}
              title="清空搜索"
              type="button"
            >
              ✕
            </button>
          )}
          <span className="archive-search-stats">
            显示 {currentCount} / 共 {totalCount} 篇
          </span>
        </div>

        {/* Dynamic Tag Filter Cloud */}
        {currentTagsList.length > 0 && (
          <div className="archive-tag-cloud">
            <button
              className={`archive-tag-filter-btn ${selectedTag === null ? "active" : ""}`}
              onClick={() => setSelectedTag(null)}
              type="button"
            >
              <span>全部</span>
              <span className="tag-badge-num">({totalCount})</span>
            </button>

            {visibleTagsList.map(({ tag, count }) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  className={`archive-tag-filter-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  type="button"
                >
                  <span>{tag}</span>
                  <span className="tag-badge-num">({count})</span>
                </button>
              );
            })}

            {currentTagsList.length > 12 && (
              <button
                className="archive-tag-filter-btn"
                onClick={() => setIsExpandedTags(!isExpandedTags)}
                type="button"
                style={{
                  background: "var(--accent-soft)",
                  borderColor: "rgba(194, 65, 12, 0.2)",
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                <span>
                  {isExpandedTags
                    ? "收起 ▴"
                    : `更多标签 (+${currentTagsList.length - 12}) ▾`}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={`archive-container ${selectedBook ? "drawer-open" : ""}`}>
        <div className="archive-main-content">
          {activeTab === "books" ? (
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
                <div className="archive-empty-state">
                  <p>没有找到与当前筛选条件匹配的书籍。</p>
                  <button className="archive-empty-reset-btn" onClick={handleClearFilters} type="button">
                    清空筛选条件
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="notes-archive-grid">
              {filteredNotes.map((n) => {
                const targetUrl = n.htmlContent || `/p/${n.id}`;
                const heroLight = `/notes_heroes/${n.id}_light.png`;
                const heroDark = `/notes_heroes/${n.id}_dark.png`;
                const isExternal = Boolean(n.htmlContent);

                return (
                  <article key={n.id} className="note-card">
                    <div className="note-card-hero-wrap">
                      {isExternal ? (
                        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={heroLight}
                            alt={n.title}
                            className="note-hero-img theme-light-only"
                            loading="lazy"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={heroDark}
                            alt={n.title}
                            className="note-hero-img theme-dark-only"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <Link href={targetUrl}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={heroLight}
                            alt={n.title}
                            className="note-hero-img theme-light-only"
                            loading="lazy"
                          />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={heroDark}
                            alt={n.title}
                            className="note-hero-img theme-dark-only"
                            loading="lazy"
                          />
                        </Link>
                      )}
                    </div>

                    <div className="note-card-content">
                      <div className="note-card-meta">
                        {n.date && <span className="note-date">{n.date}</span>}
                        {n.category && <span className="note-cat">{n.category}</span>}
                      </div>

                      {n.tags && n.tags.length > 0 && (
                        <div className="note-tags-wrap">
                          {n.tags.map((t) => (
                            <TagPill key={t} tag={t} />
                          ))}
                        </div>
                      )}

                      <h3 className="note-title">
                        {isExternal ? (
                          <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                            {n.title}
                          </a>
                        ) : (
                          <Link href={targetUrl}>
                            {n.title}
                          </Link>
                        )}
                      </h3>

                      {n.excerpt && <p className="note-excerpt">{n.excerpt}</p>}

                      <div className="note-links">
                        <Link href={`/p/${n.id}`} className="note-link-btn">
                          阅读笔记 ↗
                        </Link>
                        {n.htmlContent && (
                          <a
                            href={n.htmlContent}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="note-link-btn note-link-html"
                          >
                            独立排版 ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
              {filteredNotes.length === 0 && (
                <div className="archive-empty-state" style={{ gridColumn: "1 / -1" }}>
                  <p>没有找到与当前筛选条件匹配的笔记。</p>
                  <button className="archive-empty-reset-btn" onClick={handleClearFilters} type="button">
                    清空筛选条件
                  </button>
                </div>
              )}
            </div>
          )}
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
                            下载 EPUB ↗
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
                      <h3 className="drawer-section-title">关联笔记 · 知识图谱</h3>
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
    </div>
  );
}

export function ArchiveTabs(props: { books: ArchiveBook[]; notes: ArchiveNote[]; localNotes: string[] }) {
  return (
    <Suspense fallback={<div className="shelf-empty">加载中...</div>}>
      <ArchiveTabsContent {...props} />
    </Suspense>
  );
}
