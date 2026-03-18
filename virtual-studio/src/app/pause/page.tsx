import Link from "next/link";
import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getDate, getRichText } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function firstFileUrl(filesProp: unknown): string | null {
  if (!isObj(filesProp)) return null;
  const files = (filesProp as Record<string, unknown>)["files"];
  if (!Array.isArray(files) || files.length === 0) return null;
  const f = files[0];
  if (!isObj(f)) return null;
  const type = f["type"];
  if (type === "external") {
    const external = f["external"];
    if (!isObj(external)) return null;
    const url = external["url"];
    return typeof url === "string" ? url : null;
  }
  if (type === "file") {
    const file = f["file"];
    if (!isObj(file)) return null;
    const url = file["url"];
    return typeof url === "string" ? url : null;
  }
  return null;
}

export default async function PausePage() {
  const db = env.NOTION_PAUSE_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Pause 需要配置 NOTION_TOKEN / NOTION_PAUSE_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 60, maxPages: 8 });

  const bg = ["bg-warm", "bg-cool", "bg-forest", "bg-dusk", "bg-stone", "bg-ink"] as const;
  const size = ["s", "m", "l"] as const;

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Pause · 生活层</p>
          <h1 className="section-title">隙</h1>
        </div>
        <p className="section-desc">想要一个 Happy End。</p>
      </div>

      <div className="pause-masonry">
        {items.map((p, idx) => {
          const props = p.properties as unknown as Record<string, unknown>;
          const title = getPageTitle(p);
          const coverUrl = firstFileUrl(props["Cover"]);
          const date = getDate(props, "Date");
          const location = getRichText(props, "Location");
          const emoji = title?.trim()?.slice(0, 2) || "🌿";
          const b = bg[idx % bg.length];
          const s = size[idx % size.length];
          return (
            <Link key={p.id} href={`/p/${p.id}`} className="pause-item">
              <div className={`pause-block ${s} ${b}`}>
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt={title || "摄影作品"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
    </>
  );
}
