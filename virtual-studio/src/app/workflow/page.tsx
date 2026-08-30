import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getMultiSelect, getPageTitle, getRichText, getSelect, getUrl, getDate } from "@/lib/notionHelpers";
import { WorkflowTabs } from "@/components/workflow/WorkflowTabs";
import { RawWorkflowItem, RawNoteItem } from "@/lib/graphEngine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function WorkflowPage() {
  const workflowDb = env.NOTION_WORKFLOW_DB_ID;
  const notesDb = env.NOTION_NOTES_DB_ID;

  const rawItems: RawWorkflowItem[] = [];
  const rawNotes: RawNoteItem[] = [];

  // Fetch Workflow Entities
  if (env.NOTION_TOKEN && workflowDb) {
    try {
      const items = await queryDatabaseAll({ databaseId: workflowDb, pageSize: 100, maxPages: 5 });
      for (const p of items) {
        const props = p.properties as unknown as Record<string, unknown>;
        const section = getSelect(props, "Section") || "tools";
        const emoji = getRichText(props, "Emoji");
        const badge = getSelect(props, "Badge");
        const description = getRichText(props, "Description");
        const tags = getMultiSelect(props, "Tags");
        const siteUrl = getUrl(props, "SiteURL");
        const ratingRaw = props["Rating"];
        const rating =
          isObj(ratingRaw) && ratingRaw["type"] === "number" && typeof ratingRaw["number"] === "number"
            ? ratingRaw["number"]
            : null;
        const iconUrl = firstFileUrl(props["Icon"]);

        rawItems.push({
          id: p.id,
          section,
          title: getPageTitle(p) || "Untitled",
          description,
          emoji,
          iconUrl,
          badge,
          tags,
          siteUrl,
          rating,
          promptZh: getRichText(props, "PromptZH"),
          promptEn: getRichText(props, "PromptEN"),
        });
      }
    } catch (err) {
      console.error("Failed to fetch Notion Workflow DB:", err);
    }
  }

  // Fetch Notes for Appendix
  if (env.NOTION_TOKEN && notesDb) {
    try {
      const notesItems = await queryDatabaseAll({ databaseId: notesDb, pageSize: 50, maxPages: 2 });
      for (const p of notesItems) {
        const props = p.properties as unknown as Record<string, unknown>;
        const title = getPageTitle(p) || "Untitled";
        const category = getSelect(props, "Category");
        const date = getDate(props, "Date");
        const tags = getMultiSelect(props, "Tags");
        const excerpt = getRichText(props, "Summary") || getRichText(props, "Excerpt");

        rawNotes.push({
          id: p.id,
          title,
          category,
          date,
          tags,
          excerpt,
        });
      }
    } catch (err) {
      console.error("Failed to fetch Notion Notes DB:", err);
    }
  }

  return (
    <div className="wrap" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      {/* Editorial Masthead Banner */}
      <div style={{ marginBottom: "32px", borderBottom: "1px solid var(--line)", paddingBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            VOL. 04 · WORKFLOW HUB
          </span>
          <span style={{ fontSize: "11px", color: "var(--ink-3)" }}>|</span>
          <span style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--ink-3)" }}>
            THREE.JS 3D ASTROLABE · 双链知识星系
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontFamily: "var(--serif)", fontWeight: 900, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>
          工作流与生产力星象仪
        </h1>
        <p style={{ fontSize: "14px", color: "var(--ink-2)", maxWidth: "720px", margin: "10px 0 0", lineHeight: 1.7 }}>
          工具是思维的延伸，工作流是人机协同的实践结晶。在此探索正在运行的自动化链路、高频工具拓扑网络，以及由这些工作流沉淀出的深度复盘笔记。
        </p>
      </div>

      {/* Main Interactive Coordinator */}
      <WorkflowTabs items={rawItems} notes={rawNotes} />
    </div>
  );
}
