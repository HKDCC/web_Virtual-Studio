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

export function LabDetailHeader(props: {
  title: string;
  properties: Record<string, unknown>;
  pageIcon?: { type: "emoji" | "image"; value: string } | null;
}) {
  const p = props.properties;

  const desc = richTextPlain(p["Description"]) || richTextPlain(p["描述"]) || "";
  const badge = richTextPlain(p["Badge"]) || selectVal(p["Type"]) || "Vibe Coding";
  const ghUrl = urlVal(p["GitHubURL"]) || urlVal(p["GitHub"]);
  const demoUrl = urlVal(p["DemoURL"]) || urlVal(p["Demo"]);
  const iconImg = firstFileUrl(p["Icon"]);

  const localFallback =
    props.title.includes("MiniReader") || props.title.includes("Reader") ? "/lab/minireader.gif" :
    props.title.includes("Retro") || props.title.includes("Snake") ? "/lab/retro_pixel_snake.gif" :
    props.title.includes("MuseTodo") ? "/lab/musetodo_pink.gif" :
    props.title.includes("Cassette") ? "/lab/cassettecutter.jpg" :
    props.title.includes("SwiftMemo") ? "/lab/swiftmemo.jpg" : null;

  const mediaSrc = localFallback || iconImg;

  return (
    <div className="lab-detail-header-wrapper">
      <div className="lab-detail-header-container">
        <DetailBreadcrumb
          sectionTitle="01 实验室 · 产品看板"
          sectionHref="/#lab"
          itemTitle={props.title}
          icon={props.pageIcon?.type === "emoji" ? props.pageIcon.value : "🧪"}
        />

        <div className="lab-detail-hero-card">
          <div className="lab-detail-hero-info">
            <div className="lab-hero-top-row">
              {props.pageIcon?.type === "emoji" && (
                <span className="lab-hero-icon-emoji">{props.pageIcon.value}</span>
              )}
              {props.pageIcon?.type === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={props.pageIcon.value} alt="" className="lab-hero-icon-img" />
              )}
              <span className="lab-hero-badge">{badge}</span>
            </div>

            <h1 className="lab-detail-hero-title">{props.title}</h1>
            {desc && <p className="lab-detail-hero-desc">{desc}</p>}

            <div className="lab-hero-actions">
              {ghUrl && (
                <a href={ghUrl} target="_blank" rel="noopener noreferrer" className="lab-action-btn primary">
                  GitHub 源码仓库 ↗
                </a>
              )}
              {demoUrl && (
                <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="lab-action-btn secondary">
                  在线体验 / Release ↗
                </a>
              )}
              <Link href="/#lab" className="lab-action-btn neutral">
                ← 返回实验室
              </Link>
            </div>
          </div>

          {mediaSrc && (
            <div className="lab-detail-hero-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaSrc} alt={props.title} className="lab-hero-media-img" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
