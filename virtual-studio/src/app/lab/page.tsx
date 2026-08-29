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
    const pObj = p as Record<string, unknown>;
    const title = getPageTitle(p) || "Untitled";
    const t = title.toLowerCase();
    let appIcon: { type: "emoji" | "image"; value: string } | null = null;
    if (t.includes("whisper")) appIcon = { type: "image", value: "/lab/icons/whisperx.png" };
    else if (t.includes("reader") || t.includes("minireader")) appIcon = { type: "image", value: "/lab/icons/minireader.png" };
    else if (t.includes("cassette") || t.includes("magiccutter") || t.includes("cutter")) appIcon = { type: "image", value: "/lab/icons/magiccutter.png" };
    else if (t.includes("memo") || t.includes("swiftmemo")) appIcon = { type: "image", value: "/lab/icons/swiftmemo.png" };
    else if (t.includes("snake") || t.includes("retro")) appIcon = { type: "image", value: "/lab/icons/snake.png" };
    else {
      const appIconFile = firstFileUrl(props["AppIcon"]);
      if (appIconFile) {
        appIcon = { type: "image", value: appIconFile };
      } else if (isObj(pObj.icon)) {
        const ic = pObj.icon as Record<string, unknown>;
        if (ic.type === "file" && isObj(ic.file) && typeof ic.file.url === "string") appIcon = { type: "image", value: ic.file.url };
        else if (ic.type === "external" && isObj(ic.external) && typeof ic.external.url === "string") appIcon = { type: "image", value: ic.external.url };
        else if (ic.type === "emoji" && typeof ic.emoji === "string") appIcon = { type: "emoji", value: ic.emoji };
      }
      if (!appIcon && t.includes("muse")) appIcon = { type: "emoji", value: "🌸" };
    }

    return {
      id: p.id,
      title,
      type: typeOf(p),
      badge: getRichText(props, "Badge"),
      description: getRichText(props, "Description"),
      github: getUrl(props, "GitHubURL"),
      demo: getUrl(props, "DemoURL"),
      iconUrl: firstFileUrl(props["Media"]) || firstFileUrl(props["DemoMedia"]) || firstFileUrl(props["Icon"]),
      appIcon,
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
