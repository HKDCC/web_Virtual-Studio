import { DetailBreadcrumb } from "./DetailBreadcrumb";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
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

function numberVal(prop: unknown): number | null {
  if (!isObj(prop) || prop["type"] !== "number") return null;
  const n = prop["number"];
  return typeof n === "number" ? n : null;
}

function dateVal(prop: unknown): string | null {
  if (!isObj(prop) || prop["type"] !== "date") return null;
  const d = prop["date"];
  if (!isObj(d)) return null;
  const start = d["start"];
  return typeof start === "string" ? start : null;
}

export function NoteDetailHeader(props: {
  title: string;
  properties: Record<string, unknown>;
  htmlContent?: string | null;
  pageIcon?: { type: "emoji" | "image"; value: string } | null;
}) {
  const p = props.properties;

  const cat = selectVal(p["Category"]) || selectVal(p["分类"]) || "读书笔记";
  const rawDate = dateVal(p["Date"]) || richTextPlain(p["Date"]) || "2026·05";
  const dateStr = rawDate.replace(/-/g, "·");
  const readTime = numberVal(p["ReadTime"]) || numberVal(p["阅读时间"]) || 15;
  const excerpt = richTextPlain(p["Excerpt"]) || richTextPlain(p["摘要"]);
  const tags = multiSelectVals(p["Tags"]).concat(multiSelectVals(p["标签"]));

  return (
    <div className="note-detail-header-wrapper">
      <div className="note-detail-header-container">
        <DetailBreadcrumb
          sectionTitle="02 笔记 · 深度长文"
          sectionHref="/archive?tab=notes"
          itemTitle={props.title}
          icon={props.pageIcon?.type === "emoji" ? props.pageIcon.value : "📝"}
        />

        <div className="note-detail-meta-box">
          <div className="note-meta-top">
            <span className="note-cat-tag">{cat}</span>
            <span className="note-meta-dot">·</span>
            <span className="note-date">{dateStr}</span>
            <span className="note-meta-dot">·</span>
            <span className="note-read-time">约 {readTime} 分钟阅读</span>
          </div>

          <h1 className="note-detail-title">{props.title}</h1>

          {excerpt && (
            <div className="note-detail-excerpt">
              <span className="note-excerpt-quote">“</span>
              <p>{excerpt}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="note-detail-tags">
              {tags.map((t) => (
                <span key={t} className="note-tag-pill">#{t}</span>
              ))}
            </div>
          )}

          {props.htmlContent && (
            <div className="note-interactive-banner">
              <span className="note-interactive-hint">✦ 本篇为高交互度沉浸式可视化长文</span>
              <a
                href={props.htmlContent}
                target="_blank"
                rel="noopener noreferrer"
                className="note-fullscreen-btn"
              >
                新窗口全屏打开 ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
