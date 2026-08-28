import Link from "next/link";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function firstFileUrl(filesProp: unknown): string | null {
  if (!isObj(filesProp)) return null;
  const files = filesProp["files"];
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
  if (t === "rich_text") {
    const arr = prop["rich_text"];
    if (!Array.isArray(arr)) return null;
    return arr.map((x) => (isObj(x) && typeof x["plain_text"] === "string" ? x["plain_text"] : "")).join("") || null;
  }
  if (t === "title") {
    const arr = prop["title"];
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

export function BookOverviewHeader(props: {
  title: string;
  properties: Record<string, unknown>;
}) {
  const p = props.properties;

  const author = richTextPlain(p["Author"]);
  const tagline = richTextPlain(p["Tagline"]);
  const rating = numberVal(p["MyRating"]);
  const downloadUrl = urlVal(p["DownloadURL"]);
  const coverUrl = firstFileUrl(p["Cover"]);
  const category = selectVal(p["分类"]);
  const status = selectVal(p["状态"]);
  const progress = numberVal(p["进度"]);
  const tags = multiSelectVals(p["标签"]);

  const stars = (rating ?? 0) / 1;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    <div className="book-overview">
      <div className="book-overview-back">
        <Link href="/archive" style={{ textDecoration: "none", color: "var(--ink-2)", fontSize: 13 }}>
          ← 返回书架
        </Link>
      </div>

      <div className="book-overview-grid">
        <div className="book-overview-cover">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={props.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div className="book-cover-placeholder">
              {props.title}
            </div>
          )}
        </div>

        <div className="book-overview-info">
          <h1 className="book-overview-title">{props.title}</h1>
          <div className="book-overview-meta">
            {author ? <span style={{ fontSize: 14, fontWeight: 500 }}>{author}</span> : null}
          </div>
          {rating !== null ? (
            <div className="book-overview-rating">
              {Array.from({ length: full }).map((_, i) => (
                <span key={`f-${i}`} style={{ color: "#E8A020" }}>★</span>
              ))}
              {half ? <span style={{ color: "#E8A020", opacity: 0.5 }}>★</span> : null}
              {Array.from({ length: empty }).map((_, i) => (
                <span key={`e-${i}`} style={{ color: "var(--bg-3)" }}>★</span>
              ))}
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", marginLeft: 6 }}>
                {rating.toFixed(1)} / 5
              </span>
            </div>
          ) : null}

          <div className="book-overview-meta-rows">
            {category && (
              <div className="meta-row">
                <span className="meta-label">分类</span>
                <span className="meta-value">{category}</span>
              </div>
            )}
            {status && (
              <div className="meta-row">
                <span className="meta-label">状态</span>
                <span className="meta-value">{status}</span>
              </div>
            )}
            {progress !== null && (
              <div className="meta-row">
                <span className="meta-label">进度</span>
                <span className="meta-value">{progress}%</span>
              </div>
            )}
            {tags.length > 0 && (
              <div className="meta-row meta-row-tags">
                <span className="meta-label">标签</span>
                <div className="meta-tags">
                  {tags.map((t) => (
                    <span key={t} className="book-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tagline ? (
            <p className="book-overview-tagline">{tagline}</p>
          ) : null}

          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="book-overview-download"
            >
              <span>📥</span> 书籍链接
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

