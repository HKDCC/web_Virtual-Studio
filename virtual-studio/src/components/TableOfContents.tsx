"use client";

import { useEffect, useRef, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    // 使用 IntersectionObserver 监听每个标题是否在视口内
    const observer = new IntersectionObserver(
      (entries) => {
        // 找到所有可见的条目，取第一个（离视口顶部最近的）
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // 按离视口顶部的距离排序
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
      }}
      onMouseEnter={() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        timeoutRef.current = window.setTimeout(() => setIsVisible(false), 300);
      }}
    >
      {/* Collapsed bar */}
      <div
        style={{
          width: isVisible ? 4 : 3,
          height: 120,
          background: "var(--bg-3)",
          borderRadius: 2,
          cursor: "pointer",
          transition: "var(--spring)",
          opacity: isVisible ? 0 : 0.6,
        }}
      />

      {/* Expanded TOC */}
      <div
        style={{
          position: "absolute",
          right: "100%",
          top: 0,
          marginRight: 8,
          width: 200,
          background: "var(--bg)",
          border: "1px solid var(--bg-3)",
          borderRadius: "var(--r)",
          boxShadow: "var(--shadow-hover)",
          padding: "12px 0",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(10px)",
          pointerEvents: isVisible ? "auto" : "none",
          transition: "var(--spring)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0 12px 8px",
            borderBottom: "1px solid var(--bg-3)",
            marginBottom: 8,
          }}
        >
          目录
        </div>
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => handleClick(e, h.id)}
            style={{
              display: "block",
              padding: `6px 12px ${h.level === 3 ? 2 : 6}px ${12 + (h.level - 2) * 12}px`,
              fontSize: h.level === 2 ? 13 : 12,
              fontWeight: h.level === 2 ? 500 : 400,
              color: activeId === h.id ? "var(--accent)" : "var(--ink-2)",
              textDecoration: "none",
              transition: "var(--transition)",
              borderLeft: activeId === h.id ? "2px solid var(--accent)" : "2px solid transparent",
              marginLeft: -12,
              paddingLeft: 12 + (h.level - 2) * 12 + 12,
            }}
            onMouseEnter={(e) => {
              if (activeId !== h.id) {
                e.currentTarget.style.color = "var(--ink)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeId !== h.id) {
                e.currentTarget.style.color = "var(--ink-2)";
              }
            }}
          >
            {h.text}
          </a>
        ))}
      </div>
    </div>
  );
}
