import Link from "next/link";
import { DetailBreadcrumb } from "./DetailBreadcrumb";

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

function richTextPlain(prop: unknown): string | null {
  if (!isObj(prop) || typeof prop["type"] !== "string") return null;
  const t = prop["type"];
  if (t === "rich_text" || t === "title") {
    const arr = (prop as Record<string, unknown>)[t];
    if (!Array.isArray(arr)) return null;
    return arr.map((x) => (isObj(x) && typeof x["plain_text"] === "string" ? x["plain_text"] : "")).join("") || null;
  }
  return null;
}

function dateVal(prop: unknown): string | null {
  if (!isObj(prop) || prop["type"] !== "date") return null;
  const d = prop["date"];
  if (!isObj(d)) return null;
  const start = d["start"];
  return typeof start === "string" ? start : null;
}

export function PauseDetailHeader(props: {
  title: string;
  properties: Record<string, unknown>;
  pageCover?: string | null;
}) {
  const p = props.properties;

  const loc = richTextPlain(p["Location"]) || richTextPlain(p["地点"]) || "世界角落";
  const rawDate = dateVal(p["Date"]) || richTextPlain(p["Date"]) || "2026·05";
  const dateStr = rawDate.replace(/-/g, "·");
  const desc = richTextPlain(p["Description"]) || "";
  const photoUrl = firstFileUrl(p["Cover"]) || props.pageCover || "/photos/photo_1_.jpeg";

  return (
    <div className="pause-detail-header-wrapper">
      <div className="pause-detail-header-container">
        <DetailBreadcrumb
          sectionTitle="05 隙 · 胶片画廊"
          sectionHref="/#pause"
          itemTitle={props.title}
          icon="📸"
        />

        <div className="pause-detail-gallery-card">
          <div className="pause-photo-lightbox-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={props.title}
              className="pause-detail-main-img"
              loading="eager"
            />
          </div>

          <div className="pause-detail-meta-plaque">
            <div className="pause-plaque-top">
              <h1 className="pause-plaque-title">{props.title}</h1>
              <div className="pause-plaque-tags">
                <span className="pause-plaque-loc">◉ {loc}</span>
                <span className="pause-plaque-date">✦ {dateStr}</span>
              </div>
            </div>

            {desc && <p className="pause-plaque-desc">“ {desc} ”</p>}

            <div className="pause-plaque-actions">
              <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="pause-download-photo-btn">
                查看高保真原片 ↗
              </a>
              <Link href="/#pause" className="pause-back-btn">
                ← 返回隙·画廊
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
