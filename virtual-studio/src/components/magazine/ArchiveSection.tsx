"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BookItem } from "@/types/magazine";

interface ArchiveSectionProps {
  books: BookItem[];
}

export function ArchiveSection({ books = [] }: ArchiveSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    const cats = new Set<string>();
    cats.add("全部");
    list.forEach((b) => {
      if (b && b.c) cats.add(b.c);
    });
    return Array.from(cats);
  }, [books]);

  const filteredBooks = useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    if (selectedCategory === "全部") return list;
    return list.filter((b) => b && b.c === selectedCategory);
  }, [books, selectedCategory]);

  return (
    <section id="archive" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>03</b> / 输入层 · INPUT
        </p>
        <span className="util" id="archCount">
          {filteredBooks.length} 本
        </span>
      </div>
      <h2 className="sec-title reveal">库</h2>
      <p className="sec-lede reveal">收藏与阅读是认知的基础设施。这里存放所有值得二次翻阅的内容。</p>
      <div className="sec-body reveal">
        <div className="chips" role="group" aria-label="按分类筛选">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? "active" : ""}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="booklist" id="bookList">
          {filteredBooks.map((b, i) => {
            return (
              <div
                key={b.id || i}
                className="bookrow"
                data-cat={b.c}
                onClick={() => b.id && router.push(`/p/${b.id}`)}
                style={{ cursor: b.id ? "pointer" : undefined }}
              >
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                
                {/* Book Cover Thumbnail */}
                <div className="book-cover-cell">
                  {b.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.coverUrl}
                      alt={b.t}
                      className="book-thumb"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="book-thumb-placeholder">
                      <span>{b.t.slice(0, 1)}</span>
                    </div>
                  )}
                </div>

                <div className="b-main">
                  <div className="b-title-row">
                    <h3>
                      {b.id ? (
                        <Link href={`/p/${b.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {b.t}
                        </Link>
                      ) : (
                        b.t
                      )}
                    </h3>
                    {b.rating && (
                      <span className="book-stars">
                        {"★".repeat(Math.min(5, Math.floor(b.rating)))} <b style={{ color: "var(--accent)" }}>{b.rating}</b>
                      </span>
                    )}
                  </div>
                  <div className="b-sub-row">
                    <span className="author">{b.a}</span>
                    {b.tagline && <span className="tagline">“{b.tagline}”</span>}
                  </div>
                </div>

                <div className="book-right-meta">
                  <span className="cat">{b.c}</span>
                  {b.downloadUrl && (
                    <a
                      href={b.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                      onClick={(e) => e.stopPropagation()}
                      title={`下载《${b.t}》电子书`}
                    >
                      下载 EPUB ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
