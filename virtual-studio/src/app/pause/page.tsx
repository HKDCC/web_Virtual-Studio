import Link from "next/link";
import { fetchMagazineData } from "@/lib/magazineData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PausePage() {
  const data = await fetchMagazineData();
  const items = Array.isArray(data?.pause) ? data.pause : [];

  const bg = ["bg-warm", "bg-cool", "bg-forest", "bg-dusk", "bg-stone", "bg-ink"] as const;

  return (
    <div className="magazine-layout wrap" style={{ paddingTop: "32px", paddingBottom: "80px" }}>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">PAUSE · 05 隙</p>
          <h1 className="section-title">隙</h1>
        </div>
        <p className="section-desc">想要一个 Happy End。</p>
      </div>

      <div className="pause-masonry">
        {items.map((p, idx) => {
          const title = p?.t || "";
          const coverUrl = p?.img || `/photos/photo_${(idx % 10) + 1}_.jpeg`;
          const date = p?.d || "";
          const location = p?.loc || "";
          const emoji = title?.trim()?.slice(0, 2) || "🌿";
          const b = bg[idx % bg.length];
          const pageId = p?.id;

          return (
            <Link key={pageId || idx} href={pageId ? `/p/${pageId}` : "#pause"} className="pause-item">
              <div className={`pause-block ${b}`}>
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt={title || "摄影作品"}
                    className="pause-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes("/photos/")) {
                        target.src = `/photos/photo_${(idx % 10) + 1}_.jpeg`;
                      }
                    }}
                  />
                ) : (
                  <div className="pause-block-inner">{emoji}</div>
                )}
                <div className="pause-overlay">
                  <div className="pause-meta">
                    {date && (
                      <div className="pause-meta-item">
                        <span className="pause-meta-icon">✦</span>
                        <span>{date}</span>
                      </div>
                    )}
                    {location && (
                      <div className="pause-meta-item">
                        <span className="pause-meta-icon">◉</span>
                        <span>{location}</span>
                      </div>
                    )}
                    {title && (
                      <div className="pause-meta-item">
                        <span className="pause-meta-icon">◇</span>
                        <span>{title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
