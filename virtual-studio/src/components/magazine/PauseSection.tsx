"use client";

import Link from "next/link";
import type { PauseItem } from "@/types/magazine";

interface PauseSectionProps {
  pause?: PauseItem[];
}

export function PauseSection({ pause = [] }: PauseSectionProps) {
  const safePause = Array.isArray(pause) ? pause : [];

  return (
    <section id="pause" className="block wrap">
      <div className="sec-head reveal">
        <p className="kicker">
          <b>05</b> / 生活层 · LIFE
        </p>
        <a className="util" href="/pause" title="全部照片墙">
          全部照片 ↗
        </a>
      </div>
      <h2 className="sec-title reveal">隙</h2>
      <p className="sec-lede reveal">想要一个 Happy End。</p>
      <div className="sec-body reveal">
        <div className="strip" id="strip">
          {safePause.map((p, i) => {
            const title = typeof p?.t === "string" ? p.t : "照片";
            const img = typeof p?.img === "string" && p.img ? p.img : `/photos/photo_${(i % 10) + 1}_.webp`;
            const date = typeof p?.d === "string" ? p.d : "";
            const loc = typeof p?.loc === "string" ? p.loc : "";
            const pageId = p?.id;

            const card = (
              <figure className="postcard">
                <div className="postcard-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    loading="lazy"
                    alt={title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes("/photos/")) {
                        target.src = `/photos/photo_${(i % 10) + 1}_.webp`;
                      }
                    }}
                  />
                </div>
                <figcaption>
                  <div className="pc-meta">
                    {date && <span className="pc-date">{date}</span>}
                    {loc && <span className="loc">{loc}</span>}
                  </div>
                  <h3>{title}</h3>
                </figcaption>
              </figure>
            );

            if (pageId) {
              return (
                <Link key={pageId || i} href={`/p/${pageId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {card}
                </Link>
              );
            }
            return <div key={i}>{card}</div>;
          })}
        </div>
        <p className="strip-hint">← 横向滑动浏览照片卡片 →</p>
      </div>
    </section>
  );
}
