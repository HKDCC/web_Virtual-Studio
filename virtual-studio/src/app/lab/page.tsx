import { queryDatabaseAll } from "@/lib/notion";
import { env } from "@/lib/env";
import { getPageTitle, getRichText, getSelect, getUrl } from "@/lib/notionHelpers";
import { SetupNotice } from "@/components/SetupNotice";
import { LabTabs, type LabItem } from "@/components/lab/LabTabs";

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

function propsOf(p: { properties: unknown }): Record<string, unknown> {
  return p.properties as Record<string, unknown>;
}

function typeOf(p: { properties: unknown }): "ai" | "vibe" {
  const type = (getSelect(propsOf(p), "Type") ?? "").toLowerCase();
  return type.includes("vibe") ? "vibe" : "ai";
}

export default async function LabPage() {
  const db = env.NOTION_LAB_DB_ID;
  if (!env.NOTION_TOKEN || !db) return <SetupNotice title="Lab 需要配置 NOTION_TOKEN / NOTION_LAB_DB_ID" />;
  const items = await queryDatabaseAll({ databaseId: db, pageSize: 50, maxPages: 6 });

  const labItems: LabItem[] = items.map((p) => {
    const props = propsOf(p);
    return {
      id: p.id,
      title: getPageTitle(p) || "Untitled",
      type: typeOf(p),
      badge: getRichText(props, "Badge"),
      description: getRichText(props, "Description"),
      github: getUrl(props, "GitHubURL"),
      demo: getUrl(props, "DemoURL"),
      iconUrl: firstFileUrl(props["Icon"]),
    };
  });

  const ai = labItems.filter((p) => p.type === "ai");
  const vibe = labItems.filter((p) => p.type === "vibe");

  return (
    <>
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Lab · 输出层</p>
          <h1 className="section-title">实验室</h1>
        </div>
        <p className="section-desc">AI 实践记录与 Vibe Coding 成果。每个项目都是一次认知迭代。</p>
      </div>

      <LabTabs ai={ai} vibe={vibe} />
    </>
  );
}
