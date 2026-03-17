import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getMultiSelect, getPageTitle, getRichText, getSelect, getUrl } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";
import { WorkflowTabs, type WorkflowItem } from "@/components/workflow/WorkflowTabs";

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toSection(v: string | null): WorkflowItem["section"] | null {
  const s = (v ?? "").toLowerCase().trim();
  if (s === "tools" || s === "tool" || s.includes("工具")) return "tools";
  if (s === "websites" || s === "website" || s.includes("网站")) return "websites";
  if (s === "setup" || s.includes("装备")) return "setup";
  if (s === "prompts" || s === "prompt" || s.includes("提示")) return "prompts";
  return null;
}

export default async function WorkflowPage() {
  const db = env.NOTION_WORKFLOW_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Workflow 需要配置 NOTION_TOKEN / NOTION_WORKFLOW_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 10 });

  const mapped: WorkflowItem[] = [];
  for (const p of items) {
    const props = p.properties as unknown as Record<string, unknown>;

    const section = toSection(getSelect(props, "Section"));
    if (!section) continue;

    const emoji = getRichText(props, "Emoji");
    const badge = getSelect(props, "Badge");
    const description = getRichText(props, "Description");
    const tags = getMultiSelect(props, "Tags");
    const siteUrl = getUrl(props, "SiteURL");
    const ratingRaw = props["Rating"];
    const rating =
      isObj(ratingRaw) && ratingRaw["type"] === "number" && typeof ratingRaw["number"] === "number" ? ratingRaw["number"] : null;

    mapped.push({
      id: p.id,
      section,
      title: getPageTitle(p) || "Untitled",
      description,
      emoji,
      badge,
      tags,
      siteUrl,
      rating,
      scene: getSelect(props, "Scene"),
      params: getRichText(props, "Params"),
      promptZh: getRichText(props, "PromptZH"),
      promptEn: getRichText(props, "PromptEN"),
    });
  }

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Workflow · 效率层</p>
          <h1 className="section-title">工作流</h1>
        </div>
        <p className="section-desc">工具是思维的延伸。每一个工具的选择，都是对某种工作哲学的认同。</p>
      </div>

      <WorkflowTabs items={mapped} />
    </>
  );
}

