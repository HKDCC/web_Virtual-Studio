"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookItem } from "@/lib/magazineData";

interface ArchiveSectionProps {
  books: BookItem[];
}

export function ArchiveSection({ books }: ArchiveSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("全部");
    books.forEach((b) => {
      if (b.c) cats.add(b.c);
    });
    return Array.from(cats);
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "全部") return books;
    return books.filter((b) => b.c === selectedCategory);
  }, [books, selectedCategory]);

  return (
    <section id="archive" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>01</b> / 输入层 · INPUT
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
              className="chip"
              type="button"
              data-v={cat}
              aria-pressed={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="booklist" id="bookList">
          {filteredBooks.map((b, i) => {
            const rowContent = (
              <div className="bookrow" data-cat={b.c}>
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <div className="b-main">
                  <h3>{b.t}</h3>
                  <span className="author">{b.a}</span>
                </div>
                <span className="cat">{b.c}</span>
              </div>
            );

            if (b.id) {
              return (
                <Link key={b.id || i} href={`/p/${b.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {rowContent}
                </Link>
              );
            }
            return <div key={i}>{rowContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
