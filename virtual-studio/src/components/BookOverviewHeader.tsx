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

  const stars = (rating ?? 0) / 1;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 48px 0" }}>
      <div style={{ marginBottom: 18 }}>
        <Link href="/archive" style={{ textDecoration: "none", color: "var(--ink-2)", fontSize: 13 }}>
          ← 返回书架
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 40,
          marginBottom: 36,
          paddingBottom: 32,
          borderBottom: "1px solid var(--bg-3)",
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "2 / 3",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            background: "var(--bg-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            color: "white",
            fontFamily: "var(--serif)",
            textAlign: "center",
          }}
        >
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt={props.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #8B7355, #5a4a38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {props.title}
            </div>
          )}
        </div>

        <div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 300, lineHeight: 1.3, marginBottom: 14 }}>{props.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {author ? <span style={{ fontSize: 14, fontWeight: 500 }}>{author}</span> : null}
          </div>
          {rating !== null ? (
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 16 }}>
              {Array.from({ length: full }).map((_, i) => (
                <span key={`f-${i}`} style={{ color: "#E8A020" }}>
                  ★
                </span>
              ))}
              {half ? (
                <span style={{ color: "#E8A020", opacity: 0.5 }}>
                  ★
                </span>
              ) : null}
              {Array.from({ length: empty }).map((_, i) => (
                <span key={`e-${i}`} style={{ color: "var(--bg-3)" }}>
                  ★
                </span>
              ))}
              <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink-3)", marginLeft: 6 }}>
                我的评分 {rating.toFixed(1)} / 5
              </span>
            </div>
          ) : null}

          {tagline ? (
            <p
              style={{
                fontFamily: "var(--serif)",
                fontSize: 15,
                fontStyle: "italic",
                color: "var(--accent)",
                lineHeight: 1.6,
                marginBottom: 18,
                paddingLeft: 14,
                borderLeft: "3px solid var(--accent-soft)",
              }}
            >
              {tagline}
            </p>
          ) : null}

          {downloadUrl ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: 8,
                  fontSize: 13,
                  textDecoration: "none",
                  fontWeight: 400,
                }}
              >
                <span>📥</span> 书籍链接
              </a>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>来自 Notion: DownloadURL</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

