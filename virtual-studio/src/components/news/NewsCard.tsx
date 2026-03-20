"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type NewsItem = {
  id: string;
  title: string;
  date?: string | null;
  sources: string[];
  categories: string[];
};

const ALL_CATS = ["🤖 新模型", "💰 商业", "🔓 开源", "⚠️ 安全", "⚡ 产品", "💵 价格", "🎯 Demo", "💬 社区", "📰 其他"];

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function CatBadge(props: { cat: string }) {
  return <span className="news-cat">{props.cat}</span>;
}

function SourceBadge(props: { source: string }) {
  const cls = props.source === "HackerNews" ? "news-src hn"
    : props.source === "TechCrunch" ? "news-src tc"
    : "news-src smol";
  return <span className={cls}>{props.source}</span>;
}

export function NewsCard(props: { items: NewsItem[] }) {
  const [cat, setCat] = useState<string>("全部");

  const filtered = useMemo(() => {
    if (cat === "全部") return props.items;
    return props.items.filter((i) => i.categories.includes(cat));
  }, [props.items, cat]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, NewsItem[]>();
    for (const item of filtered) {
      const key = item.date ?? "无日期";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const availableCats = useMemo(() => {
    const cats = new Set<string>();
    for (const item of props.items) {
      for (const c of item.categories) cats.add(c);
    }
    return cats;
  }, [props.items]);

  return (
    <div className="news-container">
      {/* Category filter tabs */}
      <div className="workflow-tabs">
        <button
          type="button"
          onClick={() => setCat("全部")}
          className={`wf-tab ${cat === "全部" ? "active" : ""}`}
        >
          全部
        </button>
        {ALL_CATS.filter((c) => availableCats.has(c)).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`wf-tab ${cat === c ? "active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="news-list">
        {grouped.length === 0 ? (
          <div className="news-empty">暂无内容</div>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date} className="news-day">
              <div className="news-date-header">
                <span className="news-date-label">{formatDate(date) ?? date}</span>
                <span className="news-date-count">{items.length} 条</span>
              </div>
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/p/${item.id}?from=news`}
                  className="news-item-card"
                >
                  <div className="news-item-meta">
                    <div className="news-item-tags">
                      {item.categories.map((c) => (
                        <CatBadge key={c} cat={c} />
                      ))}
                    </div>
                    <div className="news-item-sources">
                      {item.sources.map((s) => (
                        <SourceBadge key={s} source={s} />
                      ))}
                    </div>
                  </div>
                  <h3 className="news-item-title">{item.title}</h3>
                  <span className="news-item-arrow">→</span>
                </Link>
              ))}
            </div>
          ))
        )}
      </div>

      <style>{`
        .news-container {
          margin-top: 40px;
        }
        .news-list {
          margin-top: 32px;
        }
        .news-day {
          margin-bottom: 48px;
        }
        .news-date-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--bg-3);
        }
        .news-date-label {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--ink-3);
        }
        .news-date-count {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--ink-4);
        }
        .news-item-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 20px 24px;
          border: 1px solid var(--bg-3);
          border-radius: var(--r);
          margin-bottom: 12px;
          cursor: pointer;
          transition: var(--spring);
          background: var(--bg);
          text-decoration: none;
          color: inherit;
          position: relative;
        }
        .news-item-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
          border-color: var(--accent-soft);
        }
        .news-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .news-item-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .news-cat {
          font-family: var(--mono);
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 4px;
          background: var(--accent-pale);
          color: var(--accent);
          letter-spacing: 0.06em;
        }
        .news-item-sources {
          display: flex;
          gap: 6px;
          margin-left: auto;
        }
        .news-src {
          font-family: var(--mono);
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }
        .news-src.hn { background: #f5822b22; color: #f5822b; }
        .news-src.tc { background: #0a9e0122; color: #0a9e01; }
        .news-src.smol { background: #6d00d922; color: #6d00d9; }
        .news-item-title {
          font-family: var(--serif);
          font-size: 17px;
          font-weight: 400;
          line-height: 1.4;
          color: var(--ink-1);
        }
        .news-item-arrow {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--ink-4);
          font-size: 16px;
          opacity: 0;
          transition: opacity var(--spring);
        }
        .news-item-card:hover .news-item-arrow {
          opacity: 1;
        }
        .news-empty {
          text-align: center;
          padding: 60px 0;
          color: var(--ink-4);
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
