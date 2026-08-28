"use client";

import Link from "next/link";
import { PauseItem } from "@/lib/magazineData";

interface PauseSectionProps {
  pause: PauseItem[];
}

export function PauseSection({ pause }: PauseSectionProps) {
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
          {pause.map((p, i) => {
            const card = (
              <figure className="postcard">
                <div className="postcard-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    loading="lazy"
                    alt={p.t}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/tl-${i + 1}/640/480`;
                    }}
                  />
                </div>
                <figcaption>
                  <div className="pc-meta">
                    <span className="pc-date">{p.d}</span>
                    <span className="loc">{p.loc}</span>
                  </div>
                  <h3>{p.t}</h3>
                </figcaption>
              </figure>
            );

            if (p.id) {
              return (
                <Link key={p.id || i} href={`/p/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
