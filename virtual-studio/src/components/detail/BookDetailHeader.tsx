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

function numberVal(prop: unknown): number | null {
  if (!isObj(prop) || prop["type"] !== "number") return null;
  const n = prop["number"];
  return typeof n === "number" ? n : null;
}

function urlVal(prop: unknown): string | null {
  if (!isObj(prop) || prop["type"] !== "url") return null;
  const u = prop["url"];
  return typeof u === "string" ? u : null;
}

function selectVal(prop: unknown): string | null {
  if (!isObj(prop) || prop["type"] !== "select") return null;
  const s = prop["select"];
  if (!isObj(s)) return null;
  const name = s["name"];
  return typeof name === "string" ? name : null;
}

function multiSelectVals(prop: unknown): string[] {
  if (!isObj(prop) || prop["type"] !== "multi_select") return [];
  const ms = prop["multi_select"];
  if (!Array.isArray(ms)) return [];
  return ms.map((x) => (isObj(x) && typeof x["name"] === "string" ? x["name"] : "")).filter(Boolean);
}

export function BookDetailHeader(props: {
  title: string;
  properties: Record<string, unknown>;
  pageIcon?: { type: "emoji" | "image"; value: string } | null;
}) {
  const p = props.properties;

  const author = richTextPlain(p["Author"]) || richTextPlain(p["作者"]) || "未知作者";
  const tagline = richTextPlain(p["Tagline"]) || richTextPlain(p["一句话导读"]);
  const rating = numberVal(p["MyRating"]) ?? numberVal(p["Rating"]) ?? numberVal(p["评分"]);
  const downloadUrl = urlVal(p["DownloadURL"]) || urlVal(p["下载链接"]);
  const coverUrl = firstFileUrl(p["Cover"]) || firstFileUrl(p["封面"]);
  const category = selectVal(p["Category"]) || selectVal(p["分类"]);
  const status = selectVal(p["Status"]) || selectVal(p["状态"]);
  const tags = multiSelectVals(p["Tags"]).concat(multiSelectVals(p["标签"]));

  const stars = (rating ?? 0) / 1;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    <div className="book-overview-wrapper">
      <div className="book-overview-container">
        <DetailBreadcrumb
          sectionTitle="03 库 · 书架"
          sectionHref="/archive"
          itemTitle={props.title}
          icon={props.pageIcon?.type === "emoji" ? props.pageIcon.value : "📚"}
        />

        <div className="book-detail-hero">
          {/* 黄金比例 2:3 3D 实体书影 */}
          <div className="book-cover-frame">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={props.title}
                referrerPolicy="no-referrer"
                className="book-cover-img"
              />
            ) : (
              <div className="book-cover-placeholder-box">
                <span className="book-cover-placeholder-icon">📖</span>
                <span className="book-cover-placeholder-text">{props.title}</span>
              </div>
            )}
            <div className="book-spine-shadow" aria-hidden="true" />
          </div>

          <div className="book-detail-content">
            <div className="book-detail-header-row">
              {category && <span className="book-category-pill">{category}</span>}
              {status && <span className="book-status-pill">{status}</span>}
            </div>

            <h1 className="book-detail-title">{props.title}</h1>
            <p className="book-detail-author">著者 · {author}</p>

            {rating !== null && rating > 0 ? (
              <div className="book-detail-rating-bar">
                <span className="rating-stars">
                  {Array.from({ length: full }).map((_, i) => (
                    <span key={'f-' + i} className="star filled">★</span>
                  ))}
                  {half ? <span className="star half">★</span> : null}
                  {Array.from({ length: empty }).map((_, i) => (
                    <span key={'e-' + i} className="star empty">★</span>
                  ))}
                </span>
                <span className="rating-num">{rating.toFixed(1)} / 5.0</span>
              </div>
            ) : null}

            {tagline ? <p className="book-detail-tagline">“ {tagline} ”</p> : null}

            {tags.length > 0 && (
              <div className="book-detail-tags">
                {tags.map((t) => (
                  <span key={t} className="book-detail-tag">#{t}</span>
                ))}
              </div>
            )}

            <div className="book-detail-actions">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="book-download-btn"
                >
                  📥 电子书资源 / 检索 ↗
                </a>
              ) : null}
              <Link href="/archive" className="book-back-btn">
                ← 返回书库
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
